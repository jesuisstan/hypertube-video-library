'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import NextAuth from "next-auth";
import FortyTwoProvider from "next-auth/providers/42-school";

import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import useUserStore from '@/stores/user';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [FortyTwoProvider({
    clientId: process.env.FORTY_TWO_CLIENT_ID || '',
    clientSecret: process.env.FORTY_TWO_CLIENT_SECRET || '',
  })],
})

const SocialMediaAuth = () => {
  const router = useRouter();
  //const { user, setUser } = useUserStore((state) => ({
  //  user: state.user,
  //  setUser: state.setUser,
  //}));

//  const authenticateUser = async () => {
//    try {
//      const response = await fetch('/api/auth/github/github-callback', {
//        credentials: 'include',
//      });
//console.log("response", response); // debug
//      if (response.ok) {
//        const { token, user } = await response.json();

//        // Store the token (e.g., in localStorage or a cookie)
//        localStorage.setItem('token', token);

//        // Set the user state (assuming you have a global state or context)
//        setUser(user);

//        // Navigate to the dashboard
//        router.push('/dashboard');
//      } else {
//        console.error('Authentication failed');
//        router.push('/authentication');
//      }
//    } catch (error) {
//      console.error('Error during authentication:', error);
//      router.push('/authentication');
//    }
//  };

  return (
    <div>
      <div className="mb-3 flex flex-row justify-center gap-5">
        <ButtonCustom
          title="Ecole 42"
          variant="default"
          className="w-44 md:w-28"
          onClick={() => {
            //window.location.href = '/api/auth/login-42';
            signIn('42');
          }}
        >
          <div className="flex items-center justify-center rounded-full border border-background/50 bg-c42green p-1">
            <Image
              src="/icons/icon-42.png"
              blurDataURL="/icons/icon-42.png"
              alt="logo"
              width={20}
              height={20}
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
          //onClick={authenticateUser}
        >
          <div className="flex items-center justify-center rounded-full border border-background/50 bg-muted-foreground p-1">
            <Image
              src="/icons/icon-github.svg"
              blurDataURL="/icons/icon-github.svg"
              alt="logo"
              width={20}
              height={20}
              priority
            />
          </div>
        </ButtonCustom>
      </div>
    </div>
  );
};

export default SocialMediaAuth;
