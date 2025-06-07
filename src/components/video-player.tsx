import { FC, useState, useMemo } from 'react';

import DialogBasic from './dialogs-custom/dialog-basic';

import { TMagnetDataPirateBay } from '@/types/torrent-magnet-data';
import { TTorrentDataYTS } from '@/types/torrent-magnet-data';
import { TMovieBasics } from '@/types/movies';
import { fetchSubtitles } from '@/app/[locale]/(hypertube)/movies/[id]/actions';

interface VideoPlayerProps {
  onClose: () => void;
  movieData: TMovieBasics;
  stream: TTorrentDataYTS | TMagnetDataPirateBay | null;
}

const VideoPlayer: FC<VideoPlayerProps> = ({ onClose, stream, movieData }) => {
  const [error, setError] = useState<string | null>(null);

  const subtitles = useMemo(async () => {
    if (movieData.imdb_id) {
      return await fetchSubtitles(movieData.imdb_id);
    }
  }, []);

  const handlePlaybackError = () => {
    setError('Playback failed. The file may be corrupted or incomplete.');
  };

  return (
    <DialogBasic isOpen={!!stream} title={movieData.title} setIsOpen={onClose} wide>
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
