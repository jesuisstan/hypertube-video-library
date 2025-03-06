'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import { MoonStar, Sun } from 'lucide-react';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';

const ThemeToggler = ({ translate }: { translate: (key: string) => string }) => {
  const { theme, setTheme } = useTheme();

  const SWITCH = () => {
    switch (theme) {
      case 'light':
        setTheme('dark');
        break;
      case 'dark':
        setTheme('light');
        break;
      default:
        break;
    }
  };

  const toggleTheme = () => {
    //@ts-ignore
    if (!document.startViewTransition) SWITCH();

    //@ts-ignore
    document.startViewTransition(SWITCH);
  };

  return (
    <ButtonCustom
      variant="ghost"
      size="icon"
      title={translate(`theme-toggle`)}
      onClick={toggleTheme}
      className="smooth42transition hover:bg-transparent hover:text-c42orange"
    >
      <div className="flex flex-row items-center gap-2">
        {theme === 'light' ? <Sun /> : <MoonStar />}
        {/*<p>{translate(`${theme}`)}</p>*/}
        <span className="sr-only">{translate(`${theme}`)}</span>
      </div>
    </ButtonCustom>
  );
};

export default ThemeToggler;
