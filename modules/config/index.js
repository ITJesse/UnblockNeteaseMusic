var program = require('commander');
var colors = require('colors');

program
  .option('-p, --port <port>', 'Specific server port.')
  .option('-f, --force-ip <ip>', 'Force the netease server ip.')
  .parse(process.argv);

if(program.port && (program.port < 1000 || program.port > 65535)){
  console.log('Port must be higher than 1000 and lower than 65535.'.red);
  process.exit(1);
}
if(program.forceIp && !/\d+\.\d+\.\d+\.\d+/.test(program.forceIp)){
  console.log('Please check the ip address.'.red);
  process.exit(1);
}

module.exports = program;
