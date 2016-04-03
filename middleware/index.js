var request = require('request');

var baseUrl = "http://223.252.199.7";

var proxy = function(req, res, next){
  var url = req.originalUrl;
  if(!/^http/.test(url)){
    url = baseUrl + url;
  }

  if(req.method == 'POST'){
    var options = {
      url: url,
      headers: req.headers,
      method: 'post',
      body: new Buffer(req.body),
      gzip: true
    };
    request(options, function(err, resq, body) {
      if (err) {
        console.error(err);
        res.status = 500;
        return res.send('Bad request');
      } else {
        // console.log(resq.body);
        res.defaultBody = resq.body;
        delete resq.headers['content-encoding'];
        res.set(resq.headers)
        next();
      }
    });
  }

  if(req.method == 'GET'){
    var options = {
      url: url,
      headers: req.headers,
      method: 'get'
    };
    request(options)
      .on('error', function(err) {
        console.error(err.red)
      })
      .pipe(res);
  }
}

module.exports = proxy;
