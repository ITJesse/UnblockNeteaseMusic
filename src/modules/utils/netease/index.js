import 'colors';
import request from 'request-promise';
import crypto from 'crypto';
import remoteFilesize from 'remote-file-size';

export default class Netease {
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

  static getAlbumName(body) {
    body = JSON.parse(body);
    return body.songs[0].album.name;
  }

  static getDownloadSongId(body) {
    return body.data.id;
  }

  static getFilesize(url) {
    console.log('Getting filesize.'.yellow);
    return new Promise((resolve, reject) => {
      remoteFilesize(url, (err, size) => {
        if (err) return reject(err);
        console.log('Filesize:'.green, size);
        return resolve(size);
      });
    });
  }

  static async modifyPlayerApiCustom(urlInfo, body) {
    console.log('Player API Injected'.green);
    console.log('New URL is '.green + urlInfo.url);
    body.url = urlInfo.url;
    body.br = urlInfo.bitrate;
    body.code = 200;
    body.md5 = urlInfo.hash;
    body.type = urlInfo.type;
    if (!urlInfo.filesize) {
      try {
        body.filesize = await Netease.getFilesize(urlInfo.origUrl || urlInfo.url);
      } catch (error) {
        throw new Error(error);
      }
    } else {
      body.filesize = urlInfo.filesize;
    }
    return body;
  }

  static async modifyDownloadApiCustom(urlInfo, body) {
    console.log('Download API Injected'.green);
    console.log('New URL is '.green + urlInfo.url);
    body.data.url = urlInfo.url;
    body.data.br = urlInfo.bitrate;
    body.data.code = 200;
    body.data.md5 = urlInfo.hash;
    body.data.type = 'mp3';
    if (!urlInfo.filesize) {
      try {
        body.filesize = await Netease.getFilesize(urlInfo.origUrl || urlInfo.url);
      } catch (error) {
        throw new Error(error);
      }
    } else {
      body.filesize = urlInfo.filesize;
    }
    return JSON.stringify(body);
  }

  async getSongDetail(songId) {
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
    let result;
    try {
      result = await request(options);
    } catch (err) {
      throw new Error(err);
    }
    return result;
  }

  static decryptLinuxForwardApi(eparams) {
    const key = new Buffer('7246674226682325323F5E6544673A51', 'hex');
    const decipher = crypto.createDecipheriv('aes-128-ecb', key, '');
    decipher.setAutoPadding(true);
    const cipherChunks = [];
    cipherChunks.push(decipher.update(eparams, 'hex'));
    cipherChunks.push(decipher.final());

    let totalLength = 0;
    for (const e of cipherChunks) {
      totalLength += e.length;
    }
    return Buffer.concat(cipherChunks, totalLength);
  }

}
