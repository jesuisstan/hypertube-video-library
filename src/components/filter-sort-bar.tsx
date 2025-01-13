'use client';

import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import useSearchStore from '@/stores/search';

const FilterSortBar = () => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const { getGenresListByLanguage, setValueOfSearchFilter, replaceAllItemsOfSearchFilter } =
    useSearchStore();
  const [sortOption, setSortOption] = useState('title-asc');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [year, setYear] = useState('');
  const [rating, setRating] = useState<[number, number]>([0, 10]);

  const genresList = getGenresListByLanguage(locale); // Adjust locale as needed

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
    replaceAllItemsOfSearchFilter('sort', [event.target.value]);
  };

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(value)
        ? prevGenres.filter((genre) => genre !== value)
        : [...prevGenres, value]
    );
    replaceAllItemsOfSearchFilter('genres', selectedGenres);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(event.target.value);
    setValueOfSearchFilter('year', event.target.value);
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newRating = [...rating] as [number, number];
    newRating[index] = Number(event.target.value);
    setRating(newRating);
    replaceAllItemsOfSearchFilter('rating', newRating);
  };

  return (
    <div className="flex flex-row gap-4 rounded-md bg-background p-4 shadow-md">
      <div className="flex flex-col gap-2">
        <label htmlFor="sort" className="font-bold">
          {t('sort-by')}
        </label>
        <select
          id="sort"
          value={sortOption}
          onChange={handleSortChange}
          className="rounded border p-2"
        >
          <option value="title-asc">{t('title-asc')}</option>
          <option value="title-desc">{t('title-desc')}</option>
          <option value="popularity-asc">{t('popularity-asc')}</option>
          <option value="popularity-desc">{t('popularity-desc')}</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="genres" className="font-bold">
          {t('genres')}
        </label>
        <select
          id="genres"
          multiple
          value={selectedGenres}
          onChange={handleGenreChange}
          className="rounded border p-2"
        >
          {genresList.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="year" className="font-bold">
          {t('release')}
        </label>
        <input
          id="year"
          type="number"
          value={year}
          onChange={handleYearChange}
          className="rounded border p-2"
          placeholder={t('enter-year')}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold">{t('rating')}</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={rating[0]}
            onChange={(e) => handleRatingChange(e, 0)}
            className="rounded border p-2"
            placeholder={t('min')}
            min="0"
            max="10"
          />
          <input
            type="number"
            value={rating[1]}
            onChange={(e) => handleRatingChange(e, 1)}
            className="rounded border p-2"
            placeholder={t('max')}
            min="0"
            max="10"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSortBar;
