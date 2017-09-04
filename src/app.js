import 'colors';
import Koa from 'koa';
import logger from 'koa-logger';
import route from 'koa-route';

import config from './modules/config';
import proxy from './modules/proxy';
import * as modify from './modules/modify';
import Netease from './modules/utils/netease';

const app = new Koa();

app.use(logger());
app.use(proxy);
app.use(async (ctx, next) => {
  const data = ctx.body;
  let json = '';
  try {
    json = JSON.parse(ctx.body.toString());
  } catch (error) {
    console.log('Pares failed. Maybe encrypted.');
    ctx.body = data;
    return;
  }
  if (Array.isArray(json.data)) {
    json.data = json.data.map(e => Netease.fixJsonData(e));
  } else {
    json.data = Netease.fixJsonData(json.data);
  }
  try {
    ctx.body = json;
    await next();
  } catch (err) {
    if (config.verbose) {
      console.log(err);
    }
    ctx.body = json;
    console.log('Modify failed.'.red);
  }
});
app.use(route.post('/eapi/song/enhance/player/url', modify.player));
app.use(route.post('/eapi/song/enhance/download/url', modify.download));
app.use(route.post('/api/linux/forward', modify.forward));
app.use(route.post('/api/plugin', modify.player));
app.use(route.post('/api/plugin/player', modify.player));
app.use(route.post('/api/plugin/download', modify.download));

export default app;
