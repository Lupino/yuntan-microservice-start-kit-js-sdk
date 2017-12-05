import {weixinAuth, User} from './user';

module.exports = {
  weixinAuth,
  User,
};

if (typeof window !== 'undefined') {
  window['sdk'] = {
    weixinAuth,
    User,
  };
}
