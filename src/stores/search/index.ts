import { produce } from 'immer';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type TSearchFilters = {
  genres_list: {
    en: { id: number; name: string }[];
    ru: { id: number; name: string }[];
    fr: { id: number; name: string }[];
  };
  genres: { id: number }[];
  rating: number[];
  sort_by:
    | 'popularity-desc'
    | 'popularity-asc'
    | 'release-desc'
    | 'release-asc'
    | 'title-asc'
    | 'title-desc'
    | 'rating-asc'
    | 'rating-desc';
  start_date: Date;
  end_date: Date;
};

export type TSearchStore = {
  searchFilters: TSearchFilters;
  setValueOfSearchFilter: (
    filterKey: string,
    newValue: string | number | Date
  ) => string | number | Date;
  getValueOfSearchFilter: (filterKey: string) => string | number | Date | (string | number)[];
  addOneItemToSearchFilter: (itemKey: string, newValue: string | number | Date) => void;
  removeOneItemOfSearchFilter: (itemKey: string, valueToRemove: string | number | Date) => void;
  clearAllItemsOfSearchFilter: (filterKey: string) => void;
  replaceAllItemsOfSearchFilter: (itemKey: string, newValue: string[] | number[]) => void;
  resetSearchStore: () => void;
  getGenresListByLanguage: (lang: 'en' | 'ru' | 'fr') => { id: number; name: string }[];
  getGenresList: () => TSearchFilters['genres_list'];
  setGenresList: (newGenres: TSearchFilters['genres_list']) => void;
};

const initialSearchFiltersState: TSearchFilters = {
  genres_list: {
    en: [],
    ru: [],
    fr: [],
  },
  sort_by: 'popularity-desc',
  genres: [],
  rating: [6, 10],
  start_date: new Date('1895-12-28'), // Date of the first movie release ever
  end_date: new Date(),
};

const useSearchStore = create<TSearchStore>()(
  persist(
    (set, get) => ({
      searchFilters: initialSearchFiltersState,
      setValueOfSearchFilter: (
        filterKey: string,
        newValue: string | number | Date
      ): string | number | Date => {
        set(
          produce((draft) => {
            draft.searchFilters[filterKey] = newValue || '';
          })
        );
        return newValue || '';
      },
      addOneItemToSearchFilter: (filterKey: string, newValue: string | number | Date) => {
        set(
          produce((draft) => {
            if (!newValue) return;
            if (!draft.searchFilters[filterKey]?.includes(newValue)) {
              draft.searchFilters[filterKey]?.push(newValue);
            }
          })
        );
      },
      removeOneItemOfSearchFilter: (filterKey: string, valueToRemove: string | number | Date) => {
        set(
          produce((draft) => {
            const index = draft.searchFilters[filterKey]?.findIndex(
              (el: string) => el === valueToRemove
            );
            draft.searchFilters[filterKey]?.splice(index, 1);
          })
        );
      },
      clearAllItemsOfSearchFilter: (filterKey: string) => {
        set(
          produce((draft) => {
            draft.searchFilters[filterKey] = [];
          })
        );
      },
      getValueOfSearchFilter: (filterKey: string) => {
        return get().searchFilters[filterKey as keyof TSearchFilters] as any[];
      },
      replaceAllItemsOfSearchFilter: (filterKey: string, newValue: string[] | number[]) => {
        set(
          produce((draft) => {
            if (!newValue) return;
            draft.searchFilters[filterKey] = newValue;
          })
        );
      },
      resetSearchStore: () => {
        set({ searchFilters: initialSearchFiltersState });
      },
      setGenresList: (newGenres: TSearchFilters['genres_list']) => {
        set(
          produce((draft) => {
            draft.searchFilters.genres_list = newGenres;
          })
        );
      },
      getGenresList: () => {
        return get().searchFilters.genres_list;
      },
      getGenresListByLanguage: (lang: 'en' | 'ru' | 'fr') => {
        return get().searchFilters.genres_list[lang];
      },
    }),
    {
      name: 'hypertube-search-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSearchStore;
