'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { OctagonAlert } from 'lucide-react';

import TextWithLineBreaks from '@/components/ui/text-with-line-breaks';
import { framerMotion, slideFromBottom } from '@/styles/motion-variants';

const AboutPage = () => {
  const t = useTranslations();

  return (
    <motion.div initial="hidden" animate="visible" variants={framerMotion} className="p-5">
      {/* HEADER */}
      <div className="mb-5 flex flex-col flex-wrap items-center justify-center gap-5">
        <h1 className="text-center text-2xl md:text-3xl lg:text-4xl">{t('welcome')}</h1>
        <div className="flex flex-col items-center justify-center gap-5 xs:flex-row">
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
          id="navigation-buttons"
          className={clsx(
            'flex w-[100%] flex-col flex-wrap content-center items-center justify-center gap-10 p-2 align-middle'
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
                  className="my-6 text-center text-lg text-c42green transition-all duration-300 ease-in-out hover:text-c42orange"
                >
                  {t('disclamer-curriculum')}
                </a>
              </p>
              <p className="text-center text-xl font-normal">
                <a
                  href={`https://github.com/jesuisstan/hypertube-video-library`}
                  target="_blank"
                  className="my-6 text-center text-lg text-c42green transition-all duration-300 ease-in-out hover:text-c42orange"
                >
                  {t('disclamer-no-commercial')}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* POWERED BY */}
        <div
          id="powered-by"
          className={clsx(
            'flex w-[100%] flex-col content-center items-center justify-center gap-10 rounded-2xl bg-card p-5 align-middle shadow-md shadow-primary/20'
          )}
        >
          <h2 className="text-center text-xl md:text-2xl lg:text-2xl">{t('powered-by')}</h2>
          <motion.div
            variants={slideFromBottom}
            id="logos-group"
            className="flex flex-row flex-wrap justify-center gap-14"
          >
            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-html.png"
                blurDataURL={'/powered-by/logo-html.png'}
                alt="html"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`h-auto w-16 smooth42transition hover:scale-125`)}
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
                className={clsx(`h-auto w-16 smooth42transition hover:scale-125`)}
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
                className={clsx(`h-auto w-16 smooth42transition hover:scale-125`)}
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
                className={clsx(`h-auto w-16 smooth42transition hover:scale-125`)}
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
                className={clsx(`h-auto w-16 smooth42transition hover:scale-125`)}
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
                className={clsx(`h-auto w-16 smooth42transition hover:scale-125`)}
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
                className={clsx(`h-auto w-16 smooth42transition hover:scale-125`)}
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
                className={clsx(`h-auto w-16 smooth42transition hover:scale-125`)}
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
                className={clsx(`h-auto w-16 smooth42transition hover:scale-125`)}
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
                className={clsx(`h-auto w-16 smooth42transition hover:scale-125`)}
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
                className={clsx(`h-auto w-16 smooth42transition hover:scale-125`)}
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
                className={clsx(`h-auto w-16 smooth42transition hover:scale-125`)}
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
                className={clsx(`h-auto w-16 smooth42transition hover:scale-125`)}
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
                className={clsx(`h-auto w-16 smooth42transition hover:scale-125`)}
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
                className={clsx(`h-auto w-16 smooth42transition hover:scale-125`)}
                placeholder="blur"
                priority
              />
              <p>Vercel Blob</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutPage;
