import request from 'request';
import getRawBody from 'raw-body';
import extend from 'extend';
import config from '../config';


let sendRequest = function(options) {
  let defaults = {
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
let post = function(url, headers, body) {
  let options = {
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

let middleware = async function(ctx, next) {
  let req = ctx.request;
  let res = ctx.reponse;

  if (req.method == 'POST') {
    let ip = config.forceIp ? config.forceIp : '223.252.199.7';
    let url = 'http://' + ip + req.url;
    req.headers['host'] = 'music.163.com';

    let rawBody = await getRawBody(ctx.req, {
      length: ctx.length,
      encoding: ctx.charset
    });
    // console.log(rawBody.toString());
    let result = await post(url, req.headers, rawBody);
    let headers = result[0].headers;
    let body = result[1];
    delete headers['content-encoding'];
    // console.log(body);
    ctx.set(headers);
    ctx.defaultBody = body;

    // console.log("before: " +  ctx.defaultBody);
    await next();
    // console.log("after: " +  ctx.defaultBody);

    ctx.body = ctx.defaultBody;
  }
};

export default middleware;
