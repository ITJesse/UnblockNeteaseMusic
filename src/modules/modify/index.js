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
    console.log(err);
    throw new Error(err);
  }
  if (urlInfo) {
    try {
      data.data[0] = await Netease.modifyPlayerApiCustom(urlInfo, data.data[0]);
    } catch (error) {
      console.log('No resource.'.red);
      throw new Error(error);
    }
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
    console.log(err);
    throw new Error(err);
  }
  if (urlInfo) {
    try {
      data.data = await Netease.modifyDownloadApiCustom(urlInfo, data.data);
    } catch (error) {
      console.log('No resource.'.red);
      throw new Error(error);
    }
  } else {
    console.log('No resource.'.red);
  }
  return next();
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
    throw new Error(err);
  }
  console.log('API:'.green, url);
  if (url !== 'http://music.163.com/api/song/enhance/player/url') {
    return next();
  }
  return player(ctx, next);
};
