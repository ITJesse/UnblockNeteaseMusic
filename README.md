# UnblockNeteaseMusic

> 一个基于 koa 的网易云音乐的代理，用于海外解锁及替换版权歌曲的播放地址

1. 替换版权曲目播放地址
2. 禁止客户端更新

[![NPM](https://nodei.co/npm/unblock-netease-music.png?downloads=true&downloadRank=true)](https://nodei.co/npm/unblock-netease-music/)

# 依赖

1. Node.js 8.x+
2. Nginx with subs-filter module configured.

# 注意

从 2.0 版本开始，本代理仅支持与 nginx 一同部署。standalone 分支已停止更新，无法使用。

# 使用方法
1. 安装 Nginx 和 Node.js
2. Nginx 配置参考 `/server_config/nginx.conf.sample`
3. 安装 sniproxy，配置参考 `/server_config/sniproxy.conf.sample` （非必须）
4. 安装本代理 `sudo npm install unblock-netease-music -g`
5. 后台运行 `nohup unblockneteasemusic &`
6. 完成！

## 手动匹配歌曲
<a href="https://itunes.apple.com/us/app/music-pair/id1287732570?l=zh&ls=1&mt=8"><img alt='Get it on App Store' src='./screenshots/appstore.png' width="175" /></a>

![Screen 1](./screenshots/screen1.jpg)
![Screen 2](./screenshots/screen4.jpg)
![Screen 3](./screenshots/screen3.jpg)

## 配置参数

```
unblockneteasemusic -h

  Usage: unblockneteasemusic [options]


  Options:

    -V, --version          output the version number
    -p, --port <port>      Specific server port.
    -f, --force-ip <ip>    Force the netease server ip.
    -r, --rewrite-url      Rewrite music download url, let client download file through proxy.
    --username <username>  The username of Web API.
    --password <password>  The password of Web API.
    --database-path        Specific the path to store database file.
    -v, --verbose          Display errors.
    -h, --help             output usage information
```

## 支持客户端

向 hosts 文件中添加一行：`<Server IP> music.163.com`

### OSX 用户

#### 旧版本客户端 1.4.3
直接使用。 [下载链接](http://s1.music.126.net/download/osx/NeteaseMusic_1.4.3_452_web.dmg)

#### 最新客户端
配合插件使用，详见 [NeteaseMusicPlugin](https://github.com/ITJesse/NeteaseMusicPlugin)

### Windows 用户
请务必不要更新客户端到 2.0.2 以上的版本。 [下载链接](http://s1.music.126.net/download/pc/cloudmusicsetup_2_0_2[128316].exe)

### Linux 用户
直接使用。

### 其他用户

新版客户端现在可以使用该代理解决海外限制，但是无法替换版权歌曲的播放地址。

# 预览

![Screenshot](./screenshots/unblock.png)

# 感谢

1. 这个项目最初的想法及实现来源于 EraserKing 的 [CloudMusicGear](https://github.com/EraserKing/CloudMusicGear).
2. 感谢 yanunon 的 API 文档 [API documents](https://github.com/yanunon/NeteaseCloudMusic/wiki/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90API%E5%88%86%E6%9E%90).
3. 感谢 Chion82 的配置文件

# License

GPLv3
