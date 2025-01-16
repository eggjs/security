import type { ILifecycleBoot, EggCore } from '@eggjs/core';
import { preprocessConfig } from './lib/utils.js';
import { SecurityConfig } from './config/config.default.js';

export default class AgentBoot implements ILifecycleBoot {
  private readonly app;

  constructor(app: EggCore) {
    this.app = app;
  }

  configWillLoad() {
    const app = this.app;
    app.config.coreMiddleware.push('securities');
    // parse config and check if config is legal
    app.config.security = SecurityConfig.parse(app.config.security);

    if (app.config.security.csrf.enable) {
      const { ignoreJSON } = app.config.security.csrf;
      if (ignoreJSON) {
        app.deprecate('[@eggjs/security/app] `app.config.security.csrf.ignoreJSON` is not safe now, please disable it.');
      }

      // const legalTypes = [ 'all', 'referer', 'ctoken', 'any' ];
      // assert(legalTypes.includes(type),
      //   '[@eggjs/security/ap] `config.security.csrf.type` must be one of ' + legalTypes.join(', '));
    }

    preprocessConfig(app.config.security);
  }
}
