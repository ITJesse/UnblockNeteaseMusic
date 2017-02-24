import 'colors';

import common from '../common';
import config from '../../config';

export default class QQ {
  constructor() {
    this.guid = null;
    this.vkey = null;
    this.updateTime = null;
  }

  async getVKey() {
    if (!this.updateTime || this.updateTime + 3600 * 1000 < (new Date()).valueOf()) {
      try {
        this.vkey = await this.updateVKey();
        this.updateTime = (new Date()).valueOf();
      } catch (err) {
        console.log(err);
      }
    }
    return this.vkey;
  }

  static getGUid() {
    const currentMs = (new Date()).getUTCMilliseconds();
    return Math.round(2147483647 * Math.random()) * currentMs % 1e10;
  }

  updateVKey() {
    this.guid = QQ.getGUid();
    const options = {
      // url: `https://c.y.qq.com/base/fcgi-bin/fcg_musicexpress.fcg?guid=${this.guid}&format=json`,
      url: `https://c.y.qq.com/base/fcgi-bin/fcg_musicexpress.fcg?json=3&guid=${this.guid}&g_tk=5381&jsonpCallback=jsonCallback&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf8&notice=0&platform=yqq&needNewCode=0`,
    };

    return new Promise(async (resolve, reject) => {
      try {
        const result = await common.sendRequest(options);
        const data = JSON.parse(result.body);
        return resolve(data.key);
      } catch (err) {
        console.log(err);
        return reject(err);
      }
    });
  }

  async search(name, artist) {
    try {
      await this.getVKey();
    } catch (err) {
      return console.log('QQ Music module initial failed.'.red);
    }

    if (!this.vkey || this.vkey.length !== 112) {
      return console.log('QQ Music module is not ready.'.red);
    }
    console.log('Search from QQ Music.'.green);
    console.log('Song name: '.green + name);
    console.log('Artist: '.green + artist);
    const songName = encodeURIComponent(`${artist} ${name}`);
    const options = {
      url: `http://s.music.qq.com/fcgi-bin/music_search_new_platform?n=1&cr=1&loginUin=0&format=json&inCharset=utf-8&outCharset=utf-8&p=1&catZhida=0&w=${songName}`,
    };

    return new Promise(async (resolve, reject) => {
      try {
        let result = await common.sendRequest(options);
        const data = JSON.parse(result.body);
        const keyword = name.replace(/\s/g, '').toLowerCase();
        const fsong = data.data.song.list[0].fsong.replace(/\s/g, '').toLowerCase();
        if (data.code === 0 &&
            data.data.song.list.length > 0 &&
            fsong.indexOf(keyword) !== -1) {
          const list = data.data.song.list[0].f.split('|');
          const mid = list[20];
          const bitrate = list[13];
          let prefix;
          let ext;
          if (bitrate === '320000') {
            prefix = 'M800';
            ext = 'mp3';
          } else if (bitrate === '128000') {
            prefix = 'M500';
            ext = 'mp3';
          } else {
            prefix = 'C200';
            ext = 'm4a';
          }
          let url = `http://dl.stream.qqmusic.qq.com/${prefix}${mid}.${ext}?vkey=${this.vkey}&guid=${this.guid}&uin=0&fromtag=30`;
          // 魔改 URL 应对某司防火墙
          if (config.rewriteUrl) {
            url = url.replace('dl.stream.qqmusic.qq.com', 'music.163.com/qqmusic');
          }
          result = {
            url,
            bitrate,
            filesize: list[11],
            hash: '',
          };
          return resolve(result);
        }
        console.log('No resource found from QQ Music'.yellow);
        return resolve(null);
      } catch (err) {
        console.log(err);
        return reject(err);
      }
    });
  }
}
