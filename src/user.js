import fetchJSON from 'higher-order-helper/fetchJSON';
import config, {host} from '../config';
import qs from 'query-string';

import CoinService from 'yuntan-service/lib/CoinService';
import UserService from 'yuntan-service/lib/UserService';
import ArticleService from 'yuntan-service/lib/ArticleService';

export function weixinAuth(next) {
  window.location.href = `${host}/api/weixinAuth/?${qs.stringify({next})}`;
}

export class User {
  constructor(token = null, userInfo = null) {
    this.token = token;
    this.userInfo = userInfo;
  }

  async fetchJSON(url, options = {}) {
    if (this.token) {
      options.headers = options.headers || {};
      options.headers['X-REQUEST-TOKEN'] = this.token;
    }
    return fetchJSON(url, options);
  }

  updateProfile(profile) {
    profile = JSON.stringify(profile);
    return this.fetchJSON(`${host}/api/update_profile/`, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: profile,
    });
  }

  async getInfo(force=false) {
    if (!this.userInfo || force) {
      this.userInfo = await this.fetchJSON(`${host}/api/users/me/`);
    }
    return this.userInfo;
  }

  signout() {
    return this.fetchJSON(`${host}/api/signout/`, {method: 'POST'});
  }

  uploadAvatar(file) {
    return this.fetchJSON(`${host}/api/avatar_upload`, {
      method: 'POST',
      body: file,
    });
  }

  createArticle(title, summary='', content='') {
    return this.fetchJSON(`${host}/api/create_article/`, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({title, summary, content}),
    });
  }

  getAppSecret(service, method, pathname) {
    const q = qs.stringify({pathname, method});
    return this.fetchJSON(`${host}/api/services/${service}/secret/?${q}`);
  }

  getUserService() {
    const signSecret = this.getAppSecret.bind(this, 'user');
    return new UserService({...config.user, signSecret});
  }

  getCoinService() {
    const signSecret = this.getAppSecret.bind(this, 'coin');
    return new CoinService({...config.coin, signSecret});
  }

  getArticleService() {
    const signSecret = this.getAppSecret.bind(this, 'article');
    return new ArticleService({...config.article, signSecret});
  }
}
