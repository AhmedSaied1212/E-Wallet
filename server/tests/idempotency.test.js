const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const generateRequestHash = require('../utils/generateRequestHash');
const { validateIdempotencyKey } = require('../modules/idempotency/idempotency.validation');

test('generateRequestHash produces the same value for equivalent payloads', () => {
  const one = { amount: '500', receiverWalletId: 'wallet-1' };
  const two = { receiverWalletId: 'wallet-1', amount: '500' };

  assert.equal(generateRequestHash(one), generateRequestHash(two));
});

test('validateIdempotencyKey rejects missing or empty idempotency keys', () => {
  assert.throws(() => validateIdempotencyKey(undefined), /required/);
  assert.throws(() => validateIdempotencyKey('   '), /cannot be empty/);
});

test('transaction service does not open pooled DB connections directly', () => {
  const serviceSource = fs.readFileSync(path.join(__dirname, '../modules/transaction/transaction.service.js'), 'utf8');
  assert.ok(!serviceSource.includes('const client = await db.connect();'));
});

test('transaction repository mutates wallet balances for deposit, withdrawal, and transfer writes', () => {
  const repositorySource = fs.readFileSync(path.join(__dirname, '../modules/transaction/transaction.repository.js'), 'utf8');

  assert.match(repositorySource, /UPDATE wallets\s+SET\s+balance\s*=\s*balance\s*\+\s*\$\d+/i);
  assert.match(repositorySource, /UPDATE wallets\s+SET\s+balance\s*=\s*balance\s*-\s*\$\d+/i);
  assert.match(repositorySource, /UPDATE wallets\s+SET\s+balance\s*=\s*balance\s*\+\s*\$\d+/i);
});
