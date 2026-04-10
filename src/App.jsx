import { AppProvider } from './context';
import Editor from './components/Editor';
import Preview from './components/Preview';

export default function App() {
  return (
    <AppProvider>
      <div className="app">
        <Editor />
        <Preview />
      </div>
    </AppProvider>
  );
}
