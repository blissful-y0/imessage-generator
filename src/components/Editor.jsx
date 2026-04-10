import { useRef, useState } from 'react';
import { useApp } from '../context';
import { t } from '../i18n';
import { Camera } from 'lucide-react';
import { exportFrameAsPng } from '../export';
import { createInitialState } from '../state';
import { parseImportedState } from '../importer';

export default function Editor() {
  const {
    state, update, addMessage, removeMessage,
    updateMessage, reorderMessages, replaceState, frameRef,
  } = useApp();
  const lang = state.lang;
  const fileRef = useRef(null);
  const dragRef = useRef(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');

  async function handleSave() {
    if (!frameRef.current) return;
    try {
      await exportFrameAsPng(frameRef.current);
    } catch (e) {
      console.error('Save failed', e);
    }
  }

  function handleAvatar(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = ev => update('profile.avatar', ev.target.result);
    r.readAsDataURL(file);
  }

  function onDragStart(e, i) { dragRef.current = i; e.currentTarget.style.opacity = '0.4'; }
  function onDragEnd(e) { e.currentTarget.style.opacity = '1'; dragRef.current = null; }
  function onDragOver(e) { e.preventDefault(); }
  function onDrop(e, i) {
    e.preventDefault();
    if (dragRef.current !== null && dragRef.current !== i) {
      reorderMessages(dragRef.current, i);
    }
    dragRef.current = null;
  }

  function openImportModal() {
    setImportText('');
    setImportError('');
    setImportOpen(true);
  }

  function closeImportModal() {
    setImportOpen(false);
    setImportError('');
  }

  function applyImportedJson() {
    try {
      const nextState = parseImportedState(importText, createInitialState());
      replaceState(nextState);
      setImportOpen(false);
      setImportText('');
      setImportError('');
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Import failed.');
    }
  }

  return (
    <aside className="editor">
      <div className="editor-header">
        <div className="editor-title">{t(lang, 'title')}</div>
        <div className="lang-toggle">
          {['ko', 'en'].map(l => (
            <button key={l}
              className={`lang-btn${state.lang === l ? ' active' : ''}`}
              onClick={() => update('lang', l)}>
              {l === 'ko' ? '한국어' : 'EN'}
            </button>
          ))}
        </div>
      </div>

      <div className="editor-body">
        {/* Status Bar */}
        <details className="section" open>
          <summary>{t(lang, 'statusBar')}</summary>
          <div className="section-body">
            <div className="form-group">
              <label className="form-label">{t(lang, 'time')}</label>
              <input className="form-input" value={state.statusBar.time}
                onChange={e => update('statusBar.time', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{t(lang, 'signal')}</label>
              <select className="form-select" value={state.statusBar.signal}
                onChange={e => update('statusBar.signal', +e.target.value)}>
                {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t(lang, 'network')}</label>
              <input className="form-input" value={state.statusBar.network}
                placeholder="5G, LTE, 4G..."
                onChange={e => update('statusBar.network', e.target.value)} />
            </div>
            <div className="form-group">
              <div className="toggle-row">
                <span className="toggle-label">Wi-Fi</span>
                <input className="toggle" type="checkbox" checked={state.statusBar.wifi}
                  onChange={e => update('statusBar.wifi', e.target.checked)} />
              </div>
            </div>
            <div className="form-group">
              <div className="toggle-row">
                <span className="toggle-label">{t(lang, 'showLocation')}</span>
                <input className="toggle" type="checkbox" checked={state.statusBar.showLocation}
                  onChange={e => update('statusBar.showLocation', e.target.checked)} />
              </div>
            </div>
          </div>
        </details>

        {/* Profile */}
        <details className="section" open>
          <summary>{t(lang, 'profile')}</summary>
          <div className="section-body">
            <div className="form-group">
              <label className="form-label">{t(lang, 'name')}</label>
              <input className="form-input" value={state.profile.name}
                onChange={e => update('profile.name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{t(lang, 'phone')}</label>
              <input className="form-input" value={state.profile.phone}
                onChange={e => update('profile.phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{t(lang, 'profilePhoto')}</label>
              <div className="avatar-upload">
                <div className="avatar-preview">
                  {state.profile.avatar
                    ? <img src={state.profile.avatar} alt="" />
                    : <svg width="28" height="28" viewBox="0 0 28 28" fill="#999">
                        <circle cx="14" cy="10" r="5.5" /><ellipse cx="14" cy="26" rx="10" ry="8" />
                      </svg>
                  }
                </div>
                <div className="avatar-btns">
                  <button className="btn btn-secondary"
                    onClick={() => fileRef.current?.click()}>
                    {t(lang, 'upload')}
                  </button>
                  <button className="btn btn-danger-sm"
                    onClick={() => { update('profile.avatar', null); if (fileRef.current) fileRef.current.value = ''; }}>
                    {t(lang, 'remove')}
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*"
                  style={{ display: 'none' }} onChange={handleAvatar} />
              </div>
            </div>
          </div>
        </details>

        {/* Messages */}
        <details className="section" open>
          <summary>{t(lang, 'messages')}</summary>
          <div className="section-body">
            <div className="msg-list">
              {state.messages.map((m, i) => (
                <div key={m.id}
                  className={`msg-card${m.type === 'time' ? ' time-card' : ''}`}
                  draggable
                  onDragStart={e => onDragStart(e, i)}
                  onDragEnd={onDragEnd}
                  onDragOver={onDragOver}
                  onDrop={e => onDrop(e, i)}>
                  <span className="drag-handle">⠿</span>
                  {m.type === 'time' ? (
                    <>
                      <span className="time-icon">🕐</span>
                      <textarea className="msg-text-input" rows={1} value={m.text}
                        placeholder={t(lang, 'timePlaceholder')}
                        onChange={e => updateMessage(m.id, 'text', e.target.value)} />
                    </>
                  ) : (
                    <>
                      <select className="sender-select" value={m.sender}
                        onChange={e => updateMessage(m.id, 'sender', e.target.value)}>
                        <option value="me">{t(lang, 'me')}</option>
                        <option value="them">{t(lang, 'other')}</option>
                      </select>
                      <textarea className="msg-text-input" rows={2} value={m.text}
                        placeholder={t(lang, 'msgPlaceholder')}
                        onChange={e => updateMessage(m.id, 'text', e.target.value)} />
                    </>
                  )}
                  <button className="delete-btn" onClick={() => removeMessage(m.id)}>×</button>
                </div>
              ))}
            </div>
            <div className="add-btns">
              <button className="btn-add" onClick={() => addMessage('message')}>
                {t(lang, 'addMessage')}
              </button>
              <button className="btn-add" onClick={() => addMessage('time')}>
                {t(lang, 'addTimeSep')}
              </button>
            </div>
          </div>
        </details>

        {/* Display */}
        <details className="section" open>
          <summary>{t(lang, 'display')}</summary>
          <div className="section-body">
            <div className="form-group">
              <div className="toggle-row">
                <span className="toggle-label">{t(lang, 'darkMode')}</span>
                <input className="toggle" type="checkbox"
                  checked={state.theme === 'dark'}
                  onChange={e => update('theme', e.target.checked ? 'dark' : 'light')} />
              </div>
            </div>
            <div className="form-group">
              <div className="toggle-row">
                <span className="toggle-label">{t(lang, 'spamWarning')}</span>
                <input className="toggle" type="checkbox"
                  checked={state.showSpamWarning}
                  onChange={e => update('showSpamWarning', e.target.checked)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t(lang, 'deliveryStatus')}</label>
              <select className="form-select" value={state.deliveryStatus}
                onChange={e => update('deliveryStatus', e.target.value)}>
                <option value="none">{t(lang, 'none')}</option>
                <option value="sent">{t(lang, 'sent')}</option>
                <option value="delivered">{t(lang, 'delivered')}</option>
                <option value="read">{t(lang, 'read')}</option>
              </select>
            </div>
            {state.deliveryStatus === 'read' && (
              <div className="form-group">
                <label className="form-label">{t(lang, 'readTime')}</label>
                <input className="form-input" value={state.readTime}
                  placeholder={t(lang, 'timePlaceholder')}
                  onChange={e => update('readTime', e.target.value)} />
              </div>
            )}
          </div>
        </details>

        {/* Input Bar */}
        <details className="section">
          <summary>{t(lang, 'inputBarSection')}</summary>
          <div className="section-body">
            <div className="form-group">
              <label className="form-label">{t(lang, 'inputText')}</label>
              <input className="form-input" value={state.inputBarText}
                placeholder={t(lang, 'inputBarPlaceholder')}
                onChange={e => update('inputBarText', e.target.value)} />
            </div>
          </div>
        </details>
      </div>

      <div className="save-bar">
        <div className="save-actions">
          <button className="btn-import" onClick={openImportModal}>
            {t(lang, 'importJson')}
          </button>
          <button className="btn-save" onClick={handleSave}>
            <Camera size={18} strokeWidth={2} />
            {t(lang, 'saveImage')}
          </button>
        </div>
      </div>

      {importOpen && (
        <div className="modal-backdrop" onClick={closeImportModal}>
          <div className="import-modal" onClick={e => e.stopPropagation()}>
            <div className="import-modal-header">
              <div className="import-modal-title">{t(lang, 'importJsonTitle')}</div>
              <button className="modal-close-btn" onClick={closeImportModal}>×</button>
            </div>
            <p className="import-modal-hint">{t(lang, 'importJsonHint')}</p>
            <textarea
              className="import-textarea"
              value={importText}
              placeholder={t(lang, 'importJsonPlaceholder')}
              onChange={e => {
                setImportText(e.target.value);
                if (importError) setImportError('');
              }}
            />
            {importError && <div className="import-error">{importError}</div>}
            <div className="import-modal-actions">
              <button className="modal-btn modal-btn-secondary" onClick={closeImportModal}>
                {t(lang, 'importJsonCancel')}
              </button>
              <button className="modal-btn modal-btn-primary" onClick={applyImportedJson}>
                {t(lang, 'importJsonApply')}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
