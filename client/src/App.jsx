import React, { useState } from 'react';
import './App.css';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleShortenUrl = async () => {
    const response = await fetch('http://localhost:3001/api/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ originalUrl }),
    });

    const data = await response.json();
    setShortUrl(data.shortUrl);
  };

  return (
    <div>
      <nav className='bg-indigo-600 w-full h-20 text-white flex justify-center shadow-md'>
      <h1 className='text-center p-5 text-2xl'>URL Shortener</h1>
      </nav>
      <div className='flex justify-center pt-20'>
        <div className='flex gap-2'>
          <input
            type="text"
            placeholder="Enter URL"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className='border border-indigo-600 rounded-full px-2 text-zinc-500'
          />
          <button onClick={handleShortenUrl} className='bg-indigo-600 px-5 rounded-full text-white hover:text-indigo-600 hover:border hover:border-indigo-600 hover:bg-white transition'>Shorten URL</button>
        </div>
      </div>

      {shortUrl && (
        <div className='flex justify-center pt-10'>
          <div className='rounded-xl p-5 shadow-md'>
            <p>Shortened URL:</p>
            <a href={`http://localhost:3001/${shortUrl}`} target="_blank" rel="noopener noreferrer">
              {`http://localhost:3001/${shortUrl}`}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;