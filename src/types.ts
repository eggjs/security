import type { LookupAddress } from 'node:dns';
import type { Context } from '@eggjs/core';
import './app/extend/application.js';
import './app/extend/context.js';

export interface CSRFSupportRequestItem {
  path: RegExp;
  methods: string[];
}

export type SSRFCheckAddressFunction = (
  addresses: string | LookupAddress | (string | LookupAddress)[],
  family: number | string,
  hostname: string,
) => boolean;

/**
 * security options
 * @member Config#security
 */
export interface SecurityConfig {
  /**
   * domain white list
   *
   * Default to `[]`
   */
  domainWhiteList: string[];
  /**
   * protocol white list
   *
   * Default to `[]`
   */
  protocolWhiteList: string[];
  /**
   * default open security middleware
   *
   * Default to `'csrf,hsts,methodnoallow,noopen,nosniff,csp,xssProtection,xframe,dta'`
   */
  defaultMiddleware: string;
  /**
   * whether defend csrf attack
   */
  csrf: {
    /**
     * Default to `true`
     */
    enable: boolean;
    /**
     * csrf token detect source type
     *
     * Default to `'ctoken'`
     */
    type: 'ctoken' | 'referer' | 'all' | 'any';
    /**
     * ignore json request
     *
     * Default to `false`
     *
     * @deprecated is not safe now, don't use it
     */
    ignoreJSON: boolean;
    /**
     * csrf token cookie name
     *
     * Default to `'csrfToken'`
     */
    cookieName: string | string[];
    /**
     * csrf token session name
     *
     * Default to `'csrfToken'`
     */
    sessionName: string;
    /**
     * csrf token request header name
     *
     * Default to `'x-csrf-token'`
     */
    headerName: string;
    /**
     * csrf token request body field name
     *
     * Default to `'_csrf'`
     */
    bodyName: string | string[];
    /**
     * csrf token request query field name
     *
     * Default to `'_csrf'`
     */
    queryName: string | string[];
    /**
     * rotate csrf token when it is invalid
     *
     * Default to `false`
     */
    rotateWhenInvalid: boolean;
    /**
     * These config works when using `'ctoken'` type
     *
     * Default to `false`
     */
    useSession: boolean;
    /**
     * csrf token cookie domain setting,
     * can be `(ctx) => string` or `string`
     *
     * Default to `undefined`, auto set the cookie domain in the safe way
     */
    cookieDomain?: string | ((ctx: Context) => string);
    /**
     * csrf token check requests config
     */
    supportedRequests: CSRFSupportRequestItem[];
    /**
     * referer or origin header white list.
     * It only works when using `'referer'` type
     *
     * Default to `[]`
     */
    refererWhiteList: string[];
    /**
     * csrf token cookie options
     *
     * Default to `{
     *   signed: false,
     *   httpOnly: false,
     *   overwrite: true,
     * }`
     */
    cookieOptions: {
      signed: boolean;
      httpOnly: boolean;
      overwrite: boolean;
    };
  };
  /**
   * whether enable X-Frame-Options response header
   */
  xframe: {
    /**
     * Default to `true`
     */
    enable: boolean;
    /**
     * X-Frame-Options value, can be `'DENY'`, `'SAMEORIGIN'`, `'ALLOW-FROM https://example.com'`
     *
     * Default to `'SAMEORIGIN'`
     */
    value: 'DENY' | 'SAMEORIGIN' | string;
  };
  /**
   * whether enable Strict-Transport-Security response header
   */
  hsts: {
    /**
     * Default to `false`
     */
    enable: boolean;
    /**
     * Max age of Strict-Transport-Security in seconds
     *
     * Default to `365 * 24 * 3600`
     */
    maxAge: number;
    /**
     * Whether include sub domains
     *
     * Default to `false`
     */
    includeSubdomains: boolean;
  };
  /**
   * whether enable Http Method filter
   */
  methodnoallow: {
    /**
     * Default to `true`
     */
    enable: boolean;
  };
  /**
   * whether enable IE automatically download open
   */
  noopen: {
    /**
     * Default to `true`
     */
    enable: boolean;
  };
  /**
   * whether enable IE8 automatically detect mime
   */
  nosniff: {
    /**
     * Default to `true`
     */
    enable: boolean;
  };
  /**
   * whether enable IE8 XSS Filter
   */
  xssProtection: {
    /**
     * Default to `true`
     */
    enable: boolean;
    /**
     * X-XSS-Protection response header value
     *
     * Default to `'1; mode=block'`
     */
    value: string;
  };
  /**
   * content security policy config
   */
  csp: {
    /**
     * Default to `false`
     */
    enable: boolean;
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#csp_overview
    policy: Record<string, string | string[]>;
    reportOnly: boolean;
    supportIE: boolean;
    // reportUri: string;
    // hashAlgorithm: string;
    // reportHandler: (ctx: any, reportUri: string, policy: string, violatedDirective: string, originalPolicy: string, isReportOnly: boolean) => void;
  };
  /**
   * whether enable referrer policy
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
   */
  referrerPolicy: {
    /**
     * Default to `false`
     */
    enable: boolean;
    /**
     * referrer policy value
     *
     * Default to `'no-referrer-when-downgrade'`
     */
    value: string;
  };
  /**
   * whether enable auto avoid directory traversal attack
   */
  dta: {
    /**
     * Default to `true`
     */
    enable: boolean;
  };

  ssrf: {
    ipBlackList?: string[];
    ipExceptionList?: string[];
    hostnameExceptionList?: string[];
    checkAddress?: SSRFCheckAddressFunction;
  };
}

declare module '@eggjs/core' {
  // add EggAppConfig overrides types
  interface EggAppConfig {
    security: SecurityConfig;
  }
}
