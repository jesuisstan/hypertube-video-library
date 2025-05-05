'use client';
import { LucideIcon } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from '@/i18n/routing';

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
  const router = useRouter();

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
            className="smooth42transition data-[state=active]:bg-positive data-[state=inactive]:bg-card data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground xs:w-36 w-30 cursor-pointer truncate overflow-hidden text-center sm:w-60"
            onClick={() => {
              router.push(tab.id === 'popular' ? '/browse' : `/browse/${tab.id}`);
            }}
          >
            <div>{tab.Icon && <tab.Icon size={18} className="mr-2 inline-block" />}</div>
            <span className="truncate text-sm whitespace-nowrap">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategoryToggleWrapper;
