import getRawBody from 'raw-body';
import zlib from 'zlib';

import config from '../../config';
import { sendRequest } from '../../utils';

export const proxy = async function (ctx, next) {
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
      'x-real-ip': `202.114.79.${Math.floor(Math.random() * 255) + 1}`,
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
      result = await sendRequest(options);
    } catch (err) {
      console.log('Cannot get orignal response.'.red);
      throw new Error(err);
    }

    const headers = result.headers;
    const body = result.body;
    ctx.body = body.toString();
    await next();

    if (typeof ctx.body === 'object') {
      ctx.body = JSON.stringify(ctx.body);
    }
    if (typeof ctx.body === 'string') {
      ctx.compress = true;
      const stream = zlib.createGzip();
      stream.end(ctx.body);
      ctx.body = stream;
      headers['content-encoding'] = 'gzip';
    } else {
      delete headers['content-encoding'];
    }
    // console.log(headers);
    ctx.set(headers);
    // console.log(ctx.body);
  }
};

export default proxy;
