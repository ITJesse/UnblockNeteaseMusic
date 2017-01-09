import request from 'request';

const common = {};

common.sendRequest = (options) => {
  const defaults = {
    method: 'get',
    followRedirect: true,
    timeout: 5000,
  };
  options = {
    ...defaults,
    ...options,
  };
  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        const result = {
          res,
          body,
        };
        resolve(result);
      }
    });
  });
};

export default common;
