import colors from 'colors';
import md5 from 'md5';
import request from 'request';
import common from '../common';
import config from '../../config';

let qq = function() {};

export default class QQ {
  constructor() {
    this.guid = null;
    this.vkey = null;
    this.updateTime = null;
  }

  async getVKey() {
    let self = this;
    if(!this.updateTime || this.updateTime + 3600 * 1000 < (new Date()).valueOf()) {
      try {
        self.vkey = await self.updateVKey();
        self.updateTime = (new Date()).valueOf();
      } catch(err) {
        console.log(err);
      }
    }
    return self.vkey;
  }

  getGUid() {
    let currentMs = parseInt((new Date()).valueOf() % 1000);
    return parseInt(Math.round(Math.random() * 2147483647) * currentMs % 0x1E10);
  }

  updateVKey() {
    let self = this;

    self.guid = self.getGUid();
    let options = {
      url: "http://base.music.qq.com/fcgi-bin/fcg_musicexpress.fcg?json=3&guid=" + self.guid
    };

    return new Promise(async function(resolve, reject) {
      try {
        let result = await common.sendRequest(options);
        result.body = result.body
          .replace(/^jsonCallback\(/, '')
          .replace(/\);$/, '');
        let data = JSON.parse(result.body);
        return resolve(data.key);
      }catch(err) {
        console.log(err);
        return reject(err);
      };
    });
  };

  async search(name, artist) {
    let self = this;

    try {
      await self.getVKey();
    } catch(err) {
      return console.log("QQ Music module initial failed.".red);
    }

    if(!self.vkey || self.vkey.length != 112) {
      return console.log("QQ Music module is not ready.".red);
    }
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
        let data = JSON.parse(result.body);
        let keyword = name.replace(/\s/g, '').toLowerCase();
        let fsong = data.data.song.list[0].fsong.replace(/\s/g, '').toLowerCase();
        if (data.code === 0 &&
            data.data.song.list.length > 0 &&
            fsong.indexOf(keyword) != -1) {

          let list = data.data.song.list[0].f.split('|');
          let mid = list[20];
          let bitrate = list[13];
          let prefix,
          ext;
          if(bitrate == '320000') {
            prefix = 'M800';
            ext = 'mp3';
          }
          else if(bitrate == '128000') {
            prefix = 'M500';
            ext = 'mp3';
          }
          else {
            prefix = 'C200';
            ext = 'm4a';
          }
          let url = "http://cc.stream.qqmusic.qq.com/" + prefix + mid + "." + ext + "?vkey=" + self.vkey + "&guid=" + self.guid + "&fromtag=0";
          // 魔改 URL 应对某司防火墙
          if(config.rewriteUrl) {
            url = url.replace('cc.stream.qqmusic.qq.com', 'music.163.com/qqmusic');
          }
          result = {
            url: url,
            bitrate: bitrate,
            filesize: list[11],
            hash: ''
          };
          return resolve(result);
        } else {
          console.log("No resource found from QQ Music".yellow);
          return resolve(null);
        }
      }catch(err) {
        console.log(err);
        return reject(err);
      };
    });
  };
}
