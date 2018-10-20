import 'colors';

import * as common from '../common';
import config from '../../config';

class QQ {
  constructor() {
    this.name = 'QQ Music';
    this.order = 1;
    this.baseUrl = 'isure.stream.qqmusic.qq.com';
    if (config.proxy && config.proxy.length > 0) {
      this.baseSearchApi = `http://${config.proxy}/c.y.qq.com`;
      this.baseVKeyApi = `http://${config.proxy}/u.y.qq.com`;
    } else {
      this.baseSearchApi = 'https://c.y.qq.com';
      this.baseVKeyApi = 'https://u.y.qq.com';
    }
    console.log(this.baseVKeyApi)
  }

  static getGUid() {
    const currentMs = new Date().getUTCMilliseconds();
    return `${(Math.round(2147483647 * Math.random()) * currentMs) % 1e10}`
  }

  async search(keyword) {
    const options = {
      url: `${
        this.baseSearchApi
      }/soso/fcgi-bin/client_search_cp?ct=24&qqmusic_ver=1298&new_json=1&remoteplace=txt.yqq.song&t=0&aggr=1&cr=1&catZhida=1&lossless=1&flag_qc=0&p=1&n=1&w=${encodeURIComponent(
        keyword,
      )}&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`,
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
        let fromtag;
        if (list.size_128 && list.size_128 > 0) {
          prefix = 'M500';
          type = 'mp3';
          bitrate = 128000;
          filesize = list.size_128;
          fromtag = 30;
        }
        if (list.size_320 && list.size_320 > 0) {
          prefix = 'M800';
          type = 'mp3';
          bitrate = 320000;
          filesize = list.size_320;
          fromtag = 30;
        }
        if (list.size_flac && list.size_flac > 0) {
          prefix = 'F000';
          type = 'flac';
          bitrate = 999000;
          filesize = list.size_flac;
          fromtag = 53;
        }
        result.push({
          name: e.name || 'V.A.',
          artist: e.singer.name || 'V.A.',
          filesize,
          hash: '',
          songmid: e.mid,
          mid: list.media_mid,
          bitrate: String(bitrate),
          prefix,
          type,
          fromtag,
        });
      }
    }
    return result;
  }

  async getUrl(data) {
    const guid = QQ.getGUid();
    const url = `${this.baseVKeyApi}/cgi-bin/musicu.fcg?loginUin=0&data=${encodeURIComponent(
      JSON.stringify({
        req: {
          module: 'vkey.GetVkeyServer',
          method: 'CgiGetVkey',
          param: {
            guid,
            songmid: [data.songmid],
            songtype: [0],
            uin: '0',
            loginflag: 1,
            platform: '20',
          },
        },
        comm: { uin: 0, format: 'json', ct: 20, cv: 0 },
      }),
    )}`;
    const res = await common.sendRequest({ url });
    const { vkey } = JSON.parse(res.body).req.data.midurlinfo[0];
    return `http://${this.baseUrl}/${data.prefix}${data.mid}.${
      data.type
    }?vkey=${vkey}&guid=${guid}&uin=0&fromtag=${data.fromtag}`;
  }
}

module.exports = QQ;
