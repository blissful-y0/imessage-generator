import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const cssPath = new URL('../src/App.css', import.meta.url);

const glassSelectors = [
  '.nav-glass-btn',
  '.nav-avatar-glass',
  '.nav-name-pill',
  '.input-plus-btn',
  '.input-pill',
];

function getBlock(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{[^}]*\\}`, 's'));
  return match?.[0] ?? '';
}

test('glass UI uses faux-glass styling without backdrop-filter', async () => {
  const css = await readFile(cssPath, 'utf8');

  assert.match(css, /--glass-surface:\s*linear-gradient/i, 'glass surface token should be gradient-based');
  assert.match(css, /--glass-shadow:[^;]*inset/i, 'glass shadow token should include inset highlight layers');

  for (const selector of glassSelectors) {
    const block = getBlock(css, selector);
    assert.ok(block, `missing block for ${selector}`);
    assert.doesNotMatch(block, /backdrop-filter/i, `${selector} should not use backdrop-filter`);
    assert.match(block, /var\(--glass-surface\)|linear-gradient/i, `${selector} should use a faux-glass fill`);
    assert.match(block, /var\(--glass-shadow\)|inset/i, `${selector} should include highlight/shadow layers`);
  }
});
