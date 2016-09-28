import request from 'request';
import extend from 'extend';

let common = {};

common.sendRequest = function(options) {
  let defaults = {
    method: 'get',
    followRedirect: true,
    timeout: 5000
  };
  options = extend(false, defaults, options);
  return new Promise((resolve, reject) => {
    request(options, function(err, res, body) {
      if (err) {
        reject(err);
      } else {
        resolve([res, body]);
      }
    });
  });
};

export default common;
