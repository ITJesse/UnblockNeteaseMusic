'use strict';

require('colors');

var _common = require('../common');

var common = _interopRequireWildcard(_common);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

class QQ {
  constructor() {
    this.name = 'QQ Music';
    this.order = 1;
    this.baseUrl = 'dl.stream.qqmusic.qq.com';
    if (_config2.default.proxy && _config2.default.proxy.length > 0) {
      this.baseApi = `http://${_config2.default.proxy}/c.y.qq.com`;
    } else {
      this.baseApi = 'https://c.y.qq.com';
    }
    this.guid = null;
    this.vkey = null;
    this.updateTime = null;
  }

  async init() {
    try {
      await this.getVKey();
    } catch (err) {
      console.log('QQ Music module initial failed.'.red);
      throw new Error(err);
    }
  }

  async getVKey() {
    if (!this.updateTime || this.updateTime + 3600 * 1000 < new Date().valueOf()) {
      try {
        this.vkey = await this.updateVKey();
        this.updateTime = new Date().valueOf();
      } catch (err) {
        console.log('Cannot update vkey.'.red);
        console.log(err);
      }
    }
    return this.vkey;
  }

  static getGUid() {
    const currentMs = new Date().getUTCMilliseconds();
    return Math.round(2147483647 * Math.random()) * currentMs % 1e10;
  }

  async updateVKey() {
    this.guid = QQ.getGUid();
    const options = {
      url: `${this.baseApi}/base/fcgi-bin/fcg_musicexpress.fcg?json=3&guid=${this.guid}&g_tk=5381&jsonpCallback=jsonCallback&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf8&notice=0&platform=yqq&needNewCode=0`
    };

    try {
      const result = await common.sendRequest(options);
      const data = JSON.parse(result.body);
      return data.key;
    } catch (err) {
      throw new Error(err);
    }
  }

  async search(keyword) {
    try {
      await this.getVKey();
    } catch (err) {
      return console.log('QQ Music module initial failed.'.red);
    }

    if (!this.vkey || this.vkey.length !== 112) {
      return console.log('QQ Music module is not ready.'.red);
    }
    const options = {
      url: `${this.baseApi}/soso/fcgi-bin/client_search_cp?ct=24&qqmusic_ver=1298&new_json=1&remoteplace=txt.yqq.song&t=0&aggr=1&cr=1&catZhida=1&lossless=1&flag_qc=0&p=1&n=1&w=${encodeURIComponent(keyword)}&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`
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
        const list = e.file;
        let prefix;
        let bitrate;
        let filesize;
        let type;
        if (list.size_128 && list.size_128 > 0) {
          prefix = 'M500';
          type = 'mp3';
          bitrate = 128000;
          filesize = list.size_128;
        }
        if (list.size_320 && list.size_320 > 0) {
          prefix = 'M800';
          type = 'mp3';
          bitrate = 320000;
          filesize = list.size_320;
        }
        // if (list.size_flac && list.size_flac > 0) {
        //   prefix = 'F000';
        //   type = 'flac';
        //   bitrate = 999000;
        //   filesize = list.size_flac;
        // }
        result.push({
          name: e.name || 'V.A.',
          artist: e.singer.name || 'V.A.',
          filesize,
          hash: '',
          mid: list.media_mid,
          bitrate: String(bitrate),
          prefix,
          type
        });
      }
    }
    return result;
  }

  getUrl(data) {
    const url = `http://${this.baseUrl}/${data.prefix}${data.mid}.${data.type}?vkey=${this.vkey}&guid=${this.guid}&uin=0&fromtag=30`;
    return url;
  }
}

module.exports = QQ;