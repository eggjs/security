'use strict';

const mm = require('egg-mock');

describe('test/method_not_allow.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/method',
      plugin: 'security',
    });
    return app.ready();
  });

  afterEach(mm.restore);

  after(() => app.close());

  it('should allow', async () => {
    const methods = [ 'get', 'post', 'head', 'put', 'delete' ];
    for (const method of methods) {
      console.log(method);
      await app.httpRequest()[method]('/')
        .expect(200);
    }
  });

  it('should not allow trace method', () => {
    return app.httpRequest()
      .trace('/')
      .set('accept', 'text/html')
      .expect(405);
  });

  it('should allow options method', () => {
    return app.httpRequest()
      .options('/')
      .set('accept', 'text/html')
      .expect(200);
  });
});
