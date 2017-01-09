import md5 from 'md5';

import common from '../common';
import config from '../../config';

export default class kugou {
  search = (name, artist) => {
    console.log('Search from Kugou.'.green);
    console.log('Song name:'.green + name);
    console.log('Artist: '.green + artist);
    const songName = encodeURIComponent(`${artist} ${name}`);
    const options = {
      url: `http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=${songName}&page=1&pagesize=1&showtype=1`,
    };

    return new Promise(async (resolve, reject) => {
      let data;
      let result;
      try {
        result = await common.sendRequest(options);
        data = JSON.parse(result.body);
      } catch (err) {
        console.log(err);
        return reject(err);
      }
      if (data.status === 1 &&
          !!data.data.info.length &&
          !!data.data.info[0]['320hash'].length &&
          data.data.info[0].songname.indexOf(name) !== -1) {
        const hash320 = data.data.info[0]['320hash'];
        result = {
          hash: hash320,
          bitrate: 320000,
          filesize: data.data.info[0]['320filesize'],
        };
        return resolve(result);
      }
      console.error('No resource found on kugou.'.yellow);
      return resolve(null);
    });
  }

  getUrl = (hash) => {
    const key = md5(`${hash}kgcloud`);
    const options = {
      url: `http://trackercdn.kugou.com/i/?acceptMp3=1&cmd=4&pid=6&hash=${hash}&key=${key}`,
    };

    return new Promise(async (resolve, reject) => {
      let data;
      try {
        const result = await common.sendRequest(options);
        data = JSON.parse(result.body);
      } catch (err) {
        console.log(err);
        return reject(err);
      }

      if (data.error) {
        console.error(data.error);
        return reject(data.error);
      }
      let url;
      if (data.status === 1) {
        url = data.url;
      } else {
        console.error('No resource found on kugou.'.yellow);
        return resolve(null);
      }

      // 魔改 URL 应对某司防火墙
      if (config.rewriteUrl) {
        url = url.replace('fs.web.kugou.com', 'music.163.com/kugou');
      }

      return resolve(url);
    });
  }
}
