export function isEmojiOnly(text) {
  const trimmed = text.trim();
  if (!trimmed) return false;
  const emojiPattern = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\u200D\u20E3\s]+$/u;
  return emojiPattern.test(trimmed) && trimmed.length <= 12;
}

export function hasTail(messages, index) {
  const msg = messages[index];
  if (!msg || msg.type !== 'message') return false;
  const next = messages[index + 1];
  if (!next) return true;
  if (next.type === 'time') return true;
  if (next.type === 'message' && next.sender !== msg.sender) return true;
  return false;
}

export function getGapClass(messages, index) {
  if (index === 0) return '';
  const prev = messages[index - 1];
  const curr = messages[index];
  if (prev.type === 'time' || curr.type === 'time') return '';
  if (prev.type === 'message' && curr.type === 'message' && prev.sender === curr.sender) return 'gap-sm';
  return 'gap-lg';
}
