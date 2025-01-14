import { SecurityConfig } from '../types.js';

export default {
  security: {
    domainWhiteList: [],
    protocolWhiteList: [],
    defaultMiddleware: 'csrf,hsts,methodnoallow,noopen,nosniff,csp,xssProtection,xframe,dta',

    csrf: {
      enable: true,

      // can be ctoken or referer or all
      type: 'ctoken',
      ignoreJSON: false,

      // These config works when using ctoken type
      useSession: false,
      // can be function(ctx) or String
      cookieDomain: undefined,
      cookieName: 'csrfToken',
      sessionName: 'csrfToken',
      headerName: 'x-csrf-token',
      bodyName: '_csrf',
      queryName: '_csrf',
      rotateWhenInvalid: false,
      supportedRequests: [
        { path: /^\//, methods: [ 'POST', 'PATCH', 'DELETE', 'PUT', 'CONNECT' ] },
      ],

      // These config works when using referer type
      refererWhiteList: [
        // 'eggjs.org'
      ],
      // csrf token's cookie options
      cookieOptions: {
        signed: false,
        httpOnly: false,
        overwrite: true,
      },
    },

    xframe: {
      enable: true,
      // 'SAMEORIGIN', 'DENY' or 'ALLOW-FROM http://example.jp'
      value: 'SAMEORIGIN',
    },

    hsts: {
      enable: false,
      maxAge: 365 * 24 * 3600,
      includeSubdomains: false,
    },

    dta: {
      enable: true,
    },

    methodnoallow: {
      enable: true,
    },

    noopen: {
      enable: true,
    },

    nosniff: {
      enable: true,
    },

    referrerPolicy: {
      enable: false,
      value: 'no-referrer-when-downgrade',
    },

    xssProtection: {
      enable: true,
      value: '1; mode=block',
    },

    csp: {
      enable: false,
      policy: {},
    },

    ssrf: {
      ipBlackList: undefined,
      ipExceptionList: undefined,
      hostnameExceptionList: undefined,
      checkAddress: undefined,
    },
  } as SecurityConfig,

  helper: {
    shtml: {},
  },
};
