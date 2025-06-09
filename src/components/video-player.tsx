import { FC, useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';

import DialogBasic from './dialogs-custom/dialog-basic';

import useUserStore from '@/stores/user';
import { TTorrentDataYTS, TUnifiedMagnetData } from '@/types/torrent-magnet-data';
import { getLanguageName } from '@/utils/language';

interface VideoPlayerProps {
  onClose: () => void;
  title: string;
  stream: TTorrentDataYTS | TUnifiedMagnetData | null;
  subtitleList: Record<string, string> | null;
}

const VideoPlayer: FC<VideoPlayerProps> = ({ onClose, stream, title, subtitleList }) => {
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const user = useUserStore((state) => state.user);
  const preferred_language = user?.preferred_language;

  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!stream) return;

    const timer = setTimeout(() => {
      const videoPlayer = videoRef.current;

      if (!videoPlayer) return;

      videoPlayer.querySelectorAll('track').forEach((t) => t.remove());
      Object.entries(subtitleList ?? {}).forEach(([langCode, path], i) => {
        const trackEl = document.createElement('track');
        trackEl.kind = 'subtitles';
        trackEl.label = getLanguageName(langCode, locale);
        trackEl.srclang = langCode;
        trackEl.src = `${window.location.origin}/${path}`;
        trackEl.default = preferred_language === langCode;
        videoPlayer.appendChild(trackEl);
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [stream, subtitleList, locale, preferred_language]);

  const handlePlaybackError = () => {
    setError('Playback failed. The file may be corrupted or incomplete.');
  };

  return (
    <DialogBasic isOpen={!!stream} title={title} setIsOpen={onClose} wide>
      <div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <video ref={videoRef} controls onError={handlePlaybackError} src={'/api/mock-stream'}>
          Your browser does not support the video tag.
        </video>
      </div>
    </DialogBasic>
  );
};

export default VideoPlayer;
