const mm = require('egg-mock');

describe('test/app/extends/escapeShellCmd.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/helper-escapeShellCmd-app',
      plugin: 'security',
    });
    return app.ready();
  });

  after(mm.restore);

  describe('helper.escapeShellCmd()', () => {
    it('should convert chars in blacklists', () => {
      return app.httpRequest()
        .get('/escapeShellCmd')
        .expect(200)
        .expect('true');
    });

    it('should not affect normal cmd', () => {
      return app.httpRequest()
        .get('/escapeShellCmd-2')
        .expect(200)
        .expect('true');
    });
  });
});
