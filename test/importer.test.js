import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../src/state.js';
import { parseImportedState } from '../src/importer.js';

const sampleJson = JSON.stringify({
  version: 1,
  conversation: {
    contact: {
      name: 'Kitty 🐱',
      phone: '',
      avatar: null,
    },
    messages: [
      { type: 'time', text: '22:41' },
      { type: 'message', sender: 'me', text: 'You alive?' },
      { type: 'message', sender: 'them', text: 'Alive. Unfortunately.' },
    ],
  },
  ui: {
    lang: 'en',
    theme: 'light',
    statusBar: {
      time: '22:48',
      signal: 4,
      network: '5G',
      wifi: false,
      showLocation: false,
    },
    deliveryStatus: 'none',
    readTime: '',
    inputBarText: '',
    showSpamWarning: false,
  },
});

test('parseImportedState converts import JSON into internal app state', () => {
  let counter = 0;
  const state = parseImportedState(sampleJson, createInitialState(), () => `msg-${++counter}`);

  assert.equal(state.profile.name, 'Kitty 🐱');
  assert.equal(state.statusBar.time, '22:48');
  assert.equal(state.statusBar.battery, 63);
  assert.equal(state.messages.length, 3);
  assert.deepEqual(state.messages[0], {
    id: 'msg-1',
    type: 'time',
    text: '22:41',
  });
  assert.deepEqual(state.messages[1], {
    id: 'msg-2',
    type: 'message',
    sender: 'me',
    text: 'You alive?',
  });
});

test('parseImportedState rejects invalid JSON payloads', () => {
  assert.throws(
    () => parseImportedState('{bad json}', createInitialState()),
    /invalid json/i,
  );
});

test('parseImportedState rejects unsupported message shapes', () => {
  const invalidJson = JSON.stringify({
    version: 1,
    conversation: {
      contact: { name: 'A', phone: '', avatar: null },
      messages: [{ type: 'message', text: 'missing sender' }],
    },
  });

  assert.throws(
    () => parseImportedState(invalidJson, createInitialState()),
    /sender/i,
  );
});
