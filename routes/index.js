var express = require('express');
var router = express.Router();
var Utils = require('../utils');
var colors = require('colors');
var waterfall = require("async/waterfall");

var utils = new Utils();

router.post('/eapi/v3/song/detail', function(req, res, next) {
  res.defaultBody = utils.netease.modifyDetailApi(res.defaultBody);
  next();
});
router.post('/eapi/v3/playlist/detail', function(req, res, next) {
  res.defaultBody = utils.netease.modifyDetailApi(res.defaultBody);
  next();
});
router.post('/eapi/v1/album/*', function(req, res, next) {
  res.defaultBody = utils.netease.modifyDetailApi(res.defaultBody);
  next();
});
router.post('/eapi/batch', function(req, res, next) {
  res.defaultBody = utils.netease.modifyDetailApi(res.defaultBody);
  next();
});
router.post('/eapi/cloudsearch/pc', function(req, res, next) {
  res.defaultBody = utils.netease.modifyDetailApi(res.defaultBody);
  next();
});
router.post('/eapi/v1/artist', function(req, res, next) {
  res.defaultBody = utils.netease.modifyDetailApi(res.defaultBody);
  next();
});
router.post('/eapi/batch', function(req, res, next) {
  res.defaultBody = utils.netease.modifyDetailApi(res.defaultBody);
  next();
});
router.post('/eapi/v1/search/get', function(req, res, next) {
  res.defaultBody = utils.netease.modifyDetailApi(res.defaultBody);
  next();
});
router.post('/eapi/song/enhance/privilege', function(req, res, next) {
  res.defaultBody = utils.netease.modifyDetailApi(res.defaultBody);
  next();
});
router.post('/eapi/v1/discovery/new/songs', function(req, res, next) {
  res.defaultBody = utils.netease.modifyDetailApi(res.defaultBody);
  next();
});
router.post('/eapi/v1/play/record', function(req, res, next) {
  res.defaultBody = utils.netease.modifyDetailApi(res.defaultBody);
  next();
});

router.post('/eapi/song/enhance/player/url', function(req, res, next) {
  if (utils.netease.getPlaybackReturnCode(res.defaultBody) != 200 || utils.netease.getPlaybackBitrate(res.defaultBody) < 320000) {
    waterfall([
      function(callback) {
        var songId = utils.netease.getPlaybackSongId(res.defaultBody);
        callback(null, songId);
      },
      function(songId, callback) {
        utils.netease.getSongDetail(songId, function(err, detail) {
          if (err) {
            console.error(err);
          } else {
            callback(null, detail);
          }
        });
      },
      function(detail, callback) {
        var songName = utils.netease.getSongName(detail);
        var artist = utils.netease.getArtistName(detail);
        utils.kugou.search(songName, artist, function(err, hash, bitrate) {
          if (err) {
            console.error(err);
          } else {
            callback(null, hash, bitrate);
          }
        });
      },
      function(hash, bitrate, callback) {
        utils.kugou.getUrl(hash, function(err, url) {
          if (err) {
            console.error(err);
          } else {
            callback(null, url, bitrate);
          }
        });
      }
    ], function(err, url, bitrate) {
      if(err) {
        console.error(err);
        res.status = 500;
        res.send();
      }else{
        res.defaultBody = utils.netease.modifyPlayerApiCustom(url, bitrate, res.defaultBody);
        next();
      }
    });
  } else {
    console.log('Playback bitrate is not changed. The song URL is '.green + utils.getPlaybackUrl().green);
    next();
  }
});

router.post('/eapi/song/enhance/download/url', function(req, res, next) {
  if (utils.netease.getDownloadReturnCode(res.defaultBody) != 200 || utils.netease.getDownloadBitrate(res.defaultBody) < 320000) {
    waterfall([
      function(callback) {
        var songId = utils.netease.getDownloadSongId(res.defaultBody);
        callback(null, songId);
      },
      function(songId, callback) {
        utils.netease.getSongDetail(songId, function(err, detail) {
          if (err) {
            console.error(err);
          } else {
            callback(null, detail);
          }
        });
      },
      function(detail, callback) {
        var songName = utils.netease.getSongName(detail);
        var artist = utils.netease.getArtistName(detail);
        utils.kugou.search(songName, artist, function(err, hash, bitrate) {
          if (err) {
            console.error(err);
          } else {
            callback(null, hash, bitrate);
          }
        });
      },
      function(hash, bitrate, callback) {
        utils.kugou.getUrl(hash, function(err, url) {
          if (err) {
            console.error(err);
          } else {
            callback(null, url, bitrate);
          }
        });
      }
    ], function(err, url, bitrate) {
      if(err) {
        console.error(err);
        res.status = 500;
        res.send();
      }else{
        res.defaultBody = utils.netease.modifyDownloadApiCustom(url, bitrate, res.defaultBody);
        next();
      }
    });
  } else {
    console.log('Download bitrate is not changed. The song URL is '.green + utils.getPlaybackUrl().green);
    next();
  }
});

router.all('/*', function(req, res, next) {
  // console.log(utils.headers);
  // console.log(res.defaultBody);
  res.send(res.defaultBody);
});

module.exports = router;
