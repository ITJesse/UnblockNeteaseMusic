import 'colors';
import { player } from './player';
import { Netease } from '../../utils/netease';

export const forward = async (ctx, next) => {
  const req = ctx.request;
  if (!Object.prototype.hasOwnProperty.call(req, 'body')) {
    return next();
  }
  let url;
  try {
    const body = Netease.decryptLinuxForwardApi(req.body.split('=')[1]);
    const json = JSON.parse(body);
    url = json.url;
  } catch (err) {
    console.log('Parse body failed.');
    throw new Error(err);
  }
  console.log('API:'.green, url);
  if (url !== 'http://music.163.com/api/song/enhance/player/url') {
    return next();
  }
  return player(ctx, next);
};

export default forward;
