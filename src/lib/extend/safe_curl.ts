import { EggCore } from '@eggjs/core';
import { SSRFCheckAddressFunction } from '../../types.js';

const SSRF_HTTPCLIENT = Symbol('SSRF_HTTPCLIENT');

type HttpClient = EggCore['HttpClient'];
type HttpClientParameters = Parameters<HttpClient['prototype']['request']>;
export type HttpClientRequestURL = HttpClientParameters[0];
export type HttpClientOptions = HttpClientParameters[1] & { checkAddress?: SSRFCheckAddressFunction };
export type HttpClientRequestReturn = ReturnType<HttpClient['prototype']['request']>;

/**
 * safe curl with ssrf protect
 * @param {String} url request url
 * @param {Object} options request options
 * @return {Promise} response
 */
export async function safeCurlForApplication(this: EggCore, url: HttpClientRequestURL, options: HttpClientOptions = {}): HttpClientRequestReturn {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const app = this;
  const ssrfConfig = app.config.security.ssrf;
  if (ssrfConfig?.checkAddress) {
    options.checkAddress = ssrfConfig.checkAddress;
  } else {
    app.logger.warn('[@eggjs/security] please configure `config.security.ssrf` first');
  }

  if (ssrfConfig?.checkAddress) {
    let httpClient = app[SSRF_HTTPCLIENT] as ReturnType<EggCore['createHttpClient']>;
    // use the new httpClient init with checkAddress
    if (!httpClient) {
      httpClient = app[SSRF_HTTPCLIENT] = app.createHttpClient({
        checkAddress: ssrfConfig.checkAddress,
      });
    }
    return await httpClient.request(url, options);
  }

  return await app.curl(url, options);
}
