'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { RefreshCw } from 'lucide-react';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import Spinner from '@/components/ui/spinner';
import useUserStore from '@/stores/user';
import { TMovieBasics } from '@/types/movies';

const MovieComments = ({ movieData }: { movieData: TMovieBasics | null }) => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]); // Replace 'any' with the appropriate type for comments

  return !movieData ? null : (
    <div className="mx-auto w-full max-w-screen-2xl px-4">
      <div className="bg-card shadow-primary/20 w-full rounded-md border p-4 shadow-xs">
        <div className="mb-4 flex items-center gap-2 align-middle">
          <h3 className="text-xl font-semibold">{t('comments')}</h3>
          <ButtonCustom
            variant="ghost"
            size="icon"
            title={t('refresh')}
            onClick={() => {}}
            disabled={loading}
            className="smooth42transition hover:text-c42orange hover:bg-transparent"
          >
            <RefreshCw className={loading ? 'h-5 w-5 animate-spin' : 'h-5 w-5'} />
          </ButtonCustom>
        </div>

        {!loading && comments.length === 0 && (
          <p className="text-muted-foreground mt-4 text-center text-sm">
            {t('no-comments-available')}
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieComments;
