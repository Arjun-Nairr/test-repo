#!/usr/bin/env node
'use strict';

const USAGE = 'Usage: node hello.js [--name VALUE]';
const LINE_BREAK_PATTERN = /[\r\n\u2028\u2029]/;

function resolveName(args) {
  if (args.length === 0) return 'World';

  if (args.length !== 2 || args[0] !== '--name') {
    throw new Error(`Unsupported arguments. ${USAGE}`);
  }

  const value = args[1];
  if (value.startsWith('--')) {
    throw new Error(`Missing value for --name. ${USAGE}`);
  }
  if (LINE_BREAK_PATTERN.test(value)) {
    throw new Error(`--name must not contain line breaks. ${USAGE}`);
  }

  const trimmed = value.trim();
  return trimmed === '' ? 'World' : trimmed;
}

function main() {
  let name;
  try {
    name = resolveName(process.argv.slice(2));
  } catch (err) {
    process.stderr.write(`${err.message}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(`Hello ${name}!\n`);
}

main();
