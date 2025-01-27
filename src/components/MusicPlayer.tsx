import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useSpotify } from '../hooks/useSpotify';

export function MusicPlayer() {
  const { player, currentTrack, isPlaying } = useSpotify();
  const [volume, setVolume] = useState(50);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    player?.setVolume(newVolume / 100);
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-lyra-secondary border-t border-lyra-accent p-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={currentTrack.album.images[0].url}
            alt={currentTrack.name}
            className="w-14 h-14 rounded"
          />
          <div>
            <h4 className="font-medium text-lyra-text">{currentTrack.name}</h4>
            <p className="text-sm text-lyra-text-dim">{currentTrack.artists[0].name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => player?.previousTrack()}
            className="text-lyra-text-dim hover:text-lyra-text transition-colors"
          >
            <SkipBack size={24} />
          </button>

          <button
            onClick={() => player?.togglePlay()}
            className="w-10 h-10 rounded-full bg-lyra-highlight flex items-center justify-center hover:bg-blue-600 transition-colors"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button
            onClick={() => player?.nextTrack()}
            className="text-lyra-text-dim hover:text-lyra-text transition-colors"
          >
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 size={20} className="text-lyra-text-dim" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-2 bg-lyra-accent rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
          }
