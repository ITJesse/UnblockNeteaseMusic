import getRawBody from 'raw-body';
import config from '../config';
import * as common from '../utils/common';

const middleware = async function (ctx, next) {
  const req = ctx.request;

  if (req.method === 'POST') {
    const ip = config.forceIp ? config.forceIp : '223.252.199.7';
    const url = `http://${ip}${req.url}`;
    req.headers.host = 'music.163.com';

    const rawBody = await getRawBody(ctx.req, {
      length: ctx.length,
      encoding: ctx.charset,
    });

    delete req.headers['x-real-ip'];
    const options = {
      url,
      headers: req.headers,
      method: 'post',
      encoding: null,
      gzip: true,
    };
    if (rawBody) {
      options.body = rawBody;
      try {
        req.body = rawBody.toString();
      } catch (err) {
        console.log('Body is not string.');
      }
    }
    const result = await common.sendRequest(options);

    const headers = result.headers;
    const body = result.body;
    delete headers['content-encoding'];
    // console.log(body);
    ctx.set(headers);
    ctx.body = body;
    await next();
    // console.log(ctx.body);
  }
};

export default middleware;
