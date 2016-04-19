var colors = require('colors');

var config = require('../config');
var Utils = require('../utils');

var ip = config.forceIp ? config.forceIp : '223.252.199.7';
var utils = new Utils(ip);

var modify = function*(next) {
  var _this = this;
  var req = _this.request;
  var res = _this.response;

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

    var data = JSON.parse(_this.defaultBody);
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
