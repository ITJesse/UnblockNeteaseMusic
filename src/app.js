import 'colors';
import Koa from 'koa';
import logger from 'koa-logger';
import Router from 'koa-router';

import config from './modules/config';
import proxy from './modules/proxy';
import Netease from './modules/utils/netease';
import * as modify from './modules/modify';
// import * as pair from './modules/pair';

const errorHandler = async (ctx, next) => {
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
};

const app = new Koa();
app.use(logger());

const router = Router();

// Route for native netease client
router.post(
  '/eapi/song/enhance/player/url',
  proxy,
  errorHandler,
  modify.player,
);
router.post(
  '/api/plugin/player',
  proxy,
  errorHandler,
  modify.player,
);
router.post(
  '/eapi/song/enhance/download/url',
  proxy,
  errorHandler,
  modify.download,
);
router.post(
  '/api/plugin/download',
  proxy,
  errorHandler,
  modify.download,
);
router.post(
  '/api/linux/forward',
  proxy,
  errorHandler,
  modify.forward,
);

// Route for Unblock Netease Music Server itself
// router
//   .use('/api/pair/*', pair.permission)
//   .get('/api/pair/recent', pair.recent)
//   .get('/api/pair', pair.list)
//   .put('/api/pair', pair.save)
//   .post('/api/pair/:songId', pair.update);

app
  .use(router.routes())
  .use(router.allowedMethods());

export default app;
