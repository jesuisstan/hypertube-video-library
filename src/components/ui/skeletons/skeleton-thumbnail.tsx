import Image from 'next/image';

export const SkeletonThumbnail = () => {
  return (
    <div className="bg-card shadow-primary/20 smooth42transition relative flex max-w-72 cursor-pointer flex-col items-center gap-2 rounded-md p-2 shadow-md hover:scale-105">
      <div className="relative">
        <Image
          src="/identity/logo-thumbnail.png"
          blurDataURL={'/identity/logo-thumbnail.png'}
          alt="loading placeholder"
          width={200}
          height={300}
          className="rounded-md opacity-50"
          priority
        />
      </div>
      <div className="bg-primary text-primary-foreground absolute top-2 right-2 flex h-10 w-10 items-center justify-center rounded-full border border-amber-400 font-bold opacity-50 shadow-md shadow-amber-400">
        {'??'}
      </div>
      <div className="bg-input mx-2 mt-2 h-6 w-40 animate-pulse rounded"></div>
      <div className="bg-input mx-2 mt-1 h-4 w-32 animate-pulse rounded"></div>
      <div className="bg-input mx-2 mt-1 h-3 w-32 animate-pulse rounded"></div>
    </div>
  );
};
