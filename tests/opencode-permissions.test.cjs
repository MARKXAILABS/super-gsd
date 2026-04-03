/**
 * GSD Tools Tests - OpenCode permission config
 *
 * Regression tests for OpenCode permission handling, including the valid
 * top-level string form: "permission": "allow".
 */

process.env.GSD_TEST_MODE = '1';

const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { createTempDir, cleanup } = require('./helpers.cjs');
const { configureOpencodePermissions } = require('../bin/install.js');

const installSrc = fs.readFileSync(path.join(__dirname, '..', 'bin', 'install.js'), 'utf8');

describe('configureOpencodePermissions', () => {
  let configDir;

  beforeEach(() => {
    configDir = createTempDir('gsd-opencode-');
  });

  afterEach(() => {
    cleanup(configDir);
  });

  test('does not rewrite top-level string permissions', () => {
    const configPath = path.join(configDir, 'opencode.json');
    const original = JSON.stringify({
      $schema: 'https://opencode.ai/config.json',
      permission: 'allow',
      skills: { paths: ['/tmp/skills'] },
    }, null, 2) + '\n';

    fs.writeFileSync(configPath, original);

    assert.doesNotThrow(() => configureOpencodePermissions(true, configDir));
    assert.strictEqual(fs.readFileSync(configPath, 'utf8'), original);
  });

  test('adds path-specific read and external_directory permissions for object configs', () => {
    const configPath = path.join(configDir, 'opencode.json');
    fs.writeFileSync(configPath, JSON.stringify({ permission: {} }, null, 2) + '\n');

    configureOpencodePermissions(true, configDir);

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const gsdPath = `${configDir.replace(/\\/g, '/')}/get-shit-done/*`;

    assert.strictEqual(config.permission.read[gsdPath], 'allow');
    assert.strictEqual(config.permission.external_directory[gsdPath], 'allow');
  });

  test('finishInstall passes the actual config dir to OpenCode permissions', () => {
    assert.ok(installSrc.includes('configureOpencodePermissions(isGlobal, configDir);'), 'OpenCode permission config uses actual install dir');
  });
});
