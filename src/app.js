import Koa from 'koa';
import logger from 'koa-logger';

import proxy from './modules/proxy';
import modify from './modules/modify';

const app = new Koa();

app.use(logger());
app.use(proxy);
app.use(modify);

export default app;
