'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const CLI_PATH = path.join(__dirname, 'hello.js');

function run(args) {
  return spawnSync(process.execPath, [CLI_PATH, ...args], { encoding: 'utf8' });
}

function assertSuccess(args, expectedStdout) {
  const result = run(args);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, expectedStdout);
  assert.equal(result.stderr, '');
}

function assertRejected(args) {
  const result = run(args);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /usage/i);
}

test('no arguments greets World', () => {
  assertSuccess([], 'Hello World!\n');
});

test('--name Ada greets Ada', () => {
  assertSuccess(['--name', 'Ada'], 'Hello Ada!\n');
});

test('explicit empty string falls back to World', () => {
  assertSuccess(['--name', ''], 'Hello World!\n');
});

test('whitespace-only value falls back to World', () => {
  assertSuccess(['--name', '   '], 'Hello World!\n');
});

test('surrounding whitespace is trimmed', () => {
  assertSuccess(['--name', '  Ada  '], 'Hello Ada!\n');
});

test('internal spaces, Unicode, and punctuation are preserved', () => {
  assertSuccess(['--name', "  José O'Neil-Étoile 你好  "], "Hello José O'Neil-Étoile 你好!\n");
});

test('embedded line break is rejected', () => {
  assertRejected(['--name', 'Ada\nEvil']);
});

test('embedded carriage return is rejected', () => {
  assertRejected(['--name', 'Ada\rEvil']);
});

test('bare --name without a value is rejected', () => {
  assertRejected(['--name']);
});

test('unknown option is rejected', () => {
  assertRejected(['--foo', 'Ada']);
});

test('positional argument is rejected', () => {
  assertRejected(['Ada']);
});

test('extra arguments after a valid pair are rejected', () => {
  assertRejected(['--name', 'Ada', 'extra']);
});

test('repeated --name options are rejected', () => {
  assertRejected(['--name', 'Ada', '--name', 'Bob']);
});

test('--name=Ada form is rejected', () => {
  assertRejected(['--name=Ada']);
});
