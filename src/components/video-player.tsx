import { FC, useState, useEffect } from 'react';
import { useLocale } from 'next-intl';

import DialogBasic from './dialogs-custom/dialog-basic';

import { TTorrentDataYTS, TUnifiedMagnetData } from '@/types/torrent-magnet-data';
import { TMovieBasics } from '@/types/movies';
import { fetchSubtitles, SubInfo } from '@/app/[locale]/(hypertube)/movies/[id]/actions';
import { getLanguageName } from '@/utils/getLanguageName';

interface VideoPlayerProps {
  onClose: () => void;
  movieData: TMovieBasics;
  stream: TTorrentDataYTS | TUnifiedMagnetData | null;
}

const VideoPlayer: FC<VideoPlayerProps> = ({ onClose, stream, movieData }) => {
  const locale = useLocale() as 'en' | 'ru' | 'fr';

  const [error, setError] = useState<string | null>(null);
  const [subtitleList, setSubtitleList] = useState<SubInfo[]>([]);

  useEffect(() => {
    const getSubList = async () =>
      setSubtitleList(movieData.imdb_id ? await fetchSubtitles(movieData.imdb_id) : []);
    getSubList();
  }, [movieData]);

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
        {subtitleList.map((sub) => getLanguageName(sub.langCode, locale))}
      </div>
    </DialogBasic>
  );
};

export default VideoPlayer;
