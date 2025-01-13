const mm = require('egg-mock');

describe('test/referrer.test.js', () => {
  let app;
  let app2;
  describe('server', () => {
    before(async () => {
      app = mm.app({
        baseDir: 'apps/referrer',
        plugin: 'security',
      });
      await app.ready();
      app2 = mm.app({
        baseDir: 'apps/referrer-config',
        plugin: 'security',
      });
      await app2.ready();
    });

    afterEach(mm.restore);

    it('should return default referrer-policy http header', () => {
      return app.httpRequest()
        .get('/')
        .set('accept', 'text/html')
        .expect('Referrer-Policy', 'no-referrer-when-downgrade')
        .expect(200);
    });

    it('should contain Referrer-Policy header when configured', () => {
      return app2.httpRequest()
        .get('/')
        .set('accept', 'text/html')
        .expect('Referrer-Policy', 'origin')
        .expect(200);
    });

    it('should throw error when Referrer-Policy settings is invalid when configured', () => {
      const policy = 'oorigin';
      return app2.httpRequest()
        .get(`/referrer?policy=${policy}`)
        .set('accept', 'text/html')
        .expect(new RegExp(`"${policy}" is not available.`))
        .expect(500);
    });

    // check for fix https://github.com/eggjs/egg-security/pull/50
    it('should throw error when Referrer-Policy is set to index of item in ALLOWED_POLICIES_ENUM', () => {
      const policy = 0;
      return app2.httpRequest()
        .get(`/referrer?policy=${policy}`)
        .set('accept', 'text/html')
        .expect(new RegExp(`"${policy}" is not available.`))
        .expect(500);
    });
  });
});
