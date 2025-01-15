import type { Context, Next } from '@eggjs/core';
import { checkIfIgnore } from '../utils.js';
import type { SecurityConfig } from '../../types.js';

// https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Referrer-Policy
const ALLOWED_POLICIES_ENUM = [
  'no-referrer',
  'no-referrer-when-downgrade',
  'origin',
  'origin-when-cross-origin',
  'same-origin',
  'strict-origin',
  'strict-origin-when-cross-origin',
  'unsafe-url',
  '',
];

export default (options: SecurityConfig['referrerPolicy']) => {
  return async function referrerPolicy(ctx: Context, next: Next) {
    await next();

    const opts = {
      ...options,
      ...ctx.securityOptions.referrerPolicy,
    };
    if (checkIfIgnore(opts, ctx)) return;

    const policy = opts.value;
    if (!ALLOWED_POLICIES_ENUM.includes(policy)) {
      throw new Error('"' + policy + '" is not available."');
    }

    ctx.set('referrer-policy', policy);
  };
};
