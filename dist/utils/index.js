'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendRequest = exports.Netease = exports.Utils = undefined;

var _netease = require('./netease');

Object.defineProperty(exports, 'Netease', {
  enumerable: true,
  get: function () {
    return _netease.Netease;
  }
});

var _common = require('./common');

Object.defineProperty(exports, 'sendRequest', {
  enumerable: true,
  get: function () {
    return _common.sendRequest;
  }
});

require('colors');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Utils {
  constructor() {
    const ip = _config2.default.forceIp ? _config2.default.forceIp : '223.252.199.7';
    this.netease = new _netease.Netease(ip);
    this.plugins = [];
    this.initPlugins();
  }

  initPlugins() {
    _fs2.default.readdirSync(_path2.default.resolve(__dirname, 'plugins')).forEach(file => {
      const Plugin = require(_path2.default.resolve(__dirname, 'plugins', file));
      this.plugins.push(new Plugin());
    });
    this.plugins.sort((a, b) => a.order - b.order);
    // console.log(this.plugins);
  }

  async batchSeachMusic(songName, artist, album) {
    const result = [];
    for (const plugin of this.plugins) {
      console.log(`Search from ${plugin.name}`.green);
      const keyword = `${artist} ${songName} ${album}`;
      let searchResult;
      try {
        searchResult = await plugin.search(keyword);
      } catch (error) {
        console.log(`Cannot search from ${plugin.name}`.red);
        console.log(error);
        continue;
      }
      if (searchResult.length > 0) {
        // console.log(searchResult);
        const searchName = searchResult[0].name.replace(/ /g, '').toLowerCase();
        const trueName = songName.replace(/ /g, '').toLowerCase();
        if (searchName.indexOf(trueName) !== -1) {
          result.push({
            plugin,
            searchResult: searchResult[0]
          });
        } else {
          console.log(`No resource found from ${plugin.name}`.yellow);
        }
      } else {
        console.log(`No resource found from ${plugin.name}`.yellow);
      }
    }
    return result;
  }

  async getSongInfo(songId) {
    let detail;
    try {
      detail = await this.netease.getSongDetail(songId);
    } catch (err) {
      console.log('Cannot get song info from netease.'.red);
      throw new Error(err);
    }
    const songName = _netease.Netease.getSongName(detail);
    const artist = _netease.Netease.getArtistName(detail);
    const album = _netease.Netease.getAlbumName(detail);
    const albumPic = _netease.Netease.getAlbumPic(detail);
    console.log('Song name: '.green + songName);
    console.log('Artist: '.green + artist);
    console.log('Album: '.green + album);
    return {
      songName, artist, album, albumPic
    };
  }

  /*
    Get song url.
  */
  async getUrlInfo(songInfo) {
    const { songName, artist, album } = songInfo;
    let result;
    try {
      result = await this.batchSeachMusic(songName, artist, album);
    } catch (err) {
      console.log('Batch search failed.'.red);
      throw new Error(err);
    }
    result = result.sort((a, b) => {
      if (!a) {
        return 1;
      }
      if (!b) {
        return -1;
      }
      if (parseInt(a.searchResult.bitrate, 10) > parseInt(b.searchResult.bitrate, 10)) {
        return -1;
      }
      if (parseInt(a.searchResult.bitrate, 10) < parseInt(b.searchResult.bitrate, 10)) {
        return 1;
      }
      if (a.searchResult.bitrate === b.searchResult.bitrate) {
        return a.searchResult.order - b.searchResult.order;
      }
      return 0;
    });
    if (result[0]) {
      const plugin = result[0].plugin;
      const data = result[0].searchResult;
      songInfo = {
        bitrate: data.bitrate,
        filesize: data.filesize,
        hash: data.hash,
        type: data.type
      };
      let url;
      try {
        url = await plugin.getUrl(data);
      } catch (err) {
        console.log('Cannot get song url'.red);
        throw new Error(err);
      }
      songInfo.origUrl = null;
      // 魔改 URL 应对某司防火墙
      if (_config2.default.rewriteUrl) {
        songInfo.origUrl = url;
        url = url.replace(plugin.baseUrl, `music.163.com/${plugin.name.replace(/ /g, '').toLowerCase()}`);
      }
      songInfo.url = url;
      return songInfo;
    }
    return null;
  }

  async getUrlInfoForPair(pair) {
    let plugin;
    for (const p of this.plugins) {
      if (p.name === pair.plugin) {
        plugin = p;
        break;
      }
    }
    let url;
    try {
      await plugin.init();
      url = plugin.getUrl({
        prefix: 'M800',
        type: 'mp3',
        mid: pair.hash
      });
    } catch (err) {
      throw new Error(err);
    }
    return {
      hash: '',
      bitrate: '320000',
      type: 'mp3',
      url
    };
  }
}

exports.Utils = Utils;