import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SPOTIFY_CONFIG } from '../config/spotify';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Exchange the code for an access token
      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: SPOTIFY_CONFIG.redirectUri,
        client_id: SPOTIFY_CONFIG.clientId,
        client_secret: SPOTIFY_CONFIG.clientSecret,
      });

      fetch(SPOTIFY_CONFIG.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
      })
        .then(response => response.json())
        .then(data => {
          // Store the tokens
          localStorage.setItem('spotify_access_token', data.access_token);
          localStorage.setItem('spotify_refresh_token', data.refresh_token);
          // Redirect to the dashboard
          navigate('/dashboard');
        })
        .catch(error => {
          console.error('Error:', error);
          navigate('/');
        });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-lyra-primary text-lyra-text flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-lyra-highlight mx-auto mb-4"></div>
        <p className="text-xl">Giriş yapılıyor...</p>
      </div>
    </div>
  );
}

export default Callback;
