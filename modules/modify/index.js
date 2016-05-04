var colors = require('colors');

var Utils = require('../utils');

var utils = new Utils();

var modify = function*(next) {
  var _this = this;
  var req = _this.request;
  var res = _this.response;

  req.url = req.url.replace(/^http:\/\/music.163.com/, '');

  if (/^\/qqmusic/.test(req.url)) {
    req.headers['user-agent'] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.86 Safari/537.36";
    req.headers['host'] = "tsmusic24.tc.qq.com";
    req.url = "http://tsmusic24.tc.qq.com" + req.url.replace("/qqmusic", "");
    yield next;
  }

  if (/^\/eapi\/osx\/version/.test(req.url)) {
    var v = JSON.parse(_this.defaultBody);
    v.updateFiles = [];
    _this.defaultBody = JSON.stringify(v);
    yield next;
  }

  if (/^\/eapi\/v3\/song\/detail/.test(req.url) ||
    /^\/eapi\/v3\/playlist\/detail/.test(req.url) ||
    /^\/eapi\/v1\/album/.test(req.url) ||
    /^\/eapi\/batch/.test(req.url) ||
    /^\/eapi\/cloudsearch\/pc/.test(req.url) ||
    /^\/eapi\/v1\/artist/.test(req.url) ||
    /^\/eapi\/v1\/search\/get/.test(req.url) ||
    /^\/eapi\/song\/enhance\/privilege/.test(req.url) ||
    /^\/eapi\/v1\/discovery\/new\/songs/.test(req.url) ||
    /^\/eapi\/v1\/play\/record/.test(req.url)) {

    _this.defaultBody = utils.netease.modifyDetailApi(this.defaultBody);
    yield next;

  } else if (/^\/eapi\/song\/enhance\/player\/url/.test(req.url)) {

    try {
      var data = JSON.parse(_this.defaultBody);
    } catch (err) {
      console.error(err);
      return next;
    }
    var newData = [];
    for (var row of data["data"]) {
      var playbackReturnCode = row.code;
      var songId = row.id;

      if (playbackReturnCode != 200) {
        var songId = row.id;
        var urlInfo = yield utils.getUrlInfo(songId);
        if (urlInfo) {
          row = utils.netease.modifyPlayerApiCustom(urlInfo, row);
        } else {
          console.log('No resource.'.red);
        }
      } else {
        console.log('Playback bitrate is not changed. The song URL is '.green + row.url);
      }
      newData.push(row);
    }
    data["data"] = newData;
    _this.defaultBody = JSON.stringify(data);
    yield next;

  } else if (/^\/eapi\/song\/enhance\/download\/url/.test(req.url)) {

    if (utils.netease.getDownloadReturnCode(_this.defaultBody) != 200) {
      var songId = utils.netease.getDownloadSongId(_this.defaultBody);
      var urlInfo = yield utils.getUrlInfo(songId);
      if (urlInfo) {
        _this.defaultBody = utils.netease.modifyDownloadApiCustom(urlInfo, _this.defaultBody);
      } else {
        console.log('No resource.'.red);
      }
      yield next;
    } else {
      console.log('Download bitrate is not changed. The song URL is '.green + utils.netease.getDownloadUrl(_this.defaultBody).green);
      yield next;
    }
  }
}

module.exports = modify;
