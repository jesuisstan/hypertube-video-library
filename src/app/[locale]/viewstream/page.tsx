'use client';

import { useState } from 'react';

export default function WatchPage() {
  const [url, setUrl] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/process-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (data.videoLink) {
        setVideoLink(data.videoLink);
        setResponse('Video loaded!');
      } else {
        setResponse(data.message || 'No video found.');
      }
    } catch (err) {
      setResponse('Error processing the URL.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <h1>Watch</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="url">Enter URL:</label>
        <input
          id="url"
          name="url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: '100%', marginBottom: 16 }}
          required
        />
        <button type="submit">Submit</button>
      </form>

      {response && <p>{response}</p>}

      {videoLink && (
        <video src={videoLink} controls autoPlay style={{ width: '100%', marginTop: 24 }}>
          Sorry, your browser doesn&apos;t support embedded videos.
        </video>
      )}
    </div>
  );
}
