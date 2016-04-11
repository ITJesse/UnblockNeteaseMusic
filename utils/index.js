var colors = require('colors');
var netease = require('./netease');
var kugou = require('./kugou');

var utils = function(ip) {
  this.netease = new netease(ip);
  this.kugou = new kugou();
}

module.exports = utils;
