var request = require('request');
var getRawBody = require('raw-body');
var extend = require('extend');
var zlib = require('zlib');
var Readable = require('stream').Readable;
var PassThrough = require('stream').PassThrough;

var config = require('../config');

var ip = config.forceIp ? config.forceIp : '223.252.199.7';

var sendRequest = function(options) {
  var defaults = {
    method: 'get',
    followRedirect: false,
    timeout: 10000
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
}

// 封装 request get
var get = function(url, headers) {
  var options = {
    url: url,
    headers: headers,
    encoding: null, // 不解析 get 请求，直接返回 Buffer
  }

  return new Promise((resolve, reject) => {
    sendRequest(options)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

// 封装 request post
var post = function(url, headers, body) {
  var options = {
    url: url,
    headers: headers,
    method: 'post',
    gzip: true,
  };
  if (!!body) {
    options.body = body;
  }

  return new Promise((resolve, reject) => {
    sendRequest(options)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

var middleware = function*(next) {
  var _this = this;
  var req = _this.request;
  var res = _this.reponse;

  // console.log(url);
  // console.log(req.headers);

  if (req.method == 'GET') {
    yield next;

    if (!/^http/.test(req.url)) {
      req.url = 'http://' + ip + req.url;
    }

    _this.body = PassThrough();

    var options = {
      url: req.url,
      headers: req.headers,
      method: "get",
      timeout: 10000
    }

    request(options)
      .on('error', (err) => {
        console.log(err);
        return reject(err);
      })
      .on('response', (response) => {
        _this.status = response.statusCode;
        _this.set(response.headers);
      })
      .pipe(_this.body);
  }

  if (req.method == 'POST') {
    if (!/^http/.test(req.url)) {
      var url = 'http://' + ip + req.url;
    } else {
      var url = req.url;
    }
    var rawBody = yield getRawBody(_this.req, {
      length: _this.length,
      encoding: _this.charset
    });
    var result = yield post(url, req.headers, rawBody);
    var headers = result[0].headers;
    var body = result[1];
    // console.log(body);
    _this.set(headers);
    _this.defaultBody = body;

    // console.log("before: " +  _this.defaultBody);
    yield next;
    // console.log("after: " +  _this.defaultBody);

    var stream = new Readable;
    stream.push(_this.defaultBody);
    stream.push(null);

    var gzip = zlib.createGzip();
    _this.set('Content-Encoding', 'gzip');
    _this.body = gzip;
    stream.pipe(gzip);
  }
}

module.exports = middleware;
