import 'colors';
import Koa from 'koa';
import logger from 'koa-logger';
import route from 'koa-route';

import config from './modules/config';
import proxy from './modules/proxy';
import * as modify from './modules/modify';

const app = new Koa();

app.use(logger());
app.use(proxy);
app.use(async (ctx, next) => {
  const data = ctx.body;
  try {
    ctx.body = JSON.parse(ctx.body.toString());
    await next();
  } catch (err) {
    if (config.verbose) {
      console.log(err);
    }
    ctx.body = data;
    console.log('Modify failed.'.red);
  }
});
app.use(route.post('/eapi/song/enhance/player/url', modify.player));
app.use(route.post('/eapi/song/enhance/download/url', modify.download));
app.use(route.post('/api/linux/forward', modify.forward));

export default app;
