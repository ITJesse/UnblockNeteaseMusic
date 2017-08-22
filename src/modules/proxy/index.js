import getRawBody from 'raw-body';
import config from '../config';
import * as common from '../utils/common';

const middleware = async function (ctx, next) {
  const req = ctx.request;

  if (req.url.indexOf('/api/plugin') !== -1) {
    let rawBody;
    try {
      rawBody = await getRawBody(ctx.req, {
        length: ctx.length,
        encoding: ctx.charset,
      });
    } catch (error) {
      console.log('Cannot get post body.'.red);
      throw new Error(error);
    }
    ctx.body = rawBody;
    await next();
  } else if (req.method === 'POST') {
    const ip = config.forceIp ? config.forceIp : '223.252.199.7';
    const url = `http://${ip}${req.url}`;

    const newHeader = {
      ...req.headers,
      host: 'music.163.com',
    };

    const rawBody = await getRawBody(ctx.req, {
      length: ctx.length,
      encoding: ctx.charset,
    });

    const options = {
      url,
      headers: newHeader,
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
    let result;
    try {
      result = await common.sendRequest(options);
    } catch (err) {
      console.log('Cannot get orignal response.'.red);
      throw new Error(err);
    }

    const headers = result.headers;
    const body = result.body;
    delete headers['content-encoding'];
    ctx.set(headers);
    ctx.body = body.toString();
    await next();
    // console.log(ctx.body);
  }
};

export default middleware;
