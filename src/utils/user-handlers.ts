import { User as TUser } from 'next-auth';

import { TProfileCompleteLayout } from '@/components/dialogs-custom/dialog-profile-modify';

export const isProfileCategoryFilled = (
  layout: TProfileCompleteLayout,
  user: TUser | undefined | null
): boolean => {
  if (!user) return false;

  if (layout === 'basics') {
    return !!(user?.firstname && user?.lastname && user?.nickname);
  } else if (layout === 'description') {
    return !!user?.biography;
  } else if (layout === 'location') {
    return !!user?.address;
  } else if (layout === 'photos') {
    return user?.photos?.length! >= 1; // At least one photo
  } else return false;
};

export const isProfileComplete = (user: TUser | undefined | null): boolean => {
  if (!user) return false;

  let isComplete = false;
  if (isProfileCategoryFilled('basics', user)) {
    if (isProfileCategoryFilled('description', user)) {
      if (isProfileCategoryFilled('location', user)) {
        if (isProfileCategoryFilled('photos', user)) {
          isComplete = true;
        }
      }
    }
  }

  return isComplete;
};
