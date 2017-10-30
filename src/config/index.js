import program from 'commander';
import pkginfo from 'pkginfo';
import 'colors';

pkginfo(module);

program
  .version(module.exports.version)
  .option('-p, --port <port>', 'Specific server port.')
  .option('-f, --force-ip <ip>', 'Force the netease server ip.')
  .option('-r, --rewrite-url', 'Rewrite music download url, let client download file through proxy.')
  .option('--username <username>', 'The username of Web API.')
  .option('--password <password>', 'The password of Web API.')
  .option('--database-path', 'Specific the path to store database file.')
  .option('--proxy', 'Specific a proxy for plugins.')
  .option('-v, --verbose', 'Display errors.')
  .parse(process.argv);

if (program.kugou || program.qq) {
  console.log('The option --kugou and --qq is no longer support.'.yellow);
}

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

if (!program.username || !program.password) {
  console.log('Please set the username and password to enable the Web API.'.yellow);
  program.webApi = false;
}
if (program.username && program.password) {
  console.log('Web API enabled.'.green);
  program.webApi = true;
}

if (program.proxy) {
  console.log('Using proxy.'.green);
}

export default program;
