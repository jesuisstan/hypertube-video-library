'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/carousel/carousel-primitives';
import DrawerCredits from '@/components/drawers-custom/drawer-credits';
import Spinner from '@/components/ui/spinner';
import { TMovieBasics, TMovieCredits } from '@/types/movies';

const MAX_CREDITS_DISPLAY = 13;

const MovieCredits = ({ movieData }: { movieData: TMovieBasics | null }) => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const [loading, setLoading] = useState(false);
  const [creditsData, setCreditsData] = useState<TMovieCredits | null>(null);

  const fetchCredits = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/movies/${movieData?.id}/credits?lang=${locale}`);
      const data: TMovieCredits = await response.json();
      setCreditsData(data);
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cast = creditsData?.cast ?? [];
  const crew = creditsData?.crew ?? [];

  return !movieData ? null : (
    <div className="mx-auto w-full max-w-screen-2xl px-4">
      {/* Cast */}
      <div className="bg-card shadow-primary/20 w-full rounded-md border p-4 shadow-xs">
        <h3 className="mb-4 text-xl font-semibold">{t('top-billed-cast')}</h3>
        <Carousel>
          <CarouselContent>
            {loading
              ? Array.from({ length: MAX_CREDITS_DISPLAY + 1 }).map((_, idx) => (
                  <CarouselItem key={`cast-spinner-${idx}`} className="max-w-[140px]">
                    <div className="flex h-[232px] w-32 flex-col items-center justify-center">
                      <div className="bg-muted flex h-[192px] w-[128px] items-center justify-center rounded-md">
                        <Spinner />
                      </div>
                    </div>
                  </CarouselItem>
                ))
              : cast.slice(0, MAX_CREDITS_DISPLAY).map((actor, index) => (
                  <CarouselItem key={index} className="max-w-[140px]">
                    <div className="flex w-32 flex-col items-center">
                      <div className="bg-muted flex justify-center overflow-hidden rounded-md align-middle">
                        <Image
                          src={
                            actor.profile_path
                              ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                              : '/icons/person.png'
                          }
                          alt={actor.name}
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="h-[192px] w-[128px] rounded-md object-cover"
                          priority
                          placeholder="blur"
                          blurDataURL="/icons/person.png"
                        />
                      </div>
                      <p className="mt-2 text-center text-sm font-semibold">{actor.name}</p>
                      <p className="text-muted-foreground text-center text-xs">{actor.character}</p>
                    </div>
                  </CarouselItem>
                ))}
            {!loading && cast.length > 0 && (
              <CarouselItem
                key="drawer-cast"
                className="flex max-w-[140px] items-center justify-center"
              >
                <DrawerCredits
                  title={movieData?.title ? movieData?.title : ''}
                  description={t('top-billed-cast')}
                  data={cast}
                />
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        {!loading && cast.length === 0 && (
          <p className="text-muted-foreground mt-4 text-center text-sm">{t('no-info-available')}</p>
        )}
      </div>

      {/* Crew */}
      <div className="bg-card shadow-primary/20 mt-4 w-full rounded-md border p-4 shadow-xs">
        <h3 className="mb-4 text-xl font-semibold">{t('crew')}</h3>
        <Carousel>
          <CarouselContent>
            {loading
              ? Array.from({ length: MAX_CREDITS_DISPLAY + 1 }).map((_, idx) => (
                  <CarouselItem key={`crew-spinner-${idx}`} className="max-w-[140px]">
                    <div className="flex h-[232px] w-32 flex-col items-center justify-center">
                      <div className="bg-muted flex h-[192px] w-[128px] items-center justify-center rounded-md">
                        <Spinner />
                      </div>
                    </div>
                  </CarouselItem>
                ))
              : crew.slice(0, MAX_CREDITS_DISPLAY).map((crewMember, index) => (
                  <CarouselItem key={index} className="max-w-[140px]">
                    <div className="flex w-32 flex-col items-center">
                      <div className="bg-muted flex justify-center overflow-hidden rounded-md align-middle">
                        <Image
                          src={
                            crewMember.profile_path
                              ? `https://image.tmdb.org/t/p/w200${crewMember.profile_path}`
                              : '/icons/person.png'
                          }
                          alt={crewMember.name}
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="h-[192px] w-[128px] rounded-md object-cover"
                          priority
                          placeholder="blur"
                          blurDataURL="/icons/person.png"
                        />
                      </div>
                      <p className="mt-2 text-center text-sm font-semibold">{crewMember.name}</p>
                      <p className="text-muted-foreground text-center text-xs">{crewMember.job}</p>
                    </div>
                  </CarouselItem>
                ))}
            {!loading && crew.length > 0 && (
              <CarouselItem
                key="drawer-crew"
                className="flex max-w-[140px] items-center justify-center"
              >
                <DrawerCredits
                  title={movieData?.title ? movieData?.title : ''}
                  description={t('crew')}
                  data={crew}
                />
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        {!loading && crew.length === 0 && (
          <p className="text-muted-foreground mt-4 text-center text-sm">{t('no-info-available')}</p>
        )}
      </div>
    </div>
  );
};

export default MovieCredits;
