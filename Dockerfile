FROM ubuntu:14.04

WORKDIR /usr/src/

# RUN mv /etc/apt/sources.list /etc/apt/sources.list.bak
# ADD ./sources.list.trusty /etc/apt/sources.list
COPY ./server_config/nginx.conf.sample /usr/local/nginx/conf/vhost/netease.conf
COPY ./server_config/supervisord.conf.sample /etc/supervisor/conf.d/supervisord.conf

RUN apt-get update && apt-get install -y build-essential libpcre3 libpcre3-dev wget git curl zlib1g-dev \
	&& curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash - \
	# && sed -i 's/deb.nodesource.com\/node/mirrors.tuna.tsinghua.edu.cn\/nodesource\/deb/g' /etc/apt/sources.list.d/nodesource.list \
	# && apt-get update && apt-get install -y nodejs \
	&& apt-get install -y nodejs \


	&& wget http://nginx.org/download/nginx-1.10.1.tar.gz \
	&& git clone --depth=1 https://github.com/yaoweibin/ngx_http_substitutions_filter_module \
	&& tar zxvf nginx-1.10.1.tar.gz \
	&& cd nginx-1.10.1 && ./configure --prefix=/usr/local/nginx --with-http_sub_module --add-module=../ngx_http_substitutions_filter_module/ \
	&& make && make install \

	# && cat 'registry = https://registry.npm.taobao.org' > /root/.npmrc \
	&& npm install unblock-netease-music -g && npm cache clean \

	&& sed -i  "s/#gzip  on;/gzip  on;\ninclude \'.\/vhost\/*\';/" /usr/local/nginx/conf/nginx.conf \
	&& sed -i "s/worker_processes  1;/worker_processes  1;\ndaemon off;/" /usr/local/nginx/conf/nginx.conf \

	&& apt-get install -y supervisor && mkdir -p /var/log/supervisor \

	&& apt-get autoremove wget curl git build-essential --purge -y \
        && apt-get clean \
        && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/src/*

EXPOSE 80

CMD ["/usr/bin/supervisord"]
