//'use client';

//import React, { useState } from 'react';

//export default function VideoPlayer({ hash }: { hash: string }) {
//  const videoSrc = `/api/torrent?hash=${hash}`;

//  return (
//    <div>
//      <video
//        src={videoSrc}
//        controls
//        width="800"
//      >
//        Your browser does not support the video tag.
//      </video>
//    </div>
//  );
//}

import React, { useState } from 'react';

const VideoPlayer: React.FC<{ videoUrl: string }> = ({ videoUrl }) => {
  const [error, setError] = useState<string | null>(null);

  const handlePlaybackError = () => {
    setError('Playback failed. The file may be corrupted or incomplete.');
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <video
        controls
        width="600"
        onError={handlePlaybackError}
        src={videoUrl}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
