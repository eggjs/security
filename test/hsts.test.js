const { strict: assert } = require('node:assert');
const mm = require('egg-mock');

describe('test/hsts.test.js', () => {
  let app;
  let app2;
  let app3;
  describe('server', () => {
    before(async () => {
      app = mm.app({
        baseDir: 'apps/hsts',
        plugin: 'security',
      });
      await app.ready();
      app2 = mm.app({
        baseDir: 'apps/hsts-nosub',
        plugin: 'security',
      });
      await app2.ready();
      app3 = mm.app({
        baseDir: 'apps/hsts-default',
        plugin: 'security',
      });
      await app3.ready();
    });

    afterEach(mm.restore);

    it('should contain not Strict-Transport-Security header with default', async () => {
      const res = await app3.httpRequest()
        .get('/')
        .set('accept', 'text/html')
        .expect(200);
      assert.equal(res.headers['strict-transport-security'], undefined);
    });

    it('should contain Strict-Transport-Security header when configured', () => {
      return app2.httpRequest()
        .get('/')
        .set('accept', 'text/html')
        .expect('Strict-Transport-Security', 'max-age=31536000')
        .expect(200);
    });

    it('should contain includeSubdomains rule when defined', () => {
      return app.httpRequest()
        .get('/')
        .set('accept', 'text/html')
        .expect('Strict-Transport-Security', 'max-age=31536000; includeSubdomains')
        .expect(200);
    });

    it('should not contain includeSubdomains rule with this.securityOptions', () => {
      return app.httpRequest()
        .get('/nosub')
        .set('accept', 'text/html')
        .expect('Strict-Transport-Security', 'max-age=31536000')
        .expect(200);
    });
  });
});
