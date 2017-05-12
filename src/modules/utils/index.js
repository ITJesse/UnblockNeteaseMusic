import 'colors';
import fs from 'fs';
import path from 'path';
import async from 'async';

import Netease from './netease';
import config from '../config';

export default class Utils {
  constructor() {
    const ip = config.forceIp ? config.forceIp : '223.252.199.7';
    this.netease = new Netease(ip);
    this.plugins = [];
    this.initPlugins();
  }

  initPlugins() {
    fs.readdirSync(path.resolve(__dirname, 'plugins')).forEach((file) => {
      const Plugin = require(path.resolve(__dirname, 'plugins', file));
      this.plugins.push(new Plugin());
    });
    this.plugins.sort((a, b) => a.order - b.order);
    // console.log(this.plugins);
  }

  batchSeachMusic(songName, artist, album) {
    return new Promise((resolve, reject) => {
      async.map(this.plugins, async (plugin, callback) => {
        console.log(`Search from ${plugin.name}`.green);
        const keyword = `${artist} ${songName} ${album}`;
        const searchResult = await plugin.search(keyword);
        if (searchResult.length > 0) {
          // console.log(searchResult);
          const searchName = searchResult[0].name.replace(/ /g, '').toLowerCase();
          const trueName = songName.replace(/ /g, '').toLowerCase();
          if (searchName.indexOf(trueName) !== -1) {
            return callback(null, {
              plugin,
              searchResult: searchResult[0],
            });
          }
        }
        console.log(`No resource found from ${plugin.name}`.yellow);
        return callback(null);
      }, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  }

  /*
    Get song url.
  */
  async getUrlInfo(songId) {
    let detail;
    try {
      detail = await this.netease.getSongDetail(songId);
    } catch (err) {
      throw new Error(err);
    }
    const songName = Netease.getSongName(detail);
    const artist = Netease.getArtistName(detail);
    const album = Netease.getAlbumName(detail);
    console.log('Song name: '.green + songName);
    console.log('Artist: '.green + artist);
    console.log('Album: '.green + album);
    let result;
    try {
      result = await this.batchSeachMusic(songName, artist, album);
    } catch (err) {
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
      const songInfo = {
        bitrate: data.bitrate,
        filesize: data.filesize,
        hash: data.hash,
        type: data.type,
      };
      let url;
      try {
        url = await plugin.getUrl(data);
      } catch (err) {
        throw new Error(err);
      }
      songInfo.origUrl = null;
      // 魔改 URL 应对某司防火墙
      if (config.rewriteUrl) {
        songInfo.origUrl = url;
        url = url.replace(plugin.baseUrl, `m8.music.126.net/${plugin.name.replace(/ /g, '').toLowerCase()}`);
      }
      songInfo.url = url;
      return songInfo;
    }
    return null;
  }
}
