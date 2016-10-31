import request from 'request';
import getRawBody from 'raw-body';
import extend from 'extend';
import config from '../config';
import common from '../utils/common';


// 封装 request post
let post = function(url, headers, body) {
  let options = {
    url: url,
    headers: headers,
    method: 'post',
    encoding: null,
    gzip: true
  };
  if (!!body) {
    options.body = body;
  }

  return new Promise((resolve, reject) => {
    common.sendRequest(options)
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
    let result = await post(url, req.headers, rawBody);
    let headers = result.res.headers;
    let body = result.body;
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
