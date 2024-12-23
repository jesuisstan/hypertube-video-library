'use client';

import React from 'react';
import Image from 'next/image';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';

const SocialMediaAuth = () => {
  return (
    <div>
      <div className="mb-3 flex flex-row justify-center gap-5">
        <ButtonCustom
          title="Ecole 42"
          variant="default"
          className="w-44 md:w-28"
          onClick={() => {
            window.location.href = '/api/auth/login-42';
          }}
        >
          <div className="flex items-center justify-center rounded-full border border-background/50 bg-c42green p-1">
            <Image
              src="/icons/icon-42.png"
              blurDataURL="/icons/icon-42.png"
              alt="logo"
              width={20}
              height={20}
              placeholder="blur"
              priority
            />
          </div>
        </ButtonCustom>
        <ButtonCustom
          title="Google"
          variant="default"
          className="w-44 md:w-28"
          onClick={() => {
            window.location.href = '/api/auth/login-google';
          }}
        >
          <Image
            src="/icons/icon-google.svg"
            blurDataURL="/icons/icon-google.svg"
            alt="logo"
            width={20}
            height={20}
            placeholder="blur"
            priority
          />
        </ButtonCustom>
        <ButtonCustom
          title="Github"
          variant="default"
          className="w-44 md:w-28"
          onClick={() => {
            window.location.href = '/api/auth/github/github-login';
          }}
        >
          <div className="flex items-center justify-center rounded-full border border-background/50 bg-muted-foreground p-1">
            <Image
              src="/icons/icon-github.svg"
              blurDataURL="/icons/icon-github.svg"
              alt="logo"
              width={20}
              height={20}
              placeholder="blur"
              priority
            />
          </div>
        </ButtonCustom>
      </div>
    </div>
  );
};

export default SocialMediaAuth;
