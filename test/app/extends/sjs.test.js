const mm = require('egg-mock');

describe('test/app/extends/sjs.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/helper-sjs-app',
      plugin: 'security',
    });
    return app.ready();
  });

  after(mm.restore);

  describe('helper.sjs()', () => {
    it('should convert special chars on js context and not convert chart in whitelists', () => {
      return app.httpRequest()
        .get('/sjs')
        .expect(200)
        .expect('true');
    });

    it('should not convert when chars in whitelists', () => {
      return app.httpRequest()
        .get('/sjs-2')
        .expect(200)
        .expect('true');
    });

    it('should convert all special chars on js context except for special', () => {
      return app.httpRequest()
        .get('/sjs-3')
        .expect(200)
        .expect('true');
    });

    it('should only convert special chars plus /', () => {
      return app.httpRequest()
        .get('/sjs-4')
        .expect(200)
        .expect('true');
    });
  });
});
