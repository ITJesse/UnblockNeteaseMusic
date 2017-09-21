'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Netease = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require('colors');

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _remoteFileSize = require('remote-file-size');

var _remoteFileSize2 = _interopRequireDefault(_remoteFileSize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Netease {
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

  static getAlbumPic(body) {
    body = JSON.parse(body);
    return body.songs[0].album.picUrl;
  }

  static getDownloadSongId(body) {
    return body.data.id;
  }

  static getFilesize(url) {
    console.log('Getting filesize.'.yellow);
    return new Promise((resolve, reject) => {
      (0, _remoteFileSize2.default)(url, (err, size) => {
        if (err) return reject(err);
        console.log('Filesize:'.green, size);
        return resolve(size);
      });
    });
  }

  static getFileInfo(url) {
    console.log('Getting file info.'.yellow);
    return new Promise((resolve, reject) => {
      const hash = _crypto2.default.createHash('md5');
      hash.setEncoding('hex');
      let filesize = 0;
      let md5 = '';
      _request2.default.get(url).on('error', err => reject(err)).on('response', res => {
        filesize = parseInt(res.headers['content-length'], 10);
        console.log('Filesize:'.green, filesize);
      }).pipe(hash).on('finish', () => {
        hash.end();
        md5 = hash.read();
        console.log('MD5:'.green, md5);
        return resolve({
          filesize,
          md5
        });
      });
    });
  }

  static fixJsonData(body) {
    if (body.code === 200) {
      return body;
    }
    return _extends({}, body, {
      url: null,
      type: null,
      md5: null,
      uf: null
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
        const filesize = await Netease.getFilesize(urlInfo.origUrl || urlInfo.url);
        body.size = filesize;
      } catch (error) {
        console.log('Cannot get file size.'.red);
        throw new Error(error);
      }
    } else {
      body.size = urlInfo.filesize;
    }
    return body;
  }

  static async modifyDownloadApiCustom(urlInfo, body) {
    console.log('Download API Injected'.green);
    console.log('New URL is '.green + urlInfo.url);
    body.url = urlInfo.url;
    body.br = urlInfo.bitrate;
    body.code = 200;
    body.type = urlInfo.type;
    body.md5 = urlInfo.hash;
    body.expi = 1200;
    if (!urlInfo.filesize || !urlInfo.md5) {
      try {
        const {
          filesize,
          md5
        } = await Netease.getFileInfo(urlInfo.origUrl || urlInfo.url);
        body.size = filesize;
        body.md5 = md5;
      } catch (error) {
        throw new Error(error);
      }
    } else {
      body.size = urlInfo.filesize;
      body.md5 = urlInfo.md5;
    }
    return body;
  }

  async getSongDetail(songId) {
    const header = {
      host: 'music.163.com',
      'content-type': 'application/x-www-form-urlencoded'
    };

    const options = {
      url: `${this.baseUrl}/api/song/detail/?ids=[${songId}]&id=${songId}`,
      headers: header,
      method: 'get',
      gzip: true
    };
    let result;
    try {
      result = await (0, _requestPromise2.default)(options);
    } catch (err) {
      throw new Error(err);
    }
    return result;
  }

  static decryptLinuxForwardApi(eparams) {
    const key = new Buffer('7246674226682325323F5E6544673A51', 'hex');
    const decipher = _crypto2.default.createDecipheriv('aes-128-ecb', key, '');
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

exports.Netease = Netease;
exports.default = Netease;