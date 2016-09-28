import colors from 'colors';
import request from 'request';
import crypto from 'crypto';

export default class netease {
  constructor(ip) {
    this.baseUrl = "http://" + ip;
  }

  getDownloadReturnCode(body) {
    body = JSON.parse(body);
    return body["data"]["code"];
  };

  getDownloadUrl(body) {
    body = JSON.parse(body);
    return body["data"]["url"];
  };

  getSongName(body) {
    body = JSON.parse(body);
    return body["songs"][0]['name'];
  };

  getArtistName(body) {
    body = JSON.parse(body);
    return body["songs"][0]['artists'][0]['name'];
  };

  getDownloadSongId(body) {
    body = JSON.parse(body);
    return body["data"]["id"];
  };

  getSongDetail(songId) {
    let self = this;

    let data = [{
      id: songId,
      v: 0
    }];

    let header = {
      'host': 'music.163.com',
      'content-type': 'application/x-www-form-urlencoded'
    };

    let options = {
      url: self.baseUrl + "/api/song/detail/?ids=[" + songId + "]&id=" + songId,
      headers: header,
      method: 'get',
      gzip: true
    };
    return new Promise((resolve, reject) => {
      request(options, function(err, res, body) {
        if (err) {
          console.error(err.red);
          reject(err);
        } else {
          resolve(body);
        }
      });
    });
  };

  modifyPlayerApiCustom(urlInfo, body) {
    console.log("Player API Injected".green);

    let self = this;

    console.log("New URL is ".green + urlInfo.url);
    body["url"] = urlInfo.url;
    body["br"] = urlInfo.bitrate;
    body["code"] = "200";
    body["size"] = urlInfo.filesize;
    body["md5"] = urlInfo.hash;
    body["type"] = "mp3";

    return body;
  };

  modifyDownloadApiCustom(urlInfo, body) {
    console.log("Download API Injected".green);

    let self = this;

    body = JSON.parse(body);

    console.log("New URL is ".green + urlInfo.url);
    body["data"]["url"] = urlInfo.url;
    body["data"]["br"] = urlInfo.bitrate;
    body["data"]["code"] = "200";
    body["data"]["size"] = urlInfo.filesize;
    body["data"]["md5"] = urlInfo.hash;
    body["data"]["type"] = "mp3";

    return JSON.stringify(body);
  };
}
