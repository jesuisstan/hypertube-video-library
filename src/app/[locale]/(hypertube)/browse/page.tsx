'use client';

import BrowsePageComponent from '@/app/[locale]/(hypertube)/browse/browse-page-component';
import Loading from '@/app/loading';
import useUserStore from '@/stores/user';

const BrowsePopular = () => {
  const user = useUserStore((state) => state.user);

  return !user ? <Loading /> : <BrowsePageComponent category="popular" />;
};

export default BrowsePopular;
