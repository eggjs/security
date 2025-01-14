import { EggCore } from '@eggjs/core';
import { safeCurlForApplication } from '../../lib/extend/safe_curl.js';

const INPUT_CSRF = '\r\n<input type="hidden" name="_csrf" value="{{ctx.csrf}}" /></form>';
const INJECTION_DEFENSE = '<!--for injection--><!--</html>--><!--for injection-->';

export default class SecurityApplication extends EggCore {
  injectCsrf(html: string) {
    html = html.replace(/(<form.*?>)([\s\S]*?)<\/form>/gi, (_, $1, $2) => {
      const match = $2;
      if (match.indexOf('name="_csrf"') !== -1 || match.indexOf('name=\'_csrf\'') !== -1) {
        return $1 + match + '</form>';
      }
      return $1 + match + INPUT_CSRF;
    });
    return html;
  }

  injectNonce(html: string) {
    html = html.replace(/<script(.*?)>([\s\S]*?)<\/script[^>]*?>/gi, (_, $1, $2) => {
      if (!$1.includes('nonce=')) {
        $1 += ' nonce="{{ctx.nonce}}"';
      }
      return '<script' + $1 + '>' + $2 + '</script>';
    });
    return html;
  }

  injectHijackingDefense(html: string) {
    return INJECTION_DEFENSE + html + INJECTION_DEFENSE;
  }

  safeCurl = safeCurlForApplication;
}

declare module '@eggjs/core' {
  interface EggCore {
    injectCsrf(html: string): string;
    injectNonce(html: string): string;
    injectHijackingDefense(html: string): string;
    safeCurl: typeof safeCurlForApplication;
  }
}
