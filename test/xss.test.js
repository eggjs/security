const mm = require('egg-mock');

describe('test/xss.test.js', () => {
  let app;
  let app2;
  let app3;
  describe('server', () => {
    before(async () => {
      app = mm.app({
        baseDir: 'apps/xss',
        plugin: 'security',
      });
      await app.ready();

      app2 = mm.app({
        baseDir: 'apps/xss-close',
        plugin: 'security',
      });
      await app2.ready();

      app3 = mm.app({
        baseDir: 'apps/xss-close-zero',
        plugin: 'security',
      });
      await app3.ready();
    });

    afterEach(mm.restore);

    it('should contain default X-XSS-Protection header', () => {
      return app.httpRequest()
        .get('/')
        .set('accept', 'text/html')
        .expect('X-XSS-Protection', '1; mode=block')
        .expect(200);
    });
    it('should set X-XSS-Protection header value 0 by this.securityOptions', () => {
      return app.httpRequest()
        .get('/0')
        .set('accept', 'text/html')
        .expect('X-XSS-Protection', '0')
        .expect(200);
    });
    it('should set X-XSS-Protection header value 0', () => {
      return app2.httpRequest()
        .get('/')
        .set('accept', 'text/html')
        .expect('X-XSS-Protection', '0')
        .expect(200);
    });
    it('should set X-XSS-Protection header value 0 when config is number 0', () => {
      return app3.httpRequest()
        .get('/')
        .set('accept', 'text/html')
        .expect('X-XSS-Protection', '0')
        .expect(200);
    });
  });
});
