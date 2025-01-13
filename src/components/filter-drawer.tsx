import { ReactNode } from 'react';

import FilterSortBar from './filter-sort-bar';
import { ButtonCustom } from './ui/buttons/button-custom';

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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter results</SheetTitle>
          <SheetDescription>Filter the results by genre, year, rating, and more</SheetDescription>
        </SheetHeader>
        <FilterSortBar movies={movies} />
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
