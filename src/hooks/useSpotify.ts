import { useState, useEffect } from 'react';

interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  album: {
    images: { url: string }[];
  };
  artists: { name: string }[];
}

interface SpotifyPlayer {
  device_id: string;
  togglePlay: () => void;
  previousTrack: () => void;
  nextTrack: () => void;
  setVolume: (volume: number) => void;
  playTrack: (uri: string) => void;
}

export function useSpotify() {
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [deviceId, setDeviceId] = useState<string>('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Lyra Music Web Player',
        getOAuthToken: cb => {
          cb(localStorage.getItem('spotify_access_token') || '');
        },
        volume: 0.5
      });

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
        
        // Set this device as the active playback device
        const token = localStorage.getItem('spotify_access_token');
        fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device_ids: [device_id],
            play: false,
          }),
        });

        setPlayer({
          device_id,
          togglePlay: () => {
            spotifyPlayer.togglePlay();
          },
          previousTrack: () => {
            spotifyPlayer.previousTrack();
          },
          nextTrack: () => {
            spotifyPlayer.nextTrack();
          },
          setVolume: (volume: number) => {
            spotifyPlayer.setVolume(volume);
          },
          playTrack: async (uri: string) => {
            const token = localStorage.getItem('spotify_access_token');
            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                uris: [uri],
              }),
            });
          }
        });
      });

      spotifyPlayer.addListener('player_state_changed', state => {
        if (!state) return;
        
        setCurrentTrack(state.track_window.current_track);
        setIsPlaying(!state.paused);
      });

      spotifyPlayer.connect();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return { player, currentTrack, isPlaying, deviceId };
          }
