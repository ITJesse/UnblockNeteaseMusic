import colors from 'colors';
import md5 from 'md5';
import request from 'request';
import common from '../common';
import config from '../../config';

export default class kugou {
  search(name, artist) {
    console.log("Search from Kugou.".green);
    console.log("Song name: ".green + name);
    console.log("Artist: ".green + artist);
    let songName = encodeURIComponent(artist + " " + name);
    let options = {
      url: "http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=" + songName + "&page=1&pagesize=1&showtype=1"
    };

    return new Promise(async function(resolve, reject) {
      try {
        let result = await common.sendRequest(options);
        let data = JSON.parse(result.body);
        if (data.status == 1 &&
            !!data['data']['info'].length &&
            !!data['data']['info'][0]['320hash'].length &&
            data['data']['info'][0]['songname'].indexOf(name) != -1) {

          let hash320 = data['data']['info'][0]['320hash'];
          result = {
            hash: hash320,
            bitrate: 320000,
            filesize: data['data']['info'][0]['320filesize']
          };
          return resolve(result);
        } else {
          console.error('No resource found on kugou.'.yellow);
          return resolve(null);
        }
      } catch(err) {
        console.log(err);
        return reject(err);
      }
    });
  };

  getUrl(hash) {
    let key = md5(hash + 'kgcloud');
    let options = {
      url: "http://trackercdn.kugou.com/i/?acceptMp3=1&cmd=4&pid=6&hash=" + hash + "&key=" + key
    };

    return new Promise(async function(resolve, reject) {
      try {
        let result = await common.sendRequest(options);
        let data = JSON.parse(result.body);
        if (data.status == 1) {
          let url = data['url'];

          // 魔改 URL 应对某司防火墙
          if(config.rewriteUrl) {
            url = url.replace('fs.web.kugou.com', 'music.163.com/kugou');
          }

          return resolve(url);
        } else {
          console.error(data['error']);
          return reject(data['error']);
        }
      } catch(err) {
        console.log(err);
        return reject(err);
      }
    });
  };
}
