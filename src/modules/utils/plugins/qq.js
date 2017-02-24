import 'colors';

import * as common from '../common';

class QQ {
  constructor() {
    this.name = 'QQ Music';
    this.order = 1;
    this.baseUrl = 'dl.stream.qqmusic.qq.com';
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

  async updateVKey() {
    this.guid = QQ.getGUid();
    const options = {
      // url: `https://c.y.qq.com/base/fcgi-bin/fcg_musicexpress.fcg?guid=${this.guid}&format=json`,
      url: `https://c.y.qq.com/base/fcgi-bin/fcg_musicexpress.fcg?json=3&guid=${this.guid}&g_tk=5381&jsonpCallback=jsonCallback&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf8&notice=0&platform=yqq&needNewCode=0`,
    };

    try {
      const result = await common.sendRequest(options);
      const data = JSON.parse(result.body);
      return data.key;
    } catch (err) {
      throw new Error(err);
    }
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
    const songName = encodeURIComponent(`${artist} ${name}`);
    const options = {
      url: `http://s.music.qq.com/fcgi-bin/music_search_new_platform?n=1&cr=1&loginUin=0&format=json&inCharset=utf-8&outCharset=utf-8&p=1&catZhida=0&w=${songName}`,
    };
    let data;
    try {
      const result = await common.sendRequest(options);
      data = JSON.parse(result.body);
    } catch (err) {
      throw new Error(err);
    }
    const result = [];
    if (data.code === 0 && data.data.song.list.length > 0) {
      for (const e of data.data.song.list) {
        const list = data.data.song.list[0].f.split('|');
        const bitrate = list[13];
        let prefix;
        let type;
        if (bitrate === '320000') {
          prefix = 'M800';
          type = 'mp3';
        } else if (bitrate === '128000') {
          prefix = 'M500';
          type = 'mp3';
        } else {
          prefix = 'C200';
          type = 'm4a';
        }
        result.push({
          name: e.fsong,
          artist: e.fsinger,
          filesize: list[11],
          hash: '',
          mid: list[20],
          bitrate,
          prefix,
          type,
        });
      }
    }
    return result;
  }

  async getUrl(data) {
    const url = `http://dl.stream.qqmusic.qq.com/${data.prefix}${data.mid}.${data.ext}?vkey=${this.vkey}&guid=${this.guid}&uin=0&fromtag=30`;
    return url;
  }
}

module.exports = QQ;
