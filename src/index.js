export {weixinAuth, User} from './user';
export {fetch, fetchJSON, promiseToCallback, callbackToPromise} from './utils';

if (typeof window !== 'undefined') {
  window['sdk'] = {
    weixinAuth,
    User,
    fetch,
    fetchJSON,
    promiseToCallback,
    callbackToPromise,
  }
}
