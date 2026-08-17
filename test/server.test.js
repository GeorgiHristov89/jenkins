const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const server = require('../src/server');

const TEST_PORT = 3099;

describe('HTTP Server Endpoints', () => {
    before((done) => {
        server.listen(TEST_PORT, '127.0.0.1', done);
    });

    after((done) => {
        server.close(done);
    });

    test('GET / returns 200 and HTML', async () => {
        const res = await fetch(`http://127.0.0.1:${TEST_PORT}/`);
        assert.equal(res.status, 200);
        const text = await res.text();
        assert.ok(text.includes('Jenkins Demo App'));
    });

    test('GET /api/health returns 200 and UP status', async () => {
        const res = await fetch(`http://127.0.0.1:${TEST_PORT}/api/health`);
        assert.equal(res.status, 200);
        const data = await res.json();
        assert.equal(data.status, 'UP');
    });

    test('GET /api/calculate?op=multiply&a=6&b=7 returns 42', async () => {
        const res = await fetch(`http://127.0.0.1:${TEST_PORT}/api/calculate?op=multiply&a=6&b=7`);
        assert.equal(res.status, 200);
        const data = await res.json();
        assert.equal(data.result, 42);
    });
});
