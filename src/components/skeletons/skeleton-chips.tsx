const SkeletonChips = ({ message }: { message?: string }) => {
  return (
    <div className="relative flex flex-col">
      <div className="animate-pulse">
        <div className="mb-6 flex flex-row items-end gap-8">
          <div className="bg-muted h-5 w-28 rounded-full" />
          <div className="text-muted-foreground flex flex-row gap-8 text-xs font-normal">
            <div className="bg-muted h-2.5 w-20 rounded-full" />
            <div className="bg-muted h-2.5 w-20 rounded-full" />
          </div>
        </div>
        <div className="flex flex-row flex-wrap justify-start gap-2">
          <div className="bg-muted h-5 w-20 rounded-full" />
          <div className="bg-muted h-5 w-28 rounded-full" />
          <div className="bg-muted h-5 w-16 rounded-full" />
          <div className="bg-muted h-5 w-20 rounded-full" />
          <div className="bg-muted h-5 w-24 rounded-full" />
          <div className="bg-muted h-5 w-20 rounded-full" />
        </div>
      </div>

      {/* ERROR MESSAGE */}
      <div
        id="error-message-chips"
        className="text-destructive absolute top-1/2 left-1/2 line-clamp-3 h-[max-content] -translate-x-1/2 -translate-y-1/2 transform text-center text-sm text-ellipsis"
        title={message}
      >
        {message ?? <span>{message}</span>}
      </div>
    </div>
  );
};

export default SkeletonChips;
