import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Music2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SPOTIFY_CONFIG } from './config/spotify';
import Callback from './components/Callback';

function Login() {
  const { t } = useTranslation();

  const handleLogin = () => {
    const { clientId, redirectUri, authEndpoint, scopes } = SPOTIFY_CONFIG;
    const url = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code`;
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-lyra-primary text-lyra-text">
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="flex items-center gap-4 mb-8">
          <Music2 size={48} className="text-lyra-highlight" />
          <h1 className="text-4xl font-bold">Lyra Music</h1>
        </div>
        
        <h2 className="text-2xl mb-8">{t('welcome')}</h2>
        
        <button
          onClick={handleLogin}
          className="bg-lyra-highlight hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 flex items-center gap-2"
        >
          {t('login')}
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;
