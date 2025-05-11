'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { OctagonAlert } from 'lucide-react';
import { Play } from 'lucide-react';

import MovieThumbnail from '@/components/movie-cards/movie-thumbnail';
import EncryptButton from '@/components/ui/buttons/encrypt-button';
import Spinner from '@/components/ui/spinner';
import TextWithLineBreaks from '@/components/ui/text-with-line-breaks';
import { useRouter } from '@/i18n/routing';
import { framerMotion, slideFromBottom } from '@/styles/motion-variants';
import { TMovieBasics } from '@/types/movies';

const AboutPage = () => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const router = useRouter();
  const [moviesTMDB, setMoviesTMDB] = useState<TMovieBasics[]>([]);
  const [loading, setLoading] = React.useState(false);

  const scrapeTMDB = async (reset = false) => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        category: 'discover',
        sort_by: 'popularity.desc',
        include_adult: 'false',
        rating_min: '6',
        rating_max: '10',
        min_votes: '542',
        lang: locale,
        page: '1',
      });

      const response = await fetch(`/api/movies?${queryParams.toString()}`);

      const data = await response.json();
      const results = data?.results;
      const error = data?.error;

      if (results) {
        const newMovies = reset ? results : [...moviesTMDB, ...results];
        const uniqueMovies = Array.from(
          new Set(newMovies.map((movie: TMovieBasics) => movie.id))
        ).map((id) => newMovies.find((movie: TMovieBasics) => movie.id === id));
        setMoviesTMDB(uniqueMovies);
      }
      if (error) {
        console.error('Error fetching movies:', error);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Scrape TMDB on page load, when the category changes or when the page changes
  useEffect(() => {
    setMoviesTMDB([]);
    scrapeTMDB(true);
  }, [locale]);

  return (
    <motion.div initial="hidden" animate="visible" variants={framerMotion} className="p-5">
      {/* HEADER */}
      <div className="mb-5 flex flex-col flex-wrap items-center justify-center gap-5">
        <h1 className="text-center text-2xl md:text-3xl lg:text-4xl">{t('welcome')}</h1>
        <div className="xs:flex-row flex flex-col items-center justify-center gap-5">
          <Image
            src="/identity/logo-square.png"
            blurDataURL={'/identity/logo-square.png'}
            alt="hypertube-logo"
            width={0}
            height={0}
            sizes="100vw"
            className={clsx(`h-10 w-auto`)}
            placeholder="blur"
            priority
          />
          <Image
            src="/identity/logo-title-only.png"
            blurDataURL={'/identity/logo-title-only.png'}
            alt="hypertube-logo"
            width={0}
            height={0}
            sizes="100vw"
            className={clsx(`h-auto w-80 min-w-52`)}
            placeholder="blur"
            priority
          />
        </div>
      </div>

      <div className={clsx('flex w-[100%] flex-col content-center items-center gap-5')}>
        {/* DESCRIPTION */}
        <div
          id="description"
          className={clsx(
            'flex w-[100%] flex-col flex-wrap content-center items-center justify-center gap-5 p-2 align-middle'
          )}
        >
          <p className="text-center text-xl font-normal">
            <TextWithLineBreaks text={t('about-description')} />
          </p>
          <div className="flex flex-col items-center justify-center gap-1 align-middle">
            <div>
              <OctagonAlert size={42} className="text-destructive" />
            </div>
            <div className="flex flex-col items-center text-center">
              <p className="text-center text-xl font-normal">
                <a
                  href={`https://42.fr/en/the-program/software-engineer-degree/`}
                  target="_blank"
                  className="text-positive hover:text-c42orange my-6 text-center text-lg transition-all duration-300 ease-in-out"
                >
                  {t('disclamer-curriculum')}
                </a>
              </p>
              <p className="text-center text-xl font-normal">
                <a
                  href={`https://github.com/jesuisstan/hypertube-video-library`}
                  target="_blank"
                  className="text-positive hover:text-c42orange my-6 text-center text-lg transition-all duration-300 ease-in-out"
                >
                  {t('disclamer-no-commercial')}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* POWERED BY */}
        <motion.div
          variants={slideFromBottom}
          id="powered-by"
          className={clsx(
            'bg-card shadow-primary/20 flex w-[100%] flex-col content-center items-center justify-center gap-10 rounded-md p-5 align-middle shadow-md'
          )}
        >
          <h2 className="text-center text-xl md:text-2xl lg:text-2xl">{t('powered-by')}</h2>
          <div id="logos-group" className="flex flex-row flex-wrap justify-center gap-14">
            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-html.png"
                blurDataURL={'/powered-by/logo-html.png'}
                alt="html"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`smooth42transition h-auto w-16 hover:scale-125`)}
                placeholder="blur"
                priority
              />
              <p>HTML</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-css.png"
                blurDataURL={'/powered-by/logo-css.png'}
                alt="css"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`smooth42transition h-auto w-16 hover:scale-125`)}
                placeholder="blur"
                priority
              />
              <p>CSS</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-js.png"
                blurDataURL={'/powered-by/logo-js.png'}
                alt="js"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`smooth42transition h-auto w-16 hover:scale-125`)}
                placeholder="blur"
                priority
              />
              <p>Javascript</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-ts.png"
                blurDataURL={'/powered-by/logo-ts.png'}
                alt="ts"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`smooth42transition h-auto w-16 hover:scale-125`)}
                placeholder="blur"
                priority
              />
              <p>Typescript</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-react.png"
                blurDataURL={'/powered-by/logo-react.png'}
                alt="react"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`smooth42transition h-auto w-16 hover:scale-125`)}
                placeholder="blur"
                priority
              />
              <p>React</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-nextjs.png"
                blurDataURL={'/powered-by/logo-nextjs.png'}
                alt="nextjs"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`smooth42transition h-auto w-16 hover:scale-125`)}
                placeholder="blur"
                priority
              />
              <p>NextJS</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-tailwindcss.png"
                blurDataURL={'/powered-by/logo-tailwindcss.png'}
                alt="tailwindcss"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`smooth42transition h-auto w-16 hover:scale-125`)}
                placeholder="blur"
                priority
              />
              <p>TailwindCSS</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="https://lucide.dev/logo.light.svg"
                blurDataURL={'https://lucide.dev/logo.light.svg'}
                alt="lucide"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`smooth42transition h-auto w-16 hover:scale-125`)}
                placeholder="blur"
                priority
              />
              <p>Lucide</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-next-auth.png"
                blurDataURL={'/powered-by/logo-next-auth.png'}
                alt="next-auth"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`smooth42transition h-auto w-16 hover:scale-125`)}
                placeholder="blur"
                priority
              />
              <p>NextAuth</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-oauth.svg"
                blurDataURL={'/powered-by/logo-oauth.svg'}
                alt="oauth"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`smooth42transition h-auto w-16 hover:scale-125`)}
                placeholder="blur"
                priority
              />
              <p>OAuth</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-jwt.svg"
                blurDataURL={'/powered-by/logo-jwt.svg'}
                alt="jwt"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`smooth42transition h-auto w-16 hover:scale-125`)}
                placeholder="blur"
                priority
              />
              <p>JWT</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-next-intl.png"
                blurDataURL={'/powered-by/logo-next-intl.png'}
                alt="next-intl"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`smooth42transition h-auto w-16 hover:scale-125`)}
                placeholder="blur"
                priority
              />
              <p>Next-intl</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-vercel.svg"
                blurDataURL={'/powered-by/logo-vercel.svg'}
                alt="vercel"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`smooth42transition h-auto w-16 hover:scale-125`)}
                placeholder="blur"
                priority
              />
              <p>Vercel</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-vercel-postgresql.svg"
                blurDataURL={'/powered-by/logo-vercel-postgresql.svg'}
                alt="vercel-postgresql"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`smooth42transition h-auto w-16 hover:scale-125`)}
                placeholder="blur"
                priority
              />
              <p>Vercel PostgreSQL</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-vercel-blob.svg"
                blurDataURL={'/powered-by/logo-vercel-blob.svg'}
                alt="vercel-blob"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`smooth42transition h-auto w-16 hover:scale-125`)}
                placeholder="blur"
                priority
              />
              <p>Vercel Blob</p>
            </div>
          </div>
        </motion.div>

        {/* Movies sector */}
        <div className="w-full">
          <motion.div variants={slideFromBottom} className="flex justify-center self-center">
            {moviesTMDB.length > 0 && (
              <h2 className="mb-5 text-center text-xl md:text-2xl lg:text-2xl">
                {t('popular-now')}
              </h2>
            )}
          </motion.div>

          <div
            key="moviesTMDB"
            className="smooth42transition flex flex-wrap items-center justify-center gap-5 align-middle"
          >
            {moviesTMDB?.map((movie, index) => (
              <motion.div
                variants={slideFromBottom}
                key={`${movie.id}-${index}`}
                className="flex justify-center self-center"
              >
                <MovieThumbnail movieBasics={movie} loading={false} />
              </motion.div>
            ))}
          </div>

          {loading && (
            <div className="m-5 flex flex-col items-center gap-5">
              <Spinner size={21} />
              <p className="animate-pulse text-base leading-[19px] font-normal">{t(`loading`)}</p>
            </div>
          )}
        </div>
        {/* BUTTON to BROWSE PAGE */}
        <div className="pt-3">
          <EncryptButton
            text={t('dive-into')}
            onClick={() => {
              router.push('/browse');
            }}
            Icon={<Play />}
          ></EncryptButton>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutPage;
