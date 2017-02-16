'use strict';

const isSafeDomainUtil = require('../../lib/utils').isSafeDomain;
const rndm = require('rndm');
const Tokens = require('csrf');
const debug = require('debug')('egg-security:context');

const tokens = new Tokens();

const CSRF_SECRET = Symbol('egg-security#CSRF_SECRET');
const _CSRF_SECRET = Symbol('egg-security#_CSRF_SECRET');
const NEW_CSRF_SECRET = Symbol('egg-security#NEW_CSRF_SECRET');
const LOG_CSRF_NOTICE = Symbol('egg-security#CSRF_NOTICE_SUFFIX');

module.exports = {
  get securityOptions() {
    if (!this._securityOptions) {
      this._securityOptions = {};
    }
    return this._securityOptions;
  },

  isSafeDomain(domain) {
    const domainWhiteList = this.app.config.security.domainWhiteList || [];
    return isSafeDomainUtil(domain, domainWhiteList);
  },

  // 添加nonce，随机字符串就好
  // https://w3c.github.io/webappsec/specs/content-security-policy/#nonce_source

  get nonce() {
    if (!this._nonceCache) {
      this._nonceCache = rndm(16);
    }
    return this._nonceCache;
  },

  /**
   * get csrf token, general use in template
   * @return {String} csrf token
   * @public
   */
  get csrf() {
    // csrfSecret can be rotate, use NEW_CSRF_SECRET first
    const secret = this[NEW_CSRF_SECRET] || this[CSRF_SECRET];
    debug('get csrf token, NEW_CSRF_SECRET: %s, _CSRF_SECRET: %s', this[NEW_CSRF_SECRET], this[CSRF_SECRET]);
    //  In order to protect against BREACH attacks,
    //  the token is not simply the secret;
    //  a random salt is prepended to the secret and used to scramble it.
    //  http://breachattack.com/
    return secret ? tokens.create(secret) : '';
  },

  /**
   * get csrf secret from session or cookie
   * @return {String} csrf secret
   * @private
   */
  get [CSRF_SECRET]() {
    if (this[_CSRF_SECRET]) return this[_CSRF_SECRET];
    const { useSession, cookieName, sessionName } = this.app.config.security.csrf;
    // get secret from session or cookie
    if (useSession) {
      this[_CSRF_SECRET] = this.session[sessionName] || '';
    } else {
      this[_CSRF_SECRET] = this.cookies.get(cookieName, { signed: false }) || '';
    }
    return this[_CSRF_SECRET];
  },

  /**
   * ensure csrf secret exists in session or cookie.
   * @param {Boolean} rotate reset secret even if the secret exists
   * @public
   */
  ensureCsrfSecret(rotate) {
    if (this[CSRF_SECRET] && !rotate) return;
    debug('ensure csrf secret, exists: %s, rotate; %s', this[CSRF_SECRET], rotate);
    const secret = tokens.secretSync();
    this[NEW_CSRF_SECRET] = secret;
    const { useSession, sessionName, cookieDomain, cookieName } = this.app.config.security.csrf;

    if (useSession) {
      this.session[sessionName] = secret;
    } else {
      const cookieOpts = {
        domain: cookieDomain,
        signed: false,
        httpOnly: false,
        overwrite: true,
      };
      this.cookies.set(cookieName, secret, cookieOpts);
    }
  },

  /**
   * assert csrf token is present
   * @public
   */
  assertCsrf() {
    if (!this[CSRF_SECRET]) {
      debug('missing csrf token');
      this[LOG_CSRF_NOTICE]('missing csrf token');
      this.throw(403, 'missing csrf token');
    }
    const { headerName, bodyName, queryName } = this.app.config.security.csrf;
    const token = (queryName && this.query[queryName]) ||
      (headerName && this.get(headerName)) ||
      (bodyName && this.request.body && this.request.body[bodyName]);
    debug('get token %s, secret', token, this[CSRF_SECRET]);

    // AJAX requests get csrf token from cookie, in this situation token will equal to secret
    //  synchronize form requests' token always changing to protect against BREACH attacks
    if (token !== this[CSRF_SECRET] && !tokens.verify(this[CSRF_SECRET], token)) {
      debug('verify secret and token error');
      this[LOG_CSRF_NOTICE]('invalid csrf token');
      this.throw(403, 'invalid csrf token');
    }
  },

  [LOG_CSRF_NOTICE](msg) {
    if (this.app.config.env === 'local') {
      this.logger.warn(`${msg}. See https://eggjs.org/zh-cn/core/security.html#安全威胁csrf的防范`);
    }
  },
};
