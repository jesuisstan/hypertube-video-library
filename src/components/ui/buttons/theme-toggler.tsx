'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import { MoonStar, Sun } from 'lucide-react';

import { ButtonCustom } from '@/components/ui/buttons/button-hypertube';

const ThemeToggler = ({ translate }: { translate: (key: string) => string }) => {
  const { theme, setTheme } = useTheme();

  return (
    <ButtonCustom
      variant="ghost"
      size="icon"
      title={translate(`theme-toggle`)}
      onClick={() => (theme === 'light' ? setTheme('dark') : setTheme('light'))}
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
