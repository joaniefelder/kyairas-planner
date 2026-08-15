import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppDataProvider } from './hooks/AppDataContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Calendar } from './pages/Calendar';
import { Todo } from './pages/Todo';
import { Classes } from './pages/Classes';
import { ClassDetail } from './pages/ClassDetail';
import { Deadlines } from './pages/Deadlines';
import { Notes } from './pages/Notes';
import { BibleVerse } from './pages/BibleVerse';
import { Settings } from './pages/Settings';

function App() {
  return (
    <AppDataProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/todo" element={<Todo />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/classes/:id" element={<ClassDetail />} />
            <Route path="/deadlines" element={<Deadlines />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/verse" element={<BibleVerse />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppDataProvider>
  );
}

export default App;
