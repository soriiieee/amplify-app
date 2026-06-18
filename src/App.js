import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SetupPage from './pages/SetupPage';
import PersonaRefinePage from './pages/PersonaRefinePage';
import BattlePage from './pages/BattlePage';
import MetsuPage from './pages/MetsuPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SetupPage />} />
        <Route path="/refine" element={<PersonaRefinePage />} />
        <Route path="/battle" element={<BattlePage />} />
        <Route path="/metsu" element={<MetsuPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
