import program from 'commander';
import 'colors';

program
  .option('-p, --port <port>', 'Specific server port.')
  .option('-f, --force-ip <ip>', 'Force the netease server ip.')
  .option('-k, --kugou', 'Find copyright music on Kugou.')
  .option('-q, --qq', 'Find copyright music on QQ Music.')
  .option('-r, --rewrite-url', 'Rewrite music download url, let client download file through proxy.')
  .parse(process.argv);

if (program.port && (program.port < 1 || program.port > 65535)) {
  console.log('Port must be higher than 0 and lower than 65535.'.red);
  process.exit(1);
}
if (program.forceIp && !/\d+\.\d+\.\d+\.\d+/.test(program.forceIp)) {
  console.log('Please check the ip address.'.red);
  process.exit(1);
}

if (program.rewriteUrl) {
  console.log('Rewrite music download url.'.green);
}
if (program.kugou) {
  console.log('Finding copyright music on Kugou.'.green);
}
if (program.qq) {
  console.log('Finding copyright music on QQ Music.'.green);
}
if (!program.kugou && !program.qq) {
  console.log('Proxy will do nothing with copyright music.'.yellow);
}

export default program;
