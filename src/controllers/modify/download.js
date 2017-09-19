import 'colors';
import { Utils, Netease } from '../../utils';
import { Recent, Song } from '../../models';

const utils = new Utils();

export const download = async (ctx, next) => {
  const data = ctx.body;

  if (Netease.getDownloadReturnCode(data) === 200) {
    return console.log('The song URL is '.green + data.data.url);
  }
  const songId = Netease.getDownloadSongId(data);
  let songInfo;
  try {
    songInfo = await utils.getSongInfo(songId);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
  let urlInfo;
  try {
    urlInfo = await utils.getUrlInfo(songInfo);
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
    const { songName, artist, album } = songInfo;
    Song.findOrCreate({
      where: { songId },
      defaults: {
        songId,
        artist,
        album,
        name: songName,
      },
    }).then().catch(err => console.log(err));
    Recent.upsert({
      songId,
    }).then().catch(err => console.log(err));
  }
  return next();
};

export default download;
