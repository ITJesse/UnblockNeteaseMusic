# UnblockNeteaseMusic

A proxy server for Netease Music...

# Dependencies

1. Node.js 4.x+

# How to use

1. `npm install unblock-netease-music -g`
2. `unblockneteasemusic`

## Configuration

```
unblockneteasemusic -h

  Usage: unblockneteasemusic [options]

  Options:

    -h, --help           output usage information
    -p, --port <port>    Specific server port.
    -f, --force-ip <ip>  Force the netease server ip.
```

## Windows users (fixed)

Just simply change your proxy to `127.0.0.1:8123` and restart client.

## Others (reverse proxy by nginx)

1. Install nginx.
2. Create a new vhost with the conf file below.
3. Start nginx.
4. Add a line into /etc/hosts `127.0.0.1 music.163.com`

# Nginx conf file

```
server {
    listen 80;
    server_name music.163.com;

    location / {
        proxy_pass http://127.0.0.1:8123;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Accept-Encoding "";
    }
}
  ```
  
# Build your own proxy server

1. Install nginx and Node.js
2. Nginx conf file
  
  ```
  server {
      listen 80;
      server_name music.163.com;
  
      location / {
          if ($http_host !~* ^(music.163.com)$){
              return 500;
          }
          proxy_pass http://localhost:8123;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header Accept-Encoding "";
      }
  }
  ```

3. Setup sniproxy

  ```
  user daemon
  pidfile /var/run/sniproxy.pid
  
  error_log {
      syslog daemon
      priority notice
  }
  
  listen <YOUR_SERVER_IP>:443 {
      proto tls
      table https_hosts
  
      access_log {
          filename /var/log/sniproxy/https_access.log
          priority notice
      }
      fallback 127.0.0.1:443
  }
  
  table https_hosts {
      music.163.com 223.252.199.7:443
  }
  ```

4. Install proxy server with command `sudo npm install unblock-netease-music -g`
5. Run proxy server `unblockneteasemusic`.
6. Done!

# Preview

![](https://dn-itjesse.qbox.me/github%2Fphoto_2016-03-31_01-11-14.jpg)

# Thanks

1. This project is based on EraserKing's [CloudMusicGear](https://github.com/EraserKing/CloudMusicGear).
2. Thanks for yanunon's [API documents](https://github.com/yanunon/NeteaseCloudMusic/wiki/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90API%E5%88%86%E6%9E%90).
3. Thanks for Chion82's conf files.

# License

GPLv3
