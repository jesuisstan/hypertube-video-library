import { FC, useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';

import DialogBasic from './dialogs-custom/dialog-basic';

import { TTorrentDataYTS, TUnifiedMagnetData } from '@/types/torrent-magnet-data';
import { TMovieBasics } from '@/types/movies';
import { fetchSubtitles } from '@/app/[locale]/(hypertube)/movies/[id]/actions';
import { getLanguageName } from '@/utils/getLanguageName';

interface VideoPlayerProps {
  onClose: () => void;
  movieData: TMovieBasics;
  stream: TTorrentDataYTS | TUnifiedMagnetData | null;
}

const VideoPlayer: FC<VideoPlayerProps> = ({ onClose, stream, movieData }) => {
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const [load, setLoad] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    (async () => {
      if (!movieData.imdb_id) return;
      setLoad(true);
      const subtitleList = await fetchSubtitles(movieData.imdb_id);
      setLoad(false);

      const videoPlayer = videoRef.current;

      if (!videoPlayer) return;

      videoPlayer.querySelectorAll('track').forEach((t) => t.remove());
      -Object.entries(subtitleList).forEach(([langCode, path], i) => {
        const trackEl = document.createElement('track');
        trackEl.kind = 'subtitles';
        trackEl.label = getLanguageName(langCode, locale);
        trackEl.srclang = langCode;
        trackEl.src = `${window.location.origin}/test.vtt`;
        if (i === 0) trackEl.default = true;
        videoPlayer.appendChild(trackEl);
      });
    })();
  }, []);

  const handlePlaybackError = () => {
    setError('Playback failed. The file may be corrupted or incomplete.');
  };

  return (
    <DialogBasic isOpen={!!stream} title={movieData.title} setIsOpen={onClose} wide>
      <div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {load && <p style={{ color: 'red' }}>Loading</p>}
        <video ref={videoRef} controls onError={handlePlaybackError} src={'/api/mock-stream'}>
          Your browser does not support the video tag.
        </video>
      </div>
    </DialogBasic>
  );
};

export default VideoPlayer;
