var colors = require('colors');
var netease = require('./netease');
var kugou = require('./kugou');

var utils = function() {
  this.netease = new netease();
  this.kugou = new kugou();
}

module.exports = utils;
