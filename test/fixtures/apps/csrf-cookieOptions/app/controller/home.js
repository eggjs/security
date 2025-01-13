'use strict';

module.exports = app => {
  return class Home extends app.Controller {
    * index() {
      this.ctx.body = 'hello csrfToken cookieOptions';
    }
  };
};
