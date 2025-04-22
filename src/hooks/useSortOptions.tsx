'use client';

import { useTranslations } from 'next-intl';

const useSortOptions = () => {
  const t = useTranslations();

  return [
    { value: 'title.asc', label: t('title-asc') },
    { value: 'title.desc', label: t('title-desc') },
    { value: 'popularity.asc', label: t('popularity-asc') },
    { value: 'popularity.desc', label: t('popularity-desc') },
    { value: 'vote_average.asc', label: t('rating-asc') },
    { value: 'vote_average.desc', label: t('rating-desc') },
    { value: 'primary_release_date.asc', label: t('release-asc') },
    { value: 'primary_release_date.desc', label: t('release-desc') },
  ];
};

export default useSortOptions;
