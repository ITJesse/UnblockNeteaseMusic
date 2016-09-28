import colors from 'colors';
import md5 from 'md5';
import request from 'request';
import common from '../common';

let qq = function() {};

export default class QQ {
  search(name, artist) {
    console.log("Search from QQ Music.".green);
    console.log("Song name: ".green + name);
    console.log("Artist: ".green + artist);
    let songName = encodeURIComponent(artist + " " + name);
    let options = {
      url: "http://s.music.qq.com/fcgi-bin/music_search_new_platform?n=1&cr=1&loginUin=0&format=json&inCharset=utf-8&outCharset=utf-8&p=1&catZhida=0&w=" + songName
    };

    return new Promise(async function(resolve, reject) {
      try {
        let result = await common.sendRequest(options);
        let data = JSON.parse(result[1]);
        let keyword = name.replace(/\s/g, '').toLowerCase();
        let fsong = data.data.song.list[0].fsong.replace(/\s/g, '').toLowerCase();
        if (data.code === 0 &&
            data.data.song.list.length > 0 &&
            fsong.indexOf(keyword) != -1) {

          let list = data.data.song.list[0].f.split('|');
          result = {
            url: 'http://music.163.com/qqmusic/' + list[0] + '.mp3',
            bitrate: list[13],
            filesize: list[11],
            hash: md5(list[0])
          };
          return resolve(result);
        } else {
          console.log("No resource found from QQ Music".yellow);
          return resolve(null);
        }
      }catch(err) {
        console.log(err);
        reject(err);
      };
    });
  };
}
