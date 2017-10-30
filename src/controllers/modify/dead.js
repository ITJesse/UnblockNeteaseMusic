import { Recent, Song, Pair } from '../../models';
import { Utils, Netease } from '../../utils';

const utils = new Utils();

export const handleDeadMusic = (songId, songInfo) => {
  const { songName, artist, album, albumPic } = songInfo;
  Song.findOrCreate({
    where: { songId },
    defaults: {
      songId,
      artist,
      album,
      albumPic,
      name: songName,
    },
  }).then().catch(err => console.log(err));
  Recent.upsert({
    songId,
  }).then().catch(err => console.log(err));
};

export const checkPairMusic = async (songId) => {
  let pair;
  try {
    pair = await Pair.findOne({ where: { songId } });
  } catch (err) {
    throw new Error(err);
  }
  if (pair) {
    let urlInfo;
    try {
      urlInfo = await utils.getUrlInfoForPair(pair.dataValues);
    } catch (err) {
      throw new Error(err);
    }
    return urlInfo;
  }
  return null;
};

export default handleDeadMusic;
