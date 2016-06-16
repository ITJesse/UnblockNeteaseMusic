var request = require('request');
var getRawBody = require('raw-body');
var extend = require('extend');

var config = require('../config');


var sendRequest = function(options) {
  var defaults = {
    method: 'get',
    followRedirect: false,
    timeout: 10000
  };
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

// 封装 request post
var post = function(url, headers, body) {
  var options = {
    url: url,
    headers: headers,
    method: 'post',
    gzip: true
  };
  if (!!body) {
    options.body = body;
  }

  return new Promise((resolve, reject) => {
    sendRequest(options)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

var middleware = function*(next) {
  var _this = this;
  var req = _this.request;
  var res = _this.reponse;

  if (req.method == 'POST') {
    var ip = config.forceIp ? config.forceIp : '223.252.199.7';
    var url = 'http://' + ip + req.url;
    req.headers['host'] = 'music.163.com';

    var rawBody = yield getRawBody(_this.req, {
      length: _this.length,
      encoding: _this.charset
    });
    // console.log(rawBody.toString());
    var result = yield post(url, req.headers, rawBody);
    var headers = result[0].headers;
    var body = result[1];
    delete headers['content-encoding'];
    // console.log(body);
    _this.set(headers);
    _this.defaultBody = body;

    // console.log("before: " +  _this.defaultBody);
    yield next;
    // console.log("after: " +  _this.defaultBody);

    _this.body = _this.defaultBody;
  }
};

module.exports = middleware;
