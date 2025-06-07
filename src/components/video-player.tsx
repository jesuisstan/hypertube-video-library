import React, { useState } from 'react';

import DialogBasic from './dialogs-custom/dialog-basic';

import { TMagnetDataPirateBay } from '@/types/torrent-magnet-data';
import { TTorrentDataYTS } from '@/types/torrent-magnet-data';

interface VideoPlayerProps {
  onClose: () => void;
  title: string;
  stream: TTorrentDataYTS | TMagnetDataPirateBay | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ onClose, stream, title }) => {
  const [error, setError] = useState<string | null>(null);

  const handlePlaybackError = () => {
    setError('Playback failed. The file may be corrupted or incomplete.');
  };

  return (
    <DialogBasic isOpen={!!stream} title={title} setIsOpen={onClose} wide>
      <div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <video controls onError={handlePlaybackError} src={'/api/mock-stream'}>
          Your browser does not support the video tag.
        </video>
        <button
          onClick={() => {
            console.log('click');

            fetch('/api/video-info')
              .then((res) => res.json())
              .then(console.log);
          }}
        >
          get info
        </button>
      </div>
    </DialogBasic>
  );
};

export default VideoPlayer;
