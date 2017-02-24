import request from 'request-promise';

export const sendRequest = async (options) => {
  const defaults = {
    method: 'get',
    followRedirect: true,
    timeout: 5000,
    resolveWithFullResponse: true,
  };
  options = {
    ...defaults,
    ...options,
  };
  let result;
  try {
    result = await request(options);
  } catch (err) {
    throw new Error(err);
  }
  return result;
};

export default sendRequest;
