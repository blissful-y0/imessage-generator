import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const cssPath = new URL('../src/App.css', import.meta.url);

function getBlock(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{[^}]*\\}`, 's'));
  return match?.[0] ?? '';
}

test('name pill allows text and emoji to fit without clipping', async () => {
  const css = await readFile(cssPath, 'utf8');
  const pillBlock = getBlock(css, '.nav-name-pill');
  const textBlock = getBlock(css, '.nav-contact-name');

  assert.ok(pillBlock, 'missing .nav-name-pill block');
  assert.ok(textBlock, 'missing .nav-contact-name block');

  assert.doesNotMatch(pillBlock, /overflow:\s*hidden/i, 'name pill should not clip content');
  assert.doesNotMatch(pillBlock, /(?:^|[;\s])height\s*:/i, 'name pill should size to content instead of fixed height');
  assert.match(pillBlock, /\bmin-height\s*:/i, 'name pill should keep a minimum tap/visual height');
  assert.doesNotMatch(textBlock, /line-height:\s*1(?:[;\s}]|$)/i, 'name text should allow emoji ascent/descent');
});
