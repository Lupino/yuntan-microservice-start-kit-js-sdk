import fetch_ from 'isomorphic-fetch';
import qs from 'query-string';
import FormData from 'form-data';

export function fetch(url, options = {}) {
  if (options.body) {
    options.headers = options.headers || {};
    if (Array.isArray(options.body)) {
      options.headers['content-type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    } else if (typeof options.body === 'object') {
      if (!(options.body instanceof FormData)) {
        options.headers['content-type'] =
          'application/x-www-form-urlencoded;charset=UTF-8';
        options.body = qs.stringify(options.body);
      }
    }
  }
  return fetch_(url, options);
}

export async function fetchJSON(url, options, spec=null) {
  if (typeof options === 'string') {
    spec = options;
    options = {};
  }
  options = options || {};
  options['Accept'] = 'application/json';
  const rsp = await fetch_(url, options);
  if (/application\/json/.test(rsp.headers.get('content-type'))) {
    const data = await rsp.json();
    if (data.err) {
      throw new Error(data.err);
    }
    if (spec) {
      return data[spec];
    }
    return data;
  }

  const err = await rsp.text();
  throw new Error(err);
}

export function promiseToCallback(promiseFunction) {
  return (...argv) => {
    const callback = argv.pop();
    promiseFunction(...argv)
      .then((...ret) => callback(null, ...ret))
      .catch((err) => callback(err));
  };
}

export function callbackToPromise(callbackFunction) {
  return (...argv) => {
    return new Promise((resolve, reject) => {
      callbackFunction(...argv, (err, ...ret) => {
        if (err) return reject(err);
        resolve(...ret);
      });
    });
  };
}
