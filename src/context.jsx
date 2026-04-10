import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { createInitialState } from './state';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, setState] = useState(() => createInitialState());
  const frameRef = useRef(null);

  const update = useCallback((path, value) => {
    setState(prev => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }, []);

  const addMessage = useCallback((type = 'message') => {
    setState(prev => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: String(Date.now()),
          type,
          ...(type === 'message' ? { sender: 'me', text: '' } : { text: '' }),
        },
      ],
    }));
  }, []);

  const removeMessage = useCallback((id) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.filter(m => m.id !== id),
    }));
  }, []);

  const updateMessage = useCallback((id, field, value) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(m =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    }));
  }, []);

  const reorderMessages = useCallback((fromIdx, toIdx) => {
    setState(prev => {
      const msgs = [...prev.messages];
      const [item] = msgs.splice(fromIdx, 1);
      msgs.splice(toIdx, 0, item);
      return { ...prev, messages: msgs };
    });
  }, []);

  const replaceState = useCallback((nextState) => {
    setState(nextState);
  }, []);

  return (
    <AppContext.Provider value={{
      state, update, addMessage, removeMessage,
      updateMessage, reorderMessages, replaceState, frameRef,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
