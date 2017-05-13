import 'colors';
import requestPromise from 'request-promise';
import request from 'request';
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

  static getFileInfo(url) {
    console.log('Getting file info.'.yellow);
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('md5');
      hash.setEncoding('hex');
      let filesize = 0;
      let md5 = '';
      request.get(url)
        .on('error', err => reject(err))
        .on('response', (res) => {
          filesize = parseInt(res.headers['content-length'], 10);
          console.log('Filesize:'.green, filesize);
        })
        .pipe(hash)
        .on('finish', () => {
          hash.end();
          md5 = hash.read();
          console.log('MD5:'.green, md5);
          return resolve({
            filesize,
            md5,
          });
        });
    });
  }

  static async modifyPlayerApiCustom(urlInfo, body) {
    console.log('Player API Injected'.green);
    console.log('New URL is '.green + urlInfo.url);
    body.url = urlInfo.url;
    body.br = urlInfo.bitrate;
    body.code = 200;
    body.type = urlInfo.type;
    body.md5 = urlInfo.hash;
    if (!urlInfo.filesize) {
      try {
        // const { filesize, md5 } = await Netease.getFileInfo(urlInfo.origUrl || urlInfo.url);
        // body.filesize = filesize;
        // body.md5 = md5;
        const filesize = await Netease.getFilesize(urlInfo.origUrl || urlInfo.url);
        body.filesize = filesize;
      } catch (error) {
        console.log('Cannot get file size.'.red);
        throw new Error(error);
      }
    } else {
      body.filesize = urlInfo.filesize;
      body.md5 = urlInfo.hash;
    }
    return body;
  }

  static async modifyDownloadApiCustom(urlInfo, body) {
    console.log('Download API Injected'.green);
    console.log('New URL is '.green + urlInfo.url);
    body.data.url = urlInfo.url;
    body.data.br = urlInfo.bitrate;
    body.data.code = 200;
    body.data.type = urlInfo.type;
    body.md5 = urlInfo.hash;
    if (!urlInfo.filesize) {
      try {
        // const { filesize, md5 } = await Netease.getFileInfo(urlInfo.origUrl || urlInfo.url);
        // body.filesize = filesize;
        // body.md5 = md5;
        const filesize = await Netease.getFilesize(urlInfo.origUrl || urlInfo.url);
        body.filesize = filesize;
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
      result = await requestPromise(options);
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
