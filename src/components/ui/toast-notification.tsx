import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import * as Toast from '@radix-ui/react-toast';
import clsx from 'clsx';
import { X } from 'lucide-react';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';

const ToastNotification = ({
  isOpen,
  title,
  text,
  duration,
}: {
  isOpen: boolean;
  title?: string;
  text: string;
  duration?: number;
}) => {
  const t = useTranslations();
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const onClick = () => {
    setOpen(false);
  };

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className="data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut bg-foreground/97 border-c42orange text-background shadow-c42orange/50 grid min-h-32 grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md border p-[15px] shadow-xl [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]"
        open={open}
        onOpenChange={setOpen}
        duration={duration ?? 15000}
      >
        <Toast.Title
          className={clsx(
            'text-c42orange mb-1 text-2xl font-semibold [grid-area:_title]',
            title?.includes('error') && 'text-destructive'
          )}
        >
          {title ? title : t('attention')}
        </Toast.Title>
        <Toast.Description asChild>
          <p className="text-lg font-normal">{text}</p>
        </Toast.Description>
        <Toast.Action className="[grid-area:_action]" asChild altText="X">
          <ButtonCustom
            onClick={onClick}
            size={'icon'}
            title={t('close')}
            variant={'ghost'}
            className="h-4 w-4 p-1"
          >
            <X className="h-4 w-4" />
          </ButtonCustom>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="fixed right-0 bottom-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
    </Toast.Provider>
  );
};

export default ToastNotification;
