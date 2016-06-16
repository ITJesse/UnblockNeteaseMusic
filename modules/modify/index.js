var colors = require('colors');

var Utils = require('../utils');

var utils = new Utils();

var modify = function*(next) {
  var _this = this;
  var req = _this.request;
  var res = _this.response;

  var songId,
      urlInfo;

  if (/^\/eapi\/song\/enhance\/player\/url/.test(req.url)) {
    var data = '';

    try {
      data = JSON.parse(_this.defaultBody);
    } catch (err) {
      console.error(err);
      return next;
    }
    var newData = [];
    for (var row of data["data"]) {
      var playbackReturnCode = row.code;
      songId = row.id;

      if (playbackReturnCode != 200) {
        urlInfo = yield utils.getUrlInfo(songId);
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
    return next;

  }

  else if (/^\/eapi\/song\/enhance\/download\/url/.test(req.url)) {

    if (utils.netease.getDownloadReturnCode(_this.defaultBody) != 200) {
      songId = utils.netease.getDownloadSongId(_this.defaultBody);
      urlInfo = yield utils.getUrlInfo(songId);
      if (urlInfo) {
        _this.defaultBody = utils.netease.modifyDownloadApiCustom(urlInfo, _this.defaultBody);
      } else {
        console.log('No resource.'.red);
      }
      return next;
    } else {
      console.log('Download bitrate is not changed. The song URL is '.green + utils.netease.getDownloadUrl(_this.defaultBody).green);
      return next;
    }
  }

  else {
    return next;
  }

};

module.exports = modify;
