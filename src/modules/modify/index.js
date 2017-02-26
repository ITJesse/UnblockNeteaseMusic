import 'colors';
import Utils from '../utils';
import Netease from '../utils/netease';

const utils = new Utils();

export const player = async (ctx, next) => {
  const data = ctx.body;

  const playbackReturnCode = data.data[0].code;
  const songId = data.data[0].id;

  if (playbackReturnCode === 200) {
    console.log('The song URL is '.green + data.data[0].url);
    return next();
  }

  let urlInfo;
  try {
    urlInfo = await utils.getUrlInfo(songId);
  } catch (err) {
    return console.log(err);
  }
  if (urlInfo) {
    data.data[0] = Netease.modifyPlayerApiCustom(urlInfo, data.data[0]);
  } else {
    console.log('No resource.'.red);
  }
  ctx.body = JSON.stringify(data);
  return next();
};

export const download = async (ctx, next) => {
  const data = ctx.body;

  if (Netease.getDownloadReturnCode(data) === 200) {
    return console.log('The song URL is '.green + data.data.url);
  }
  const songId = Netease.getDownloadSongId(data);
  let urlInfo;
  try {
    urlInfo = await utils.getUrlInfo(songId);
  } catch (err) {
    return console.log(err);
  }
  if (urlInfo) {
    ctx.body = Netease.modifyDownloadApiCustom(urlInfo, data);
  } else {
    console.log('No resource.'.red);
  }
  return next;
};

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
  }
  console.log('API:'.green, url);
  if (url !== 'http://music.163.com/api/song/enhance/player/url') {
    return next();
  }
  return player(ctx, next);
};
