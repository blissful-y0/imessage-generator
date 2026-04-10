import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const cssPath = new URL('../src/App.css', import.meta.url);

function getBlock(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{[^}]*\\}`, 's'));
  return match?.[0] ?? '';
}

test('input action slot is at least as wide as the send button', async () => {
  const css = await readFile(cssPath, 'utf8');
  const slotBlock = getBlock(css, '.input-right-icon');
  const sendBlock = getBlock(css, '.input-send-btn');

  assert.ok(slotBlock, 'missing .input-right-icon block');
  assert.ok(sendBlock, 'missing .input-send-btn block');

  const slotWidth = Number(slotBlock.match(/width:\s*(\d+)px/i)?.[1]);
  const sendWidth = Number(sendBlock.match(/width:\s*(\d+)px/i)?.[1]);

  assert.ok(Number.isFinite(slotWidth), 'input-right-icon width should be explicit');
  assert.ok(Number.isFinite(sendWidth), 'input-send-btn width should be explicit');
  assert.ok(slotWidth >= sendWidth, 'input-right-icon should not squeeze the send button');
});
