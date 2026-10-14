import assert from 'node:assert/strict';
import { once } from 'node:events';
import type { AddressInfo } from 'node:net';
import { createApp } from '../../server';

type TestCase = { name: string; run: (baseUrl: string) => Promise<void> };

async function withTestServer(run: (baseUrl: string) => Promise<void>) {
  const app = await createApp({ serveFrontend: false });
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address() as AddressInfo;
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    const closed = once(server, 'close');
    server.close();
    await closed;
  }
}

const tests: TestCase[] = [
  {
    name: 'health endpoint reports process health without claiming business APIs are ready',
    run: async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/health`);
      const body = await response.json();
      assert.equal(response.status, 200);
      assert.equal(body.data.status, 'healthy');
      assert.equal(body.data.businessApiReady, false);
      assert.equal(body.data.persistenceConfigured, false);
      assert.equal(body.data.authenticationConfigured, false);
      assert.equal('ledgerBalanced' in body.data, false);
    },
  },
  {
    name: 'state read fails closed until canonical persistence is configured',
    run: async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/state`);
      const body = await response.json();
      assert.equal(response.status, 503);
      assert.equal(body.error, 'BACKEND_NOT_CONFIGURED');
    },
  },
  {
    name: 'arbitrary state sync is disabled and cannot overwrite server state',
    run: async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/state/sync`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ledgerBalanced: true, auditChainValid: true, isAdmin: true }),
      });
      const body = await response.json();
      assert.equal(response.status, 503);
      assert.equal(body.error, 'BACKEND_NOT_CONFIGURED');
    },
  },
  {
    name: 'order creation does not return a fake persisted-success response',
    run: async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ orderId: 'TEST-1', totalFare: 100 }),
      });
      const body = await response.json();
      assert.equal(response.status, 503);
      assert.equal(body.error, 'BACKEND_NOT_CONFIGURED');
    },
  },
  {
    name: 'vault transfer does not claim success using a client-supplied balance',
    run: async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/vaults/transfer`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ fromVaultId: 'A', toVaultId: 'B', amount: 10, fromBalance: 100000 }),
      });
      const body = await response.json();
      assert.equal(response.status, 503);
      assert.equal(body.error, 'BACKEND_NOT_CONFIGURED');
    },
  },
  {
    name: 'audit verification does not claim to verify caller-provided hashes as a stored chain',
    run: async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/audit/verify`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ logs: [{ securitySealHash: '0123456789abcdef' }] }),
      });
      const body = await response.json();
      assert.equal(response.status, 503);
      assert.equal(body.error, 'BACKEND_NOT_CONFIGURED');
    },
  },
  {
    name: 'oversized JSON payload is rejected with a safe JSON response',
    run: async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ payload: 'x'.repeat(300 * 1024) }),
      });
      const body = await response.json();
      assert.equal(response.status, 413);
      assert.equal(body.error, 'PAYLOAD_TOO_LARGE');
      assert.equal('stack' in body, false);
    },
  },
  {
    name: 'malformed JSON is rejected without exposing a stack trace',
    run: async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/state/sync`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{bad json',
      });
      const body = await response.json();
      assert.equal(response.status, 400);
      assert.equal(body.error, 'INVALID_JSON');
      assert.equal('stack' in body, false);
    },
  },
];

let failures = 0;
for (const test of tests) {
  try {
    await withTestServer(test.run);
    console.log(`✅ [PASS] ${test.name}`);
  } catch (error) {
    failures += 1;
    console.error(`❌ [FAIL] ${test.name}`, error);
  }
}

console.log(`\nServer API safety tests: ${tests.length - failures}/${tests.length} passed.`);
if (failures > 0) process.exitCode = 1;
