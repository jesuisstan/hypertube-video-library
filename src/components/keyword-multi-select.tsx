'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { CirclePlus, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ButtonShad } from '@/components/ui/buttons/button-shad';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover-primitives';
import useSearchStore from '@/stores/search';
import { TKeyword } from '@/types/general';

export function KeywordMultiSelect() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [keywords, setKeywords] = useState<TKeyword[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Track the total pages

  const { getValueOfSearchFilter, addOneItemToSearchFilter, removeOneItemOfSearchFilter } =
    useSearchStore();
  const selectedKeywords = getValueOfSearchFilter('keywords') as TKeyword[];

  useEffect(() => {
    if (!query.trim()) {
      setKeywords([]);
      setPage(1); // Reset page when query changes
      setTotalPages(1); // Reset total pages
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchKeywords(query, 1); // Fetch the first page when query changes
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const fetchKeywords = async (searchTerm: string, pageToFetch: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/keywords?query=${encodeURIComponent(searchTerm)}&lang=${locale}&page=${pageToFetch}`
      );
      const data = await res.json();

      if (data.error) {
        console.error('Error fetching keywords:', data.error);
        setKeywords([]);
      } else {
        setKeywords((prev) => (pageToFetch === 1 ? data.results : [...prev, ...data.results])); // Append results for subsequent pages
        setTotalPages(data.total_pages); // Update total pages
      }
    } catch (error) {
      console.error('Failed to fetch keywords:', error);
      setKeywords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (keyword: TKeyword) => {
    // Prevent adding the same keyword twice
    if (!selectedKeywords.find((k) => k.id === keyword.id)) {
      addOneItemToSearchFilter('keywords', keyword);
    }
    setQuery('');
    setOpen(false);
  };

  const handleRemove = (keyword: TKeyword) => {
    removeOneItemOfSearchFilter('keywords', keyword);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10 && !isLoading && page < totalPages) {
      setPage((prev) => prev + 1); // Increment the page
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchKeywords(query, page); // Fetch the next page when `page` changes
    }
  }, [page]);

  return (
    <div className="w-full max-w-lg">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <label
            htmlFor="keywords"
            className="flex cursor-pointer flex-row items-center gap-2 font-bold"
            onClick={() => setOpen(!open)}
          >
            <CirclePlus />
            {t('add-keywords')}
          </label>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={t('search-for-keywords')}
              value={query}
              onValueChange={setQuery}
              className="h-9"
            />
            <CommandList onScroll={handleScroll}>
              {isLoading && page === 1 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">{t('loading')}</div>
              ) : (
                <>
                  <CommandEmpty>{t('no-results-found')}</CommandEmpty>
                  {keywords.map((keyword) => (
                    <CommandItem
                      key={keyword.id}
                      value={keyword.name}
                      onSelect={() => handleSelect(keyword)}
                    >
                      {keyword.name}
                    </CommandItem>
                  ))}
                  {isLoading && page > 1 && (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      {t('loading')}
                    </div>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Keywords */}
      {selectedKeywords.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedKeywords.map((keyword) => (
            <Badge
              key={keyword.id}
              className="flex items-center justify-center gap-1 align-middle hover:bg-primary/80 hover:text-primary-foreground"
            >
              {keyword.name}
              <ButtonShad
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => handleRemove(keyword)}
              >
                <X />
              </ButtonShad>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
