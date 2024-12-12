'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import { Moon, Sun } from 'lucide-react';

import { ButtonHypertube } from '@/components/ui/buttons/button-hypertube';

const ThemeToggler = ({ translate }: { translate: (key: string) => string }) => {
  const { theme, setTheme } = useTheme();

  return (
    <ButtonHypertube
      variant="ghost"
      size="icon"
      title={translate(`theme-toggle`)}
      onClick={() => (theme === 'light' ? setTheme('dark') : setTheme('light'))}
      className="smooth42transition hover:bg-transparent hover:text-c42orange"
    >
      <div className="flex flex-row items-center gap-2">
        {theme === 'light' ? <Sun /> : <Moon />}
        {/*<p>{translate(`${theme}`)}</p>*/}
        <span className="sr-only">{translate(`${theme}`)}</span>
      </div>
    </ButtonHypertube>
  );
};

export default ThemeToggler;
