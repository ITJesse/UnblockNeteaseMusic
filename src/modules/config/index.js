import program from 'commander';
import 'colors';

program
  .option('-p, --port <port>', 'Specific server port.')
  .option('-f, --force-ip <ip>', 'Force the netease server ip.')
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

export default program;
