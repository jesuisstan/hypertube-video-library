import { ReactNode } from 'react';

import FilterBar from '@/components/filter-sort/filter-bar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet-primitives';

const FilterDrawer = ({ movies, trigger }: { movies: any[]; trigger: ReactNode }) => {
  return (
    <Sheet>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent side={'right'}>
        <SheetHeader>
          <SheetTitle>Filter results</SheetTitle>
          <SheetDescription>Filter the results by genre, year, rating, and more</SheetDescription>
        </SheetHeader>
        <FilterBar movies={movies} />
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
