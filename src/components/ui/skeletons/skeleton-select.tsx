const SelectSkeleton = ({ showLabel, showTitle }: { showLabel?: boolean; showTitle?: boolean }) => {
  return (
    <div className={'w-full'}>
      {showLabel && (
        <div className="text-foreground mb-5 block text-base font-normal">
          <div className="bg-muted h-4 w-24 animate-pulse rounded-full" />
        </div>
      )}
      <div className="bg-muted h-[38px] w-40 animate-pulse rounded-full" />
    </div>
  );
};

export default SelectSkeleton;
