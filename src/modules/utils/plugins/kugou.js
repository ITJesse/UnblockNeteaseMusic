import md5 from 'md5';

import * as common from '../common';

class Kugou {
  constructor() {
    this.name = 'Kugou';
    this.order = 2;
    this.baseUrl = 'fs.web.kugou.com';
  }

  getPluginInfo() {
    return {
      name: this.name,
      order: this.order,
    };
  }

  async search(name, artist) {
    const songName = encodeURIComponent(`${artist} ${name}`);
    const options = {
      url: `http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=${songName}&page=1&pagesize=1&showtype=1`,
    };
    let data;
    try {
      const result = await common.sendRequest(options);
      data = JSON.parse(result.body);
    } catch (err) {
      throw new Error(err);
    }
    const result = [];
    if (data.status === 1 && data.data.info.length > 0) {
      for (const e of data.data.info) {
        let filesize;
        let hash;
        let bitrate;
        // if (Object.prototype.hasOwnProperty.call(e, 'sqhash')) {
        //   bitrate = '999000';
        //   filesize = e.sqfilesize;
        //   hash = e.sqhash;
        //   type = 'flac';
        // } else if (Object.prototype.hasOwnProperty.call(e, '320hash')) {

        if (Object.prototype.hasOwnProperty.call(e, '320hash')) {
          bitrate = '320000';
          filesize = e['320filesize'];
          hash = e['320hash'];
        } else if (Object.prototype.hasOwnProperty.call(e, 'hash')) {
          bitrate = '128000';
          filesize = e.filesize;
          hash = e.hash;
        } else {
          continue;
        }
        result.push({
          name: e.filename,
          artist: e.singername,
          type: 'mp3',
          filesize,
          bitrate,
          hash,
        });
      }
    }
    return result;
  }

  async getUrl(searchResult) {
    const hash = searchResult.hash;
    const key = md5(`${hash}kgcloud`);
    const options = {
      url: `http://trackercdn.kugou.com/i/?acceptMp3=1&cmd=4&pid=6&hash=${hash}&key=${key}`,
    };

    let data;
    try {
      const result = await common.sendRequest(options);
      data = JSON.parse(result.body);
    } catch (err) {
      throw new Error(err);
    }

    let url;
    if (data.error || data.status !== 1) {
      url = null;
    } else {
      url = data.url;
    }
    return url;
  }
}

module.exports = Kugou;
