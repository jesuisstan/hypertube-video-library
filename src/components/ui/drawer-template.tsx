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
  size?: 'fill' | '1/2' | '1/3' | '1/4' | '3/4' | '1/6';
}) => {
  return (
    <Sheet>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent
        side={side}
        className={clsx(
          `flex flex-col`,
          (side === 'top' || 'bottom') && `h-${size}`,
          (side === 'left' || 'right') && `w-${size}`
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
