import 'colors';

import Netease from './netease';
import Kugou from './kugou';
import QQ from './qq';
import config from '../config';

export default class Utils {
  constructor() {
    const ip = config.forceIp ? config.forceIp : '223.252.199.7';

    this.netease = new Netease(ip);
    this.kugou = null;
    this.dongting = null;

    if (config.kugou) {
      this.kugou = new Kugou();
    }
    if (config.qq) {
      this.qq = new QQ();
    }
  }

  /*
    Get song url.
  */
  getUrlInfo(songId) {
    return new Promise(async (resolve, reject) => {
      // get song detail by song id from netease
      try {
        const detail = await this.netease.getSongDetail(songId);
        const songName = Netease.getSongName(detail);
        const artist = Netease.getArtistName(detail);
        let songInfo = null;

        if (this.qq) {
          songInfo = await this.qq.search(songName, artist);
        }

        if (!songInfo && this.kugou) {
          // search 'Artist Songname' on kugou
          songInfo = await this.kugou.search(songName, artist);
          if (songInfo) {
            songInfo.url = await this.kugou.getUrl(songInfo.hash);
          }
        }

        if (songInfo) {
          return resolve(songInfo);
        }
        return resolve(null);
      } catch (err) {
        console.log(err);
        return reject(err);
      }
    });
  }
}
