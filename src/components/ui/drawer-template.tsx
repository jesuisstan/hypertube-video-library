import { ReactNode } from 'react';

import clsx from 'clsx';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet-primitives';

const DrawerBasic = ({
  trigger,
  title,
  description = '',
  side = 'right',
  children,
  size,
}: {
  trigger: ReactNode;
  title: string;
  description?: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
  children: ReactNode;
  size?: 'fit' | '1/2' | '1/3' | '1/4' | '3/4' | '1/6';
}) => {
  const sizeClassMap: Record<string, string> = {
    fit: 'sm:w-fit',
    '1/2': 'sm:w-1/2',
    '1/3': 'sm:w-1/3',
    '1/4': 'sm:w-1/4',
    '3/4': 'sm:w-3/4',
    '1/6': 'sm:w-1/6',
  };

  return (
    <Sheet>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent
        side={side}
        className={clsx(
          'flex flex-col',
          (side === 'top' || side === 'bottom') && `h-${size}`,
          (side === 'left' || side === 'right') && ['w-3/4', sizeClassMap[size || '1/2']]
        )}
      >
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default DrawerBasic;
