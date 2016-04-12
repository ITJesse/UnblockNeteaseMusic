var express = require('express');
var router = express.Router();
var colors = require('colors');

var Utils = require('../utils');
var config = require('../config');

var ip = config.forceIp ? config.forceIp : '223.252.199.7';
var utils = new Utils(ip);

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
  var amount = JSON.parse(res.defaultBody)["data"].length;
  var count = 0;
  function complete(){
    count++;
    if(count == amount){
      next();
    }
  }

  for(var i=0; i<amount; i++){
    if (utils.netease.getPlaybackReturnCode(res.defaultBody, i) != 200 || utils.netease.getPlaybackBitrate(res.defaultBody, i) < 320000) {
      var songId = utils.netease.getPlaybackSongId(res.defaultBody, i);
      utils.getUrlInfo(songId, i, function(err, url, hash, bitrate, filesize, index){
        if(!err){
          res.defaultBody = utils.netease.modifyPlayerApiCustom(url, hash, bitrate, filesize, res.defaultBody, index);
        }
        complete();
      });
    } else {
      console.log('Playback bitrate is not changed. The song URL is '.green + utils.netease.getPlaybackUrl(res.defaultBody, i).green);
      complete();
    }
  }
});

router.post('/eapi/song/enhance/download/url', function(req, res, next) {
  if (utils.netease.getDownloadReturnCode(res.defaultBody) != 200 || utils.netease.getDownloadBitrate(res.defaultBody) < 320000) {
    var songId = utils.netease.getDownloadSongId(res.defaultBody);
    utils.getUrlInfo(songId, null, function(err, url, hash, bitrate, filesize){
      if(!err){
        res.defaultBody = utils.netease.modifyDownloadApiCustom(url, hash, bitrate, filesize, res.defaultBody);
      }
      next();
    });
  } else {
    console.log('Download bitrate is not changed. The song URL is '.green + utils.netease.getDownloadUrl(res.defaultBody).green);
    next();
  }
});

router.all('/*', function(req, res, next) {
  // console.log(utils.headers);
  // console.log(res.defaultBody);
  res.send(res.defaultBody);
});

module.exports = router;
