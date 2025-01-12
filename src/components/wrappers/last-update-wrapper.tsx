import React from 'react';

import SkeletonDate from '@/components/ui/skeletons/skeleton-date';

type TLastUpdateProps = {
  loading: boolean;
  date: string | undefined;
};

const LastUpdateWrapper: React.FC<TLastUpdateProps> = ({ loading, date }) => {
  return (
    <div className="mt-4 flex flex-row justify-end gap-1 text-right text-sm text-muted-foreground">
      {/*{t`common:table-overview.last-update`}{' '}*/}
      {loading || !date ? <SkeletonDate /> : (date ?? '')}
    </div>
  );
};

export default LastUpdateWrapper;
