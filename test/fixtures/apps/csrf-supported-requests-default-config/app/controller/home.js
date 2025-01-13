'use strict';

exports.index = ctx => {
  ctx.body = {
    csrf: ctx.csrf,
    env: ctx.app.config.env,
    supportedRequests: ctx.app.config.security.csrf.supportedRequests,
  };
};

exports.update = ctx => {
  ctx.session.body = ctx.request.body;
  ctx.body = ctx.request.body;
};
