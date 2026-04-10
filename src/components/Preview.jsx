import { useEffect, useRef } from 'react';
import { useApp } from '../context';
import { t } from '../i18n';
import { isEmojiOnly, hasTail, getGapClass } from '../utils';

/* ==============================
   iOS SVG Icons
   ============================== */

function SignalIcon({ strength = 4, color = 'currentColor' }) {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12">
      {[0, 1, 2, 3].map(i => {
        const h = 3 + i * 3;
        return (
          <rect key={i} x={i * 5} y={12 - h} width={3.5} height={h} rx={1}
            fill={color} opacity={i < strength ? 1 : 0.25} />
        );
      })}
    </svg>
  );
}

function WifiIcon({ color = 'currentColor' }) {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
      <path d="M1.3 3.8a10 10 0 0113.4 0" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3.8 6.5a6.5 6.5 0 018.4 0" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.2 9.2a3.2 3.2 0 013.6 0" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="1" fill={color} />
    </svg>
  );
}

function BatteryIcon({ color = 'currentColor' }) {
  return (
    <svg width="27" height="13" viewBox="0 0 27 13">
      <rect x="0.5" y="0.5" width="22" height="12" rx="2.5"
        stroke={color} fill="none" strokeWidth="1" opacity="0.35" />
      <rect x="23.5" y="3.5" width="2" height="5" rx="1"
        fill={color} opacity="0.4" />
      <rect x="2" y="2" width="17" height="9" rx="1.5" fill={color} />
    </svg>
  );
}

function LocationArrow({ color = 'currentColor' }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill={color}>
      <path d="M5 0.5l4 7.5c.15.3-.05.6-.4.45L5 6.5 1.4 8.45c-.35.15-.55-.15-.4-.45L5 .5z" />
    </svg>
  );
}

