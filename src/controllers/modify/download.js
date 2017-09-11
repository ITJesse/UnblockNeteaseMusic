import 'colors';
import { Utils, Netease } from '../../utils';

const utils = new Utils();

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

export default download;
