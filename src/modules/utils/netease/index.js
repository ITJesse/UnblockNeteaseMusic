import 'colors';
import request from 'request';

export default class netease {
  constructor(ip) {
    this.baseUrl = `http://${ip}`;
  }

  static getDownloadReturnCode(body) {
    return body.data.code;
  }

  static getDownloadUrl(body) {
    return body.data.url;
  }

  static getSongName(body) {
    body = JSON.parse(body);
    return body.songs[0].name;
  }

  static getArtistName(body) {
    body = JSON.parse(body);
    return body.songs[0].artists[0].name;
  }

  static getDownloadSongId(body) {
    return body.data.id;
  }

  static modifyPlayerApiCustom(urlInfo, body) {
    console.log('Player API Injected'.green);
    console.log('New URL is '.green + urlInfo.url);
    body.url = urlInfo.url;
    body.br = urlInfo.bitrate;
    body.code = '200';
    body.size = urlInfo.filesize;
    body.md5 = urlInfo.hash;
    body.type = 'mp3';

    return body;
  }

  static modifyDownloadApiCustom(urlInfo, body) {
    console.log('Download API Injected'.green);
    console.log('New URL is '.green + urlInfo.url);
    body.data.url = urlInfo.url;
    body.data.br = urlInfo.bitrate;
    body.data.code = '200';
    body.data.size = urlInfo.filesize;
    body.data.md5 = urlInfo.hash;
    body.data.type = 'mp3';

    return JSON.stringify(body);
  }

  getSongDetail(songId) {
    const header = {
      host: 'music.163.com',
      'content-type': 'application/x-www-form-urlencoded',
    };

    const options = {
      url: `${this.baseUrl}/api/song/detail/?ids=[${songId}]&id=${songId}`,
      headers: header,
      method: 'get',
      gzip: true,
    };
    return new Promise((resolve, reject) => {
      request(options, (err, res, body) => {
        if (err) {
          console.error(err.red);
          reject(err);
        } else {
          resolve(body);
        }
      });
    });
  }

}
