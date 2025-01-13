const SSRF_HTTPCLIENT = Symbol('SSRF_HTTPCLIENT');

/**
 * safe curl with ssrf protect
 * @param {String} url request url
 * @param {Object} options request options
 * @return {Promise} response
 */
exports.safeCurlForApplication = function safeCurlForApplication(url, options = {}) {
  const app = this;
  const ssrfConfig = app.config.security.ssrf;
  if (ssrfConfig?.checkAddress) {
    options.checkAddress = ssrfConfig.checkAddress;
  } else {
    app.logger.warn('[egg-security] please configure `config.security.ssrf` first');
  }

  if (app.config.httpclient.useHttpClientNext && ssrfConfig?.checkAddress) {
    // use the new httpClient init with checkAddress
    if (!app[SSRF_HTTPCLIENT]) {
      app[SSRF_HTTPCLIENT] = app.createHttpClient({
        checkAddress: ssrfConfig.checkAddress,
      });
    }
    return app[SSRF_HTTPCLIENT].request(url, options);
  }

  return app.curl(url, options);
};

exports.safeCurlForContext = function safeCurlForContext(url, options = {}) {
  return this.app.safeCurl(url, options);
};
