import { ReactNode } from 'react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet-primitives';

const FilterDrawer = ({ trigger }: { trigger: ReactNode }) => {
  return (
    <Sheet>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent side={'right'}>
        <SheetHeader>
          <SheetTitle>TITLE</SheetTitle>
          <SheetDescription>DESCRIPTION</SheetDescription>
        </SheetHeader>
        {'CONTENT'}
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
