import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music2, Search, Library, Home, LogOut, Disc3, PlayCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MusicPlayer } from './MusicPlayer';
import { useSpotify } from '../hooks/useSpotify';

interface UserProfile {
  display_name: string;
  images: { url: string }[];
}

interface PlaylistItem {
  id: string;
  name: string;
  images: { url: string }[];
  uri: string;
}

interface Track {
  id: string;
  name: string;
  uri: string;
  album: {
    images: { url: string }[];
  };
  artists: { name: string }[];
}

function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [recentTracks, setRecentTracks] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('home');
  const [selectedPlaylist, setSelectedPlaylist] = useState<{ id: string; tracks: Track[] } | null>(null);
  
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { player } = useSpotify();
  
  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) {
      navigate('/');
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    // Fetch initial data
    Promise.all([
      fetch('https://api.spotify.com/v1/me', { headers }),
      fetch('https://api.spotify.com/v1/me/playlists', { headers }),
      fetch('https://api.spotify.com/v1/me/player/recently-played', { headers })
    ])
      .then(([profileRes, playlistsRes, recentRes]) => 
        Promise.all([profileRes.json(), playlistsRes.json(), recentRes.json()])
      )
      .then(([profileData, playlistsData, recentData]) => {
        setProfile(profileData);
        setPlaylists(playlistsData.items);
        setRecentTracks(recentData.items);
      })
      .catch(() => {
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_refresh_token');
        navigate('/');
      });
  }, [navigate]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const token = localStorage.getItem('spotify_access_token');
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=20`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      setSearchResults(data.tracks.items);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const loadPlaylistTracks = async (playlistId: string) => {
    const token = localStorage.getItem('spotify_access_token');
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      setSelectedPlaylist({ id: playlistId, tracks: data.items.map((item: any) => item.track) });
    } catch (error) {
      console.error('Error loading playlist:', error);
    }
  };

  const playTrack = (uri: string) => {
    player?.playTrack(uri);
  };

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

  const renderContent = () => {
    switch (activeView) {
      case 'search':
        return (
          <div>
            <div className="mb-6">
              <div className="flex gap-4 max-w-xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Şarkı ara..."
                  className="flex-1 px-4 py-2 rounded-lg bg-lyra-secondary text-lyra-text border border-lyra-accent focus:outline-none focus:border-lyra-highlight"
                />
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-lyra-highlight rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Ara
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
{searchResults.map(track => (
                <div
                  key={track.id}
                  className="bg-lyra-secondary p-4 rounded-lg hover:bg-lyra-accent transition-colors group cursor-pointer"
                  onClick={() => playTrack(track.uri)}
                >
                  <div className="relative">
                    <img
                      src={track.album.images[0].url}
                      alt={track.name}
                      className="w-full aspect-square object-cover rounded-md mb-3"
                    />
                    <button className="absolute bottom-2 right-2 text-lyra-highlight opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle size={40} />
                    </button>
                  </div>
                  <h4 className="font-medium truncate">{track.name}</h4>
                  <p className="text-sm text-lyra-text-dim truncate">
                    {track.artists[0].name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'playlist':
        return selectedPlaylist ? (
          <div>
            <h3 className="text-2xl font-bold mb-6">
              {playlists.find(p => p.id === selectedPlaylist.id)?.name}
            </h3>
            <div className="space-y-2">
              {selectedPlaylist.tracks.map(track => (
                <div
                  key={track.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-lyra-secondary cursor-pointer group"
                  onClick={() => playTrack(track.uri)}
                >
                  <img
                    src={track.album.images[0].url}
                    alt={track.name}
                    className="w-12 h-12 rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{track.name}</h4>
                    <p className="text-sm text-lyra-text-dim">{track.artists[0].name}</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle size={24} className="text-lyra-highlight" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return (
          <>
            <section className="mb-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Disc3 className="text-lyra-highlight" />
                Son Çalınanlar
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {recentTracks.slice(0, 10).map((item, index) => (
                  <div
                    key={index}
                    className="bg-lyra-secondary p-4 rounded-lg hover:bg-lyra-accent transition-colors cursor-pointer group"
                    onClick={() => playTrack(item.track.uri)}
                  >
                    <div className="relative">
                      <img
                        src={item.track.album.images[0].url}
                        alt={item.track.name}
                        className="w-full aspect-square object-cover rounded-md mb-3"
                      />
                      <button className="absolute bottom-2 right-2 text-lyra-highlight opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle size={40} />
                      </button>
                    </div>
                    <h4 className="font-medium truncate">{item.track.name}</h4>
                    <p className="text-sm text-lyra-text-dim truncate">
                      {item.track.artists[0].name}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Library className="text-lyra-highlight" />
                Çalma Listelerin
                  <h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {playlists.map(playlist => (
                  <div
                    key={playlist.id}
                    className="bg-lyra-secondary p-4 rounded-lg hover:bg-lyra-accent transition-colors cursor-pointer group"
                    onClick={() => {
                      loadPlaylistTracks(playlist.id);
                      setActiveView('playlist');
                    }}
                  >
                    <div className="relative">
                      <img
                        src={playlist.images[0]?.url || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop'}
                        alt={playlist.name}
                        className="w-full aspect-square object-cover rounded-md mb-3"
                      />
                      <button className="absolute bottom-2 right-2 text-lyra-highlight opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle size={40} />
                      </button>
                    </div>
                    <h4 className="font-medium truncate">{playlist.name}</h4>
                  </div>
                ))}
              </div>
            </section>
          </>
        );
    }
  };

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
              <button
                onClick={() => setActiveView('home')}
                className={`flex items-center gap-3 w-full transition-colors ${
                  activeView === 'home' ? 'text-lyra-highlight' : 'text-lyra-text-dim hover:text-lyra-text'
                }`}
              >
                <Home size={20} />
                {t('home')}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('search')}
                className={`flex items-center gap-3 w-full transition-colors ${
                  activeView === 'search' ? 'text-lyra-highlight' : 'text-lyra-text-dim hover:text-lyra-text'
                }`}
              >
                <Search size={20} />
                {t('search')}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('library')}
                className={`flex items-center gap-3 w-full transition-colors ${
                  activeView === 'library' ? 'text-lyra-highlight' : 'text-lyra-text-dim hover:text-lyra-text'
                }`}
              >
                <Library size={20} />
                {t('library')}
              </button>
            </li>
          </ul>

          <div className="mt-8">
            <h2 className="text-sm font-semibold text-lyra-text-dim uppercase tracking-wider mb-4">
              {t('playlists')}
            </h2>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {playlists.map(playlist => (
                <li key={playlist.id}>
                  <button
                    onClick={() => {
                      loadPlaylistTracks(playlist.id);
                      setActiveView('playlist');
                    }}
                    className="text-lyra-text-dim hover:text-lyra-text transition-colors w-full text-left truncate py-1"
                  >
                    {playlist.name}
                    </button>
                </li>
              ))}
            </ul>
          </div>
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
      <main className="flex-1 p-8 pb-32 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-8">
          {activeView === 'home' && `Hoş Geldin, ${profile.display_name}!`}
          {activeView === 'search' && 'Müzik Ara'}
          {activeView === 'library' && 'Kütüphanen'}
        </h2>

        {renderContent()}
      </main>

      <MusicPlayer />
    </div>
  );
}

export default Dashboard;
