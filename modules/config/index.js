var program = require('commander');
var colors = require('colors');

program
  .option('-p, --port <port>', 'Specific server port.')
  .option('-f, --force-ip <ip>', 'Force the netease server ip.')
  .option('-k, --kugou', 'Find copyright music on Kugou.')
  .option('-d, --dongting', 'Find copyright music on TianTianDongTing.')
  .option('-q, --qq', 'Find copyright music on QQ Music.')
  .parse(process.argv);

if (program.port && (program.port < 1 || program.port > 65535)) {
  console.log('Port must be higher than 0 and lower than 65535.'.red);
  process.exit(1);
}
if (program.forceIp && !/\d+\.\d+\.\d+\.\d+/.test(program.forceIp)) {
  console.log('Please check the ip address.'.red);
  process.exit(1);
}

if(program.kugou){
  console.log('Finding copyright music on kugou.'.green);
}
if(program.dongting){
  console.log('Finding copyright music on dongting.'.green);
}
if(!program.kugou && !program.dongting && !program.qq){
  console.log('Proxy will do nothing with copyright music.'.yellow);
}
if(program.qq){
  console.log('Finding copyright music on QQ Music.'.green);
}

module.exports = program;
