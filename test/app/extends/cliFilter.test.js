const mm = require('egg-mock');

describe('test/app/extends/cliFilter.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/helper-cliFilter-app',
      plugin: 'security',
    });
    return app.ready();
  });

  after(mm.restore);

  describe('helper.cliFilter()', () => {
    it('should convert special chars in param and not convert chars in whitelists', () => {
      return app.httpRequest()
        .get('/cliFilter')
        .expect(200)
        .expect('true');
    });

    it('should not convert when chars in whitelists', () => {
      return app.httpRequest()
        .get('/cliFilter-2')
        .expect(200)
        .expect('true');
    });
  });
});
