export const SPOTIFY_CONFIG = {
  clientId: '8a37b5b402e94e2db831d4827ce04a86',
  clientSecret: 'dbd8169dc96742fbb5c7a0821b3f2691',
  redirectUri: 'https://lyramusic.vercel.app/callback',
  authEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
  scopes: [
    'user-read-private',
    'user-read-email',
    'user-modify-playback-state',
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-library-read',
    'user-library-modify',
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
    'streaming'
  ].join(' ')
};