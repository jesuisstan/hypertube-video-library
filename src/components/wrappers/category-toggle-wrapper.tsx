'use client';
import { LucideIcon } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@/i18n/routing';

// Define the component props as generic
type TCategoryTabsProps<T extends string> = {
  tabs: Array<{ id: T; label: string; Icon?: LucideIcon }>;
  category: T; // Flexible type
  setCategory: React.Dispatch<React.SetStateAction<T>>;
};

const CategoryToggleWrapper = <T extends string>({
  tabs,
  category,
  setCategory,
}: TCategoryTabsProps<T>) => {
  return (
    <Tabs
      defaultValue={category}
      onValueChange={(value) => setCategory(value as T)}
      className="flex w-full flex-row items-center justify-center rounded-md border shadow-md shadow-primary/20 xs:w-4/6"
    >
      <TabsList className="flex h-8 w-full gap-1 shadow-sm">
        {tabs.map((tab) => (
          <Link href={`${tab.id}`} key={tab.id} className="flex-1">
            <TabsTrigger
              value={tab.id}
              title={tab.label}
              className="w-full flex-1 cursor-pointer overflow-hidden truncate text-center smooth42transition
                        data-[state=active]:bg-c42green data-[state=inactive]:bg-card
                        data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground"
            >
              {tab.Icon && <tab.Icon size={18} className="mr-2 inline-block" />}
              <span className="truncate whitespace-nowrap text-sm">{tab.label}</span>
            </TabsTrigger>
          </Link>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategoryToggleWrapper;
