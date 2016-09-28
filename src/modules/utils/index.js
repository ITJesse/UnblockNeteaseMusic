import colors from 'colors';
import co from 'co';

import config from '../config';
import netease from './netease';
import kugou from './kugou';
import qq from './qq';

export default class Utils {
  constructor() {
    let ip = config.forceIp ? config.forceIp : '223.252.199.7';

    this.netease = new netease(ip);
    this.kugou = null;
    this.dongting = null;

    if (config.kugou) {
      this.kugou = new kugou();
    }
    if (config.dongting) {
      this.dongting = new dongting();
    }
    if (config.qq) {
      this.qq = new qq();
    }
  }

  /*
    Get song url.
  */
  getUrlInfo(songId) {
    let self = this;

    return new Promise(async function(resolve, reject) {
      // get song detail by song id from netease
      try {
        let detail = await self.netease.getSongDetail(songId);
        let songName = self.netease.getSongName(detail);
        let artist = self.netease.getArtistName(detail);
        let songInfo = null;

        if (self.qq) {
          songInfo = await self.qq.search(songName, artist);
        }

        if (!songInfo && self.kugou) {
          // search 'Artist Songname' on kugou
          songInfo = await self.kugou.search(songName, artist);
          if (songInfo) {
            songInfo.url = await self.kugou.getUrl(songInfo.hash);
          }
        }

        if (songInfo) {
          return resolve(songInfo);
        } else {
          return resolve(null);
        }
      } catch(err) {
        console.log(err);
        return reject(err);
      }
    });
  };
}
