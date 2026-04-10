import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const previewPath = new URL('../src/components/Preview.jsx', import.meta.url);

test('preview uses export-stable markup for name pill and input bar', async () => {
  const source = await readFile(previewPath, 'utf8');

  assert.doesNotMatch(source, /&#8250;|›/, 'name pill should use an explicit icon, not a font glyph chevron');
  assert.match(source, /function NameChevronIcon/, 'preview should provide a deterministic chevron icon');
  assert.match(source, /className="input-field"/, 'input bar should keep a real input for interaction');
  assert.match(source, /className="input-field-text/, 'input bar should render text with a display element');
});
