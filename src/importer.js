const LANGS = new Set(['ko', 'en']);
const THEMES = new Set(['light', 'dark']);
const DELIVERY_STATUSES = new Set(['none', 'sent', 'delivered', 'read']);
const MESSAGE_TYPES = new Set(['message', 'time']);
const SENDERS = new Set(['me', 'them']);

function ensureObject(value, message) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(message);
  }
  return value;
}

function ensureString(value, message) {
  if (typeof value !== 'string') {
    throw new Error(message);
  }
  return value;
}

function ensureBoolean(value, message) {
  if (typeof value !== 'boolean') {
    throw new Error(message);
  }
  return value;
}

function ensureNumber(value, message) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(message);
  }
  return value;
}

function defaultMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON. Paste a valid JSON object.');
  }
}

function normalizeMessage(message, makeId, index) {
  const data = ensureObject(message, `Message ${index + 1} must be an object.`);
  const type = ensureString(data.type, `Message ${index + 1} needs a type.`);

  if (!MESSAGE_TYPES.has(type)) {
    throw new Error(`Message ${index + 1} has an unsupported type.`);
  }

  if (type === 'time') {
    return {
      id: makeId(),
      type: 'time',
      text: ensureString(data.text, `Time separator ${index + 1} needs text.`),
    };
  }

  const sender = ensureString(data.sender, `Message ${index + 1} needs a sender.`);
  if (!SENDERS.has(sender)) {
    throw new Error(`Message ${index + 1} sender must be "me" or "them".`);
  }

  return {
    id: makeId(),
    type: 'message',
    sender,
    text: ensureString(data.text, `Message ${index + 1} needs text.`),
  };
}

export function parseImportedState(text, baseState, makeId = defaultMessageId) {
  const seed = structuredClone(baseState);
  const parsed = ensureObject(parseJson(text), 'Import payload must be an object.');

  if (parsed.version !== 1) {
    throw new Error('Only version 1 import JSON is supported.');
  }

  const conversation = ensureObject(parsed.conversation, 'conversation is required.');
  const contact = ensureObject(conversation.contact ?? {}, 'conversation.contact must be an object.');
  const messages = conversation.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('conversation.messages must be a non-empty array.');
  }

  const nextState = structuredClone(seed);

  nextState.profile = {
    ...nextState.profile,
    name: contact.name == null ? nextState.profile.name : ensureString(contact.name, 'contact.name must be a string.'),
    phone: contact.phone == null ? nextState.profile.phone : ensureString(contact.phone, 'contact.phone must be a string.'),
    avatar: contact.avatar == null ? null : ensureString(contact.avatar, 'contact.avatar must be a string or null.'),
  };

  nextState.messages = messages.map((message, index) => normalizeMessage(message, makeId, index));

  if (parsed.ui != null) {
    const ui = ensureObject(parsed.ui, 'ui must be an object.');
    nextState.lang = ui.lang == null ? nextState.lang : ensureString(ui.lang, 'ui.lang must be a string.');
    if (!LANGS.has(nextState.lang)) {
      throw new Error('ui.lang must be "ko" or "en".');
    }

    nextState.theme = ui.theme == null ? nextState.theme : ensureString(ui.theme, 'ui.theme must be a string.');
    if (!THEMES.has(nextState.theme)) {
      throw new Error('ui.theme must be "light" or "dark".');
    }

    if (ui.statusBar != null) {
      const statusBar = ensureObject(ui.statusBar, 'ui.statusBar must be an object.');
      nextState.statusBar = {
        ...nextState.statusBar,
        ...(statusBar.time == null ? {} : { time: ensureString(statusBar.time, 'ui.statusBar.time must be a string.') }),
        ...(statusBar.signal == null ? {} : { signal: ensureNumber(statusBar.signal, 'ui.statusBar.signal must be a number.') }),
        ...(statusBar.network == null ? {} : { network: ensureString(statusBar.network, 'ui.statusBar.network must be a string.') }),
        ...(statusBar.wifi == null ? {} : { wifi: ensureBoolean(statusBar.wifi, 'ui.statusBar.wifi must be a boolean.') }),
        ...(statusBar.battery == null ? {} : { battery: ensureNumber(statusBar.battery, 'ui.statusBar.battery must be a number.') }),
        ...(statusBar.showLocation == null ? {} : { showLocation: ensureBoolean(statusBar.showLocation, 'ui.statusBar.showLocation must be a boolean.') }),
      };
    }

    if (ui.deliveryStatus != null) {
      nextState.deliveryStatus = ensureString(ui.deliveryStatus, 'ui.deliveryStatus must be a string.');
      if (!DELIVERY_STATUSES.has(nextState.deliveryStatus)) {
        throw new Error('ui.deliveryStatus is not supported.');
      }
    }

    if (ui.readTime != null) {
      nextState.readTime = ensureString(ui.readTime, 'ui.readTime must be a string.');
    }

    if (ui.inputBarText != null) {
      nextState.inputBarText = ensureString(ui.inputBarText, 'ui.inputBarText must be a string.');
    }

    if (ui.showSpamWarning != null) {
      nextState.showSpamWarning = ensureBoolean(ui.showSpamWarning, 'ui.showSpamWarning must be a boolean.');
    }
  }

  return nextState;
}
