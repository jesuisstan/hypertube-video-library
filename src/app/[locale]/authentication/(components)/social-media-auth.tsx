'use client';

import { Dispatch, useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import useSearchStore from '@/stores/search';

const SocialMediaAuth = ({
  translate,
  setError,
}: {
  translate: (key: string) => string;
  setError: Dispatch<React.SetStateAction<string>>;
}) => {
  const resetSearchStore = useSearchStore((state) => state.resetSearchStore);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loading42, setLoading42] = useState(false);

  const authenticateUser = async (provider: string) => {
    try {
      resetSearchStore(); // clear search filters store;

      if (provider === 'github') {
        setLoadingGithub(true);
      } else if (provider === 'google') {
        setLoadingGoogle(true);
      } else if (provider === '42-school') {
        setLoading42(true);
      }
      // Redirect to GitHub login page
      await signIn(provider);

      //setLoading(false);
    } catch (error) {
      console.error('Error during Social Media authentication:', error);
      setError(translate('something-went-wrong'));
      if (provider === 'github') {
        setLoadingGithub(false);
      } else if (provider === 'google') {
        setLoadingGoogle(false);
      } else if (provider === '42-school') {
        setLoading42(false);
      }
    }
  };

  return (
    <div>
      <div className="mb-3 flex flex-row justify-center gap-5">
        <ButtonCustom
          title="42-school"
          variant="default"
          className="w-44 md:w-28"
          onClick={() => authenticateUser('42-school')}
          loading={loading42}
          disabled={loading42 || loadingGoogle || loadingGithub}
        >
          <div className="flex items-center justify-center rounded-full bg-positive p-[5px]">
            <Image
              src="/icons/icon-42.png"
              blurDataURL="/icons/icon-42.png"
              alt="logo-42"
              priority
              placeholder="empty"
              width={0}
              height={0}
              className="h-5 w-5"
            />
          </div>
        </ButtonCustom>
        <ButtonCustom
          title="Google"
          variant="default"
          className="w-44 md:w-28"
          onClick={() => authenticateUser('google')}
          loading={loadingGoogle}
          disabled={loading42 || loadingGoogle || loadingGithub}
        >
          <Image
            src="/icons/icon-google.svg"
            blurDataURL="/icons/icon-google.svg"
            alt="logo-google"
            priority
            placeholder="empty"
            width={0}
            height={0}
            className="h-7 w-7"
          />
        </ButtonCustom>
        <ButtonCustom
          title="Github"
          variant="default"
          className="w-44 md:w-28"
          onClick={() => authenticateUser('github')}
          loading={loadingGithub}
          disabled={loading42 || loadingGoogle || loadingGithub}
        >
          <div className="flex items-center justify-center rounded-full  bg-muted-foreground p-[5px]">
            <Image
              src="/icons/icon-github.svg"
              blurDataURL="/icons/icon-github.svg"
              alt="logo"
              priority
              placeholder="empty"
              width={0}
              height={0}
              className="h-5 w-5"
            />
          </div>
        </ButtonCustom>
      </div>
    </div>
  );
};

export default SocialMediaAuth;
