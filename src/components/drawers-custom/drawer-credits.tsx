import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocale, useTranslations } from 'next-intl';

import { ArrowBigRight, Search, X } from 'lucide-react';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import DrawerBasic from '@/components/ui/drawer-template';

const Trigger = () => {
  const t = useTranslations();

  return (
    <ButtonCustom variant="outline" size="sm">
      <div className="flex min-w-16 flex-row items-center justify-center gap-1">
        {t('more')}
        <>
          <ArrowBigRight className="h-4 w-4" />
        </>
      </div>
    </ButtonCustom>
  );
};

const DrawerCredits = ({ title, description }: { title: string; description: string }) => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';

  return (
    <DrawerBasic
      trigger={<Trigger />}
      title={title}
      description={description}
      side="right"
      size="1/2"
    >
      <div className="flex w-full flex-col gap-4">
        <div
          key="credits"
          className="smooth42transition flex flex-wrap items-center justify-center gap-5 align-middle"
        >
          credits array
        </div>
      </div>
    </DrawerBasic>
  );
};

export default DrawerCredits;
