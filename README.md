# UnblockNeteaseMusic

> 一个基于 koa 的网易云音乐的代理……

1. 替换版权曲目播放地址
2. 禁止客户端更新

[![NPM](https://nodei.co/npm/unblock-netease-music.png?downloads=true&downloadRank=true)](https://nodei.co/npm/unblock-netease-music/)

# 依赖

1. Node.js 4.x+
2. Nginx with subs-filter module configured.

# 注意

从 2.0 版本开始，本代理仅支持服务端部署。本地使用请查阅 standalone 分支，或使用 1.x 版本。

# 使用方法
1. 安装 Nginx 和 Node.js
2. Nginx 配置参考 `/server_config/nginx.conf.sample`
3. 安装 sniproxy，配置参考 `/server_config/sniproxy.conf.sample`
4. 安装本代理 `sudo npm install unblock-netease-music -g`
5. 后台运行 `nohup unblockneteasemusic &`.
6. 完成！


1. `npm install unblock-netease-music -g`
2. `unblockneteasemusic`

## 配置参数

```
unblockneteasemusic -h

  Usage: unblockneteasemusic [options]

  Options:

    -h, --help           output usage information
    -p, --port <port>    Specific server port.
    -f, --force-ip <ip>  Force the netease server ip.
    -k, --kugou          Find copyright music on Kugou.
    -q, --qq             Find copyright music on QQ Music.
    -r, --rewrite-url    Rewrite music download url, let client download file through proxy.
```

## OSX 与 Windows 用户

向 hosts 文件中添加一行：`<Server IP> music.163.com`

> OSX 用户请务必不要更新客户端到 1.4.3 以上的版本。 [下载链接](http://s1.music.126.net/download/osx/NeteaseMusic_1.4.3_452_web.dmg)
> Windows 用户请务必不要更新客户端到 2.0.2 以上的版本。 [下载链接](http://s1.music.126.net/download/pc/cloudmusicsetup_2_0_2[128316].exe)

## 其他用户

新客户端 API 有改动，已经用不了了

# 预览

![](https://dn-itjesse.qbox.me/github%2Fphoto_2016-03-31_01-11-14.jpg)

# 感谢

1. 这个项目最初的想法及实现来源于 EraserKing 的 [CloudMusicGear](https://github.com/EraserKing/CloudMusicGear).
2. 感谢 yanunon 的 API 文档 [API documents](https://github.com/yanunon/NeteaseCloudMusic/wiki/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90API%E5%88%86%E6%9E%90).
3. 感谢 Chion82 的配置文件

# License

GPLv3
