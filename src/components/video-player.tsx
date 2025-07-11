import { FC, useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import DialogBasic from './dialogs-custom/dialog-basic';

import useUserStore from '@/stores/user';
import { TMovieBasics } from '@/types/movies';
import { TTorrentDataYTS, TUnifiedMagnetData } from '@/types/torrent-magnet-data';
import { getLanguageName } from '@/utils/language';

interface VideoPlayerProps {
  onClose: () => void;
  movieData: TMovieBasics;
  stream: TTorrentDataYTS | TUnifiedMagnetData | null;
  subtitleList: Record<string, string> | null;
}

const VideoPlayer: FC<VideoPlayerProps> = ({ onClose, stream, movieData, subtitleList }) => {
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const t = useTranslations();
  const user = useUserStore((state) => state.user);
  const preferred_language = user?.preferred_language;

  const [error, setError] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!stream) return;

    const timer = setTimeout(() => {
      const videoPlayer = videoRef.current;

      if (!videoPlayer || !streamUrl) return;
      videoPlayer.querySelectorAll('track').forEach((t) => t.remove());
      Object.entries(subtitleList ?? {}).forEach(([langCode, path]) => {
        const trackEl = document.createElement('track');
        trackEl.kind = 'subtitles';
        trackEl.label = getLanguageName(langCode, locale);
        trackEl.srclang = langCode;
        trackEl.src = `/api/subtitles?path=${path}`;
        //trackEl.src = `${window.location.origin}/${path}`;
        trackEl.default =
          preferred_language !== movieData.original_language && preferred_language === langCode;
        videoPlayer.appendChild(trackEl);
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [movieData, stream, subtitleList, streamUrl, locale, preferred_language]);

  const handlePlaybackError = () => {
    setError(t('playback-failed'));
  };

  useEffect(() => {
    setError(null);
    setStreamUrl(null);

    if (!stream) return;

    const fetchStream = async () => {
      setIsLoading(true);
      try {
        const url = await getStreamURL(stream, movieData.id);
        if (url) {
          setStreamUrl(url);
        } else {
          setError(t('stream-is-unavailable'));
        }
      } catch (e) {
        console.error(e);
        setError(t('stream-is-unavailable'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStream();
  }, [stream, movieData.id]);

  return (
    <DialogBasic
      isOpen={!!stream}
      title={movieData.title}
      setIsOpen={() => {
        videoRef?.current?.play().catch((err) => {
          if (err.name === 'AbortError' || err.message.includes('aborted by the user agent')) {
          }
        });
        onClose();
      }}
      wide
    >
      <div className="w-full">
        {error ? (
          <div className="text-destructive mb-4 rounded-md bg-red-100 p-3">{error}</div>
        ) : isLoading ? (
          <div className="flex h-64 w-full items-center justify-center">
            <div className="border-primary h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
            <span className="ml-3">{t('loading')}</span>
          </div>
        ) : (
          <video
            ref={videoRef}
            className="max-h-[70vh] w-full"
            controls
            onError={handlePlaybackError}
            src={streamUrl || undefined}
          >
            {t('browser-does-not-support-the-video-tag')}
          </video>
        )}
      </div>
    </DialogBasic>
  );

  async function getStreamURL(
    streamData: TTorrentDataYTS | TUnifiedMagnetData | null,
    movieId: number
  ): Promise<string | null> {
    if (!streamData) return null;

    try {
      const response = await fetch('/api/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: streamData,
          movieId: movieId,
        }),
      });

      if (!response.ok) {
        throw new Error(t('stream-request-failed'));
      }

      const data = await response.json();

      if (!data || !data.streamUrl) {
        throw new Error(t('stream-url-fetch-error'));
      }

      return `/api/stream?hash=${data.streamUrl}`;
    } catch (error) {
      console.error(
        'Stream URL fetch error:',
        error instanceof Error ? error.message : 'Unknown error'
      );
      return null;
    }
  }
};

export default VideoPlayer;
