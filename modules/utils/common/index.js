var request = require('request');
var extend = require('extend');

var common = {};

common.sendRequest = function(options) {
  var defaults = {
    method: 'get',
    followRedirect: true,
    timeout: 5000
  }
  options = extend(false, defaults, options);
  return new Promise((resolve, reject) => {
    request(options, function(err, res, body) {
      if (err) {
        reject(err);
      } else {
        resolve([res, body]);
      }
    });
  });
};

module.exports = common;
