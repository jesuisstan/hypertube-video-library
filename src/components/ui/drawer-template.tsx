import { ReactNode } from 'react';

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
  description,
  side = 'right',
  children,
  maxWidth,
}: {
  trigger: ReactNode;
  title: string;
  description?: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
  children: ReactNode;
  maxWidth?: '1/2' | '1/3' | '1/4' | '1/5' | '1/6' | '1/7' | '1/8';
}) => {
  return (
    <Sheet>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
};

export default DrawerBasic;
