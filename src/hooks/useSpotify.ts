import { useState, useEffect } from 'react';

interface SpotifyPlayer {
  device_id: string;
  togglePlay: () => void;
  previousTrack: () => void;
  nextTrack: () => void;
  setVolume: (volume: number) => void;
}

export function useSpotify() {
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  return { player, currentTrack, isPlaying };
                                }
