const { strict: assert } = require('node:assert');
const mm = require('egg-mock');

describe('test/xframe.test.js', () => {
  let app;
  let app2;
  let app3;
  let app4;
  before(async () => {
    app = mm.app({
      baseDir: 'apps/iframe',
      plugin: 'security',
    });
    await app.ready();

    app2 = mm.app({
      baseDir: 'apps/iframe-novalue',
      plugin: 'security',
    });
    await app2.ready();

    app3 = mm.app({
      baseDir: 'apps/iframe-allowfrom',
      plugin: 'security',
    });
    await app3.ready();

    app4 = mm.app({
      baseDir: 'apps/iframe-black-urls',
      plugin: 'security',
    });
    await app4.ready();
  });

  afterEach(mm.restore);

  it('should contain X-Frame-Options: SAMEORIGIN', async () => {
    await app.httpRequest()
      .get('/')
      .set('accept', 'text/html')
      .expect('X-Frame-Options', 'SAMEORIGIN');

    await app.httpRequest()
      .get('/foo')
      .set('accept', 'text/html')
      .expect('X-Frame-Options', 'SAMEORIGIN');
  });

  it('should contain X-Frame-Options: ALLOW-FROM http://www.domain.com by this.securityOptions', async () => {
    const res = await app.httpRequest()
      .get('/options')
      .set('accept', 'text/html');
    assert.equal(res.status, 200);
    assert.equal(res.headers['x-frame-options'], 'ALLOW-FROM http://www.domain.com');
  });

  it('should contain X-Frame-Options: SAMEORIGIN when dont set value option', function(done) {
    app2.httpRequest()
      .get('/foo')
      .set('accept', 'text/html')
      .expect('X-Frame-Options', 'SAMEORIGIN', done);
  });

  it('should contain X-Frame-Options: ALLOW-FROM with page when set ALLOW-FROM and page option', function(done) {
    app3.httpRequest()
      .get('/foo')
      .set('accept', 'text/html')
      .expect('X-Frame-Options', 'ALLOW-FROM http://www.domain.com', done);
  });

  it('should not contain X-Frame-Options: SAMEORIGIN when use ignore', async () => {
    let res = await app.httpRequest()
      .get('/hello')
      .set('accept', 'text/html')
      .expect(200);
    assert.equal(res.headers['X-Frame-Options'], undefined);

    res = await app4.httpRequest()
      .get('/hello')
      .set('accept', 'text/html')
      .expect(200);
    assert.equal(res.headers['X-Frame-Options'], undefined);

    res = await app.httpRequest()
      .get('/world/12')
      .set('accept', 'text/html')
      .expect(200);
    assert.equal(res.headers['X-Frame-Options'], undefined);

    res = await app.httpRequest()
      .get('/world/12?xx=xx')
      .set('accept', 'text/html')
      .expect(200);
    assert.equal(res.headers['X-Frame-Options'], undefined);

    res = await app2.httpRequest()
      .get('/hello')
      .set('accept', 'text/html')
      .expect(200);
    assert.equal(res.headers['X-Frame-Options'], undefined);

    res = await app2.httpRequest()
      .get('/world/12')
      .set('accept', 'text/html')
      .expect(200);
    assert.equal(res.headers['X-Frame-Options'], undefined);

    res = await app2.httpRequest()
      .get('/world/12?xx=xx')
      .set('accept', 'text/html')
      .expect(200);
    assert.equal(res.headers['X-Frame-Options'], undefined);
  });
});
