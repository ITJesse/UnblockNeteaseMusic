var request = require('request');
var getRawBody = require('raw-body');
var extend = require('extend');
var zlib = require('zlib');
var Readable = require('stream').Readable;

var config = require('../config');

var ip = config.forceIp ? config.forceIp : '223.252.199.7';

var sendRequest = function(options) {
  var defaults = {
    method: 'get',
    followRedirect: false,
    timeout: 2000
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

  if (!/^http/.test(req.url)) {
    var url = 'http://' + ip + req.url;
  } else {
    var url = req.url;
  }

  // console.log(url);
  // console.log(req.headers);

  if (req.method == 'GET') {
    var result = yield get(url, req.headers);
    var headers = result[0].headers;
    var body = result[1];
    _this.set(headers);
    _this.body = body;
  }

  if (req.method == 'POST') {
    var rawBody = yield getRawBody(_this.req, {
      length: _this.length,
      encoding: _this.charset
    });
    var result = yield post(url, req.headers, rawBody);
    var headers = result[0].headers;
    var body = result[1];
    // console.log(body);
    delete headers['content-encoding']; // 删除 header 中 gzip 标识，因为 body 已经被解压了
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
