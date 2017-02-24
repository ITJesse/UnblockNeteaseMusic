import 'colors';
import Utils from '../utils';
import Netease from '../utils/netease';

const utils = new Utils();

const modify = async (ctx, next) => {
  const req = ctx.request;

  let songId;
  let urlInfo;
  let data;

  try {
    data = JSON.parse(ctx.defaultBody.toString());
  } catch (err) {
    console.error('Parse JSON failed, return with no modify.'.yellow);
    return next;
  }

  if (/^\/eapi\/song\/enhance\/player\/url/.test(req.url) || /^\/api\/linux\/forward/.test(req.url)) {
    // For Linux client support
    if (data.hasOwnProperty('data')) {
      const playbackReturnCode = data.data[0].code;
      songId = data.data[0].id;

      if (playbackReturnCode !== 200) {
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
      } else {
        console.log('The song URL is '.green + data.data[0].url);
      }
      ctx.defaultBody = JSON.stringify(data);
    }
    return next;
  } else if (/^\/eapi\/song\/enhance\/download\/url/.test(req.url)) {
    if (Netease.getDownloadReturnCode(data) !== 200) {
      songId = Netease.getDownloadSongId(data);
      try {
        urlInfo = await utils.getUrlInfo(songId);
      } catch (err) {
        return console.log(err);
      }
      if (urlInfo) {
        ctx.defaultBody = Netease.modifyDownloadApiCustom(urlInfo, data);
      } else {
        console.log('No resource.'.red);
      }
      return next;
    }
    console.log('The song URL is '.green + Netease.getDownloadUrl(data).green);
    return next;
  }
  return next;
};

export default modify;
