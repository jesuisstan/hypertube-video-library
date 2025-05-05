'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import { MoonStar, Sun } from 'lucide-react';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';

const ThemeToggler = ({ translate }: { translate: (key: string) => string }) => {
  const { theme, setTheme } = useTheme();

  const switchTheme = (theme: string) => {
    //@ts-ignore
    if (!document.startViewTransition) setTheme(theme);

    //@ts-ignore
    document.startViewTransition(() => setTheme(theme));
  };

  const switchToLight = () => {
    if (theme === 'light') return;
    switchTheme('light');
  };

  const switchToDark = () => {
    if (theme === 'dark') return;
    switchTheme('dark');
  };

  return (
    <div className={`flex flex-row items-center gap-4`}>
      <ButtonCustom
        variant="ghost"
        size="icon"
        title={translate(`theme-toggle`) + ': ' + translate('light')}
        onClick={switchToLight}
        className="smooth42transition hover:text-c42orange hover:bg-transparent"
      >
        <Sun />
      </ButtonCustom>
      {' / '}
      <ButtonCustom
        variant="ghost"
        size="icon"
        title={translate(`theme-toggle`) + ': ' + translate('dark')}
        onClick={switchToDark}
        className="smooth42transition hover:text-c42orange hover:bg-transparent"
      >
        <MoonStar />
      </ButtonCustom>
    </div>
  );
};

export default ThemeToggler;
