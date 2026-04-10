export const initialState = {
  lang: 'en',
  theme: 'light',
  statusBar: {
    time: '23:48',
    signal: 4,
    network: '5G',
    wifi: false,
    battery: 63,
    showLocation: false,
  },
  profile: {
    name: 'Kitty 🐱',
    phone: '',
    avatar: null,
  },
  messages: [
    { id: '1', type: 'message', sender: 'them', text: 'Good night.' },
    { id: '2', type: 'message', sender: 'me', text: 'the international space station called' },
    { id: '3', type: 'message', sender: 'me', text: 'they said they could see ur ears from orbit' },
    { id: '4', type: 'message', sender: 'them', text: 'I am turning off my phone.' },
    { id: '5', type: 'message', sender: 'me', text: 'they were so pink NASA reclassified them as a weather event' },
    { id: '6', type: 'message', sender: 'them', text: 'Blocked.' },
    { id: '7', type: 'time', text: '23:20' },
    { id: '8', type: 'message', sender: 'them', text: "The hesitation also appears in your pit-exit acceleration. You're rolling on throttle instead of snapping. Your clutch release used to be 0.3 seconds. It's 0.45 now. Fix that too." },
    { id: '9', type: 'time', text: '23:25' },
    { id: '10', type: 'message', sender: 'them', text: 'Me too.' },
  ],
  deliveryStatus: 'none',
  readTime: '',
  inputBarText: '',
  showSpamWarning: false,
};

export function createInitialState() {
  return structuredClone(initialState);
}
