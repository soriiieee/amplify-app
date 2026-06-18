import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SetupPage from './pages/SetupPage';
import PersonaRefinePage from './pages/PersonaRefinePage';
import BattlePage from './pages/BattlePage';
import MetsuPage from './pages/MetsuPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><SetupPage /></ProtectedRoute>} />
        <Route path="/refine" element={<ProtectedRoute><PersonaRefinePage /></ProtectedRoute>} />
        <Route path="/battle" element={<ProtectedRoute><BattlePage /></ProtectedRoute>} />
        <Route path="/metsu" element={<ProtectedRoute><MetsuPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
