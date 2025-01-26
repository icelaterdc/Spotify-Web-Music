import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music2, Search, Library, Home, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UserProfile {
  display_name: string;
  images: { url: string }[];
}

function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) {
      navigate('/');
      return;
    }

    // Fetch user profile
    fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Token expired');
        }
        return response.json();
      })
      .then(data => setProfile(data))
      .catch(() => {
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_refresh_token');
        navigate('/');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    navigate('/');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-lyra-primary text-lyra-text flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-lyra-highlight"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lyra-primary text-lyra-text flex">
      {/* Sidebar */}
      <div className="w-64 bg-lyra-secondary p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <Music2 size={32} className="text-lyra-highlight" />
          <h1 className="text-2xl font-bold">Lyra Music</h1>
        </div>

        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <button className="flex items-center gap-3 text-lyra-text-dim hover:text-lyra-text transition-colors w-full">
                <Home size={20} />
                {t('home')}
              </button>
            </li>
            <li>
              <button className="flex items-center gap-3 text-lyra-text-dim hover:text-lyra-text transition-colors w-full">
                <Search size={20} />
                {t('search')}
              </button>
            </li>
            <li>
              <button className="flex items-center gap-3 text-lyra-text-dim hover:text-lyra-text transition-colors w-full">
                <Library size={20} />
                {t('library')}
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-auto pt-4 border-t border-lyra-accent">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={profile.images?.[0]?.url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop'}
              alt={profile.display_name}
              className="w-10 h-10 rounded-full"
            />
            <span className="font-medium">{profile.display_name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-lyra-text-dim hover:text-lyra-text transition-colors w-full"
          >
            <LogOut size={20} />
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">Hoş Geldin, {profile.display_name}!</h2>
        <p className="text-lyra-text-dim">Müzik keşfetmeye başla...</p>
      </main>
    </div>
  );
}

export default Dashboard;
