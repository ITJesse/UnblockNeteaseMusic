var netease = new(require('./netease'));

netease.getSongDetail('33418856', function(err, detail){
  console.log(err);
  var quality = netease.getFallbackQuality(detail);
  console.log(quality.dfsId);
  console.log(netease.generateFallbackUrl(quality.dfsId.toString()));
});

// var kugou = new(require('./kugou'));
//
// kugou.getUrl('efba483eb717cc872436075748bcfcf8', function(err, url){
//   console.log(url);
// });

// var request = require('request');
//
// var options = {
//   url: 'http://media.store.kugou.com/v1/get_res_privilege',
//   method: 'post',
//   body: '{"appid":1001,"behavior":"play","clientver":"8043","relate":1,"resource":[{"album_id":"544828","hash":"c70b75dd07aabe2ae76b0cdaff007057","id":0,"name":"刘瑞琦 - 晴天.flac","type":"audio"}],"token":"","userid":87549184,"vip":1}',
//   gzip: true
// };
// request(options, function(err, res, body) {
//   if (err) {
//     console.error(err);
//   } else {
//     // console.log(res.headers);
//     console.log(body);
//   }
// });
