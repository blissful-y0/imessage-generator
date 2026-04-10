import test from 'node:test';
import assert from 'node:assert/strict';

import { buildFrameExportOptions } from '../src/export.js';

test('buildFrameExportOptions exports the unscaled frame dimensions', () => {
  const frame = {
    offsetWidth: 393,
    offsetHeight: 852,
  };

  const options = buildFrameExportOptions(frame);

  assert.equal(options.width, 393);
  assert.equal(options.height, 852);
  assert.equal(options.scale, 2);
  assert.equal(options.backgroundColor, null);
  assert.deepEqual(options.style, {
    transform: 'none',
    transformOrigin: 'center center',
  });
  assert.deepEqual(options.features, {
    restoreScrollPosition: true,
  });
});
