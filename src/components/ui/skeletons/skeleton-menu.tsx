import Image from 'next/image';

import clsx from 'clsx';

import { Separator } from '@/components/ui/separator';

export const SkeletonUserName = () => {
  return <div className="flex h-4 w-28 animate-pulse rounded-full bg-muted" />;
};

export const generateSkeletonItems = (count: number) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push(
      <div key={i}>
        <div className="ml-4 h-4 w-28 rounded-full bg-muted" />
        <ul className="ml-4 mt-4 space-y-2 border-l-2 border-muted">
          <div className="ml-6 h-2.5 w-36 rounded-full bg-muted" />
          <div className="ml-6 h-2.5 w-36 rounded-full bg-muted" />
          <div className="ml-6 h-2.5 w-36 rounded-full bg-muted" />
        </ul>
      </div>
    );
  }
  return items;
};

const SkeletonMenu = ({ isSidebarOpen }: { isSidebarOpen?: boolean }) => {
  return (
    <aside
      id="sidebar"
      className={clsx(
        `fixed left-0 top-0 z-50 h-fit max-h-screen w-fit bg-transparent p-4 transition-transform`, // basic part
        `lg:translate-x-0`, // sm + md + xl (responsive part)
        isSidebarOpen ? 'translate-x-0 drop-shadow-2xl' : '-translate-x-96' // Conditional style
      )}
      aria-label="Sidebar"
    >
      <div
        id="rounded-menu-container"
        className="relative flex max-h-[97vh] w-64 flex-col space-y-3 rounded-2xl bg-card px-3 pt-5 shadow-md shadow-primary/20"
      >
        <div className="mb-3 flex justify-center">
          <Image
            src="/identity/hypertube-high-resolution-logo-transparent.png"
            blurDataURL={'/identity/hypertube-high-resolution-logo-transparent.png'}
            alt="hypertube-logo"
            width={0}
            height={0}
            sizes="100vw"
            className={clsx(`h-auto w-52`)}
            placeholder="blur"
            priority
          />
        </div>

        {/* Sidebar header */}
        <div className="flex flex-col items-center justify-center gap-2 align-middle">
          <div className="mb-2 flex items-center justify-center space-x-4 align-middle font-bold">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-base text-card" />
            <SkeletonUserName />
          </div>
          {/* horizontal divider */}
          <Separator />
          {/* Sidebar options buttons */}
          <div className="flex flex-row items-center gap-x-1 self-center align-middle">
            <div className="mx-2 my-2 h-7 w-7 rounded-full bg-muted dark:bg-muted" />
            <div className="mx-2 my-2 h-7 w-7 rounded-full bg-muted dark:bg-muted" />
          </div>

          {/* horizontal divider */}
          <Separator />
        </div>

        {/* Profile LINK */}
        <div className="pb-1">
          <div className="ml-4 h-2 w-40 rounded-full bg-muted pb-5" />
        </div>

        {/* Browse LINK */}
        <div className="pb-1">
          <div className="ml-4 h-2 w-40 rounded-full bg-muted pb-5" />
        </div>

        {/* ABOUT LINK */}
        <div className="pb-1">
          <div className="ml-4 h-2 w-40 rounded-full bg-muted pb-5" />
        </div>

        {/* horizontal divider */}
        <Separator />

        <div className="pb-5">
          <div className="ml-4 h-2.5 w-44 rounded-full bg-muted pb-3" />
        </div>
      </div>
    </aside>
  );
};

export default SkeletonMenu;
