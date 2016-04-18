var request = require('request');
var config = require('../config');

var ip = config.forceIp ? config.forceIp : '223.252.199.7';
var baseUrl = "http://" + ip;

var proxy = function*(next) {
  var _this = this;

  var url = _this.path;
  if(!/^http/.test(url)){
    url = baseUrl + url;
  }
  console.log(_this.headers);
  // var options = {
  //     url: url,
  //     headers: req.headers,
  //     method: 'get',
  //     followRedirect: false,
  //   };
  //   request(options)
  //     .on('error', function(err) {
  //       console.error(err.red)
  //     })
  //     .pipe(res);
}

module.exports = proxy;
