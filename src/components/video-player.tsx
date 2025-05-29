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
      </div>
    </DialogBasic>
  );
};

export default VideoPlayer;
