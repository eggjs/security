import { EggCore } from '@eggjs/core';
import { safeCurlForApplication } from '../../lib/extend/safe_curl.js';

export default class SecurityAgent extends EggCore {
  safeCurl = safeCurlForApplication;
}
