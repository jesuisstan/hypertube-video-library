'use client';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define the component props as generic
type TCategoryTabsProps<T extends string> = {
  tabs: Array<{ id: T; label: string; Icon?: LucideIcon }>;
  category: T; // Flexible type
  setCategory: React.Dispatch<React.SetStateAction<T>>;
};

const CategoryToggler = <T extends string>({
  tabs,
  category,
  setCategory,
}: TCategoryTabsProps<T>) => {
  return (
    <Tabs
      defaultValue={category}
      onValueChange={(value) => setCategory(value as T)}
      className="flex w-full flex-row items-center justify-center"
    >
      <TabsList className="flex h-auto flex-row items-center justify-center gap-1">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            title={tab.label}
            className={clsx(
              'smooth42transition data-[state=active]:bg-positive data-[state=inactive]:bg-card data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground cursor-pointer truncate overflow-hidden text-center',
              'w-44 sm:w-56 md:w-64 lg:w-72 xl:w-80 2xl:w-96'
            )}
          >
            <div>{tab.Icon && <tab.Icon size={18} className="mr-2 inline-block" />}</div>
            <span className="truncate text-sm whitespace-nowrap">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategoryToggler;