function BackChevron({ color = '#404040' }) {
  return (
    <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
      <path d="M9.5 1L1.5 9.5 9.5 18" stroke={color}
        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VideoIcon({ color = '#404040' }) {
  return (
    <svg width="22" height="16" viewBox="0 0 24 17" fill="none">
      <rect x="0.75" y="1.75" width="15.5" height="13.5" rx="2.5"
        stroke={color} strokeWidth="1.5" />
      <path d="M17.5 5.5l5-2.5v11l-5-2.5V5.5z" stroke={color}
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NameChevronIcon({ color = '#6e7480' }) {
  return (
    <svg width="8" height="13" viewBox="0 0 8 13" fill="none" aria-hidden="true">
      <path
        d="M1.5 1.5L6 6.5 1.5 11.5"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon({ color = '#404040', size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M14 6v16M6 14h16" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function MicIcon({ color = '#8e8e93' }) {
  return (
    <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
      <rect x="3.5" y="1" width="7" height="11" rx="3.5" stroke={color} strokeWidth="1.5" />
      <path d="M1 9.5a6 6 0 0012 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="15.5" x2="7" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function WaveformIcon({ color = '#8e8e93' }) {
  return (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
      <line x1="3" y1="6" x2="3" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="7" y1="3" x2="7" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="11" y1="5" x2="11" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="15" y1="1" x2="15" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="19" y1="6" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SendArrow() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <path d="M8.5 14V3.5M4 7.5L8.5 3 13 7.5" stroke="white"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DefaultAvatar({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id="avatarGrad" x1="26" y1="0" x2="26" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A8B4E0" />
          <stop offset="100%" stopColor="#7B8BCA" />
        </linearGradient>
      </defs>
      <circle cx="26" cy="26" r="26" fill="url(#avatarGrad)" />
      <circle cx="26" cy="20" r="8.5" fill="white" />
      <path d="M10 46c0-8.5 7.2-15.5 16-15.5s16 7 16 15.5" fill="white" />
    </svg>
  );
}

/* ==============================
   Status Bar
   ============================== */

function StatusBar() {
  const { state } = useApp();
  const { time, signal, network, wifi, battery, showLocation } = state.statusBar;
  const dark = state.theme === 'dark';
  const color = dark ? '#fff' : '#000';
  return (
    <div className="status-bar">
      <div className="sb-left">
        <span className="sb-time">{time}</span>
        {showLocation && <LocationArrow color={color} />}
      </div>
      <div className="sb-right">
        <SignalIcon strength={signal} color={color} />
        {wifi && <WifiIcon color={color} />}
        {network && <span className="sb-network">{network}</span>}
        <BatteryIcon color={color} />
      </div>
    </div>
  );
}

/* ==============================
   Nav Header (iOS 26 Liquid Glass)
   ============================== */

function NavHeader() {
  const { state } = useApp();
  const { name, phone, avatar } = state.profile;
  const dark = state.theme === 'dark';
  const displayName = name || phone || '—';
  const iconColor = dark ? '#ccc' : '#404040';
  const chevronColor = dark ? '#98989f' : '#6e7480';

  return (
    <div className="nav-header">
      <div className="nav-side-icons">
        <div className="nav-glass-btn">
          <BackChevron color={iconColor} />
        </div>
        <div className="nav-glass-btn">
          <VideoIcon color={iconColor} />
        </div>
      </div>
      <div className="nav-profile-center">
        <div className="nav-avatar-glass">
          <div className="nav-avatar-lg">
            {avatar
              ? <img src={avatar} alt="" />
              : <DefaultAvatar size={52} />
            }
          </div>
        </div>
        <div className="nav-name-pill">
          <span className="nav-contact-name">{displayName}</span>
          <span className="nav-contact-chevron">
            <NameChevronIcon color={chevronColor} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ==============================
   Chat Area
   ============================== */

function ChatArea() {
  const { state } = useApp();
  const { messages, deliveryStatus, readTime, lang } = state;
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-area" ref={chatRef}>
      {messages.map((m, i) => {
        if (m.type === 'time') {
          return <div key={m.id} className="time-sep">{m.text}</div>;
        }
        const tail = hasTail(messages, i);
        const gap = getGapClass(messages, i);
        const emoji = isEmojiOnly(m.text);
        const bubbleClass = m.sender === 'me' ? 'blue' : 'gray';
        return (
          <div key={m.id} className={`msg-row ${m.sender}${gap ? ` ${gap}` : ''}`}>
            <div className={
              `bubble ${bubbleClass}${tail ? ' tail' : ''}${emoji ? ' emoji-only' : ''}`
            }>
              {m.text}
            </div>
          </div>
        );
      })}
      {deliveryStatus !== 'none' && (() => {
        let text = '';
        if (deliveryStatus === 'delivered') text = t(lang, 'deliveredText');
        else if (deliveryStatus === 'sent') text = t(lang, 'sentText');
        else if (deliveryStatus === 'read') {
          text = readTime ? `${t(lang, 'readText')} ${readTime}` : t(lang, 'readText');
        }
        return text ? <div className="delivery-status">{text}</div> : null;
      })()}
      {state.showSpamWarning && (
        <div className="spam-section">
          <p className="spam-text">
            If you did not expect this message from an unknown
            sender, it may be spam.
          </p>
          <span className="spam-report-btn">Report Spam</span>
        </div>
      )}
    </div>
  );
}

/* ==============================
   Input Bar (iOS 26 Liquid Glass)
   ============================== */

function AudioWaveIcon({ color = '#3c3c43' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <line x1="2" y1="7" x2="2" y2="11" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="5.5" y1="4" x2="5.5" y2="14" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="9" y1="2" x2="9" y2="16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="12.5" y1="5" x2="12.5" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16" y1="7" x2="16" y2="11" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function InputBar() {
  const { state, update } = useApp();
  const dark = state.theme === 'dark';
  const hasText = state.inputBarText.length > 0;
  const fieldText = hasText ? state.inputBarText : t(state.lang, 'inputBarPlaceholder');

  return (
    <div className="input-bar">
      <div className="input-plus-btn">
        <PlusIcon color={dark ? '#ccc' : '#3c3c43'} size={28} />
      </div>
      <div className="input-pill">
        <div className="input-field-shell">
          <input
            className="input-field"
            type="text"
            value={state.inputBarText}
            placeholder=""
            aria-label={t(state.lang, 'inputBarPlaceholder')}
            onChange={e => update('inputBarText', e.target.value)}
          />
          <div className={`input-field-text${hasText ? '' : ' placeholder'}`}>
            {fieldText}
          </div>
        </div>
        <div className="input-right-icon">
          {hasText ? (
            <div className="input-send-btn"><SendArrow /></div>
          ) : (
            <AudioWaveIcon color={dark ? '#aaa' : '#3c3c43'} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ==============================
   Main Preview
   ============================== */

export default function Preview() {
  const { state, frameRef } = useApp();

  useEffect(() => {
    function resize() {
      const frame = frameRef.current;
      if (!frame) return;
      const parent = frame.parentElement;
      const ph = parent.clientHeight - 40;
      const pw = parent.clientWidth - 40;
      const scale = Math.min(1, ph / 852, pw / 393);
      frame.style.transform = `scale(${scale})`;
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [frameRef]);

  return (
    <main className="preview">
      <div className="iphone-frame" ref={frameRef}>
        <div className="iphone-bezel" />
        <div className={`iphone-screen${state.theme === 'dark' ? ' dark' : ''}`}>
          <div className="dynamic-island" />
          <StatusBar />
          <NavHeader />
          <ChatArea />
          <InputBar />
          <div className="home-indicator" />
        </div>
      </div>
    </main>
  );
}
