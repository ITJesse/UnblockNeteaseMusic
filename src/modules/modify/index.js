import colors from 'colors';
import Utils from '../utils';

let utils = new Utils();

let modify = async function(ctx, next) {
  let req = ctx.request;
  let res = ctx.response;

  let songId,
      urlInfo;

  if (/^\/eapi\/song\/enhance\/player\/url/.test(req.url)) {
    let data = '';

    try {
      data = JSON.parse(ctx.defaultBody.toString());
    } catch (err) {
      console.error("Parse JSON failed, return with no modify.".yellow);
      return next;
    }
    let newData = [];
    for(let row of data["data"]) {
      let playbackReturnCode = row.code;
      songId = row.id;

      if (playbackReturnCode != 200) {
        try{
          urlInfo = await utils.getUrlInfo(songId);
        } catch(err) {
          return console.log(err);
        }
        if (urlInfo) {
          row = utils.netease.modifyPlayerApiCustom(urlInfo, row);
        } else {
          console.log('No resource.'.red);
        }
      } else {
        console.log('Playback bitrate is not changed. The song URL is '.green + row.url);
      }
      newData.push(row);
    }
    data["data"] = newData;
    ctx.defaultBody = JSON.stringify(data);
    return next;

  }

  else if (/^\/eapi\/song\/enhance\/download\/url/.test(req.url)) {

    if (utils.netease.getDownloadReturnCode(ctx.defaultBody) != 200) {
      songId = utils.netease.getDownloadSongId(ctx.defaultBody);
      try{
        urlInfo = await utils.getUrlInfo(songId);
      } catch(err) {
        return console.log(err);
      }
      if (urlInfo) {
        ctx.defaultBody = utils.netease.modifyDownloadApiCustom(urlInfo, ctx.defaultBody);
      } else {
        console.log('No resource.'.red);
      }
      return next;
    } else {
      console.log('Download bitrate is not changed. The song URL is '.green + utils.netease.getDownloadUrl(ctx.defaultBody).green);
      return next;
    }
  }

  else {
    return next;
  }

};

export default modify;
