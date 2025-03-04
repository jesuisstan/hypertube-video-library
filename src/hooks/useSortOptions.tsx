'use client';

import { useTranslations } from 'next-intl';

const useSortOptions = () => {
  const t = useTranslations();

  return [
    { value: 'title-asc', label: t('title-asc') },
    { value: 'title-desc', label: t('title-desc') },
    { value: 'popularity-asc', label: t('popularity-asc') },
    { value: 'popularity-desc', label: t('popularity-desc') },
    { value: 'rating-asc', label: t('rating-asc') },
    { value: 'rating-desc', label: t('rating-desc') },
    { value: 'release-asc', label: t('release-asc') },
  ];
};

export default useSortOptions;
