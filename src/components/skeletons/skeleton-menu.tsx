import Image from 'next/image';

import clsx from 'clsx';

import { Separator } from '@/components/ui/separator';

export const SkeletonUserName = () => {
  return <div className="bg-muted-foreground flex h-4 w-28 animate-pulse rounded-full" />;
};

export const generateSkeletonItems = (count: number) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push(
      <div key={i}>
        <div className="bg-muted ml-4 h-4 w-28 rounded-full" />
        <ul className="border-muted mt-4 ml-4 space-y-2 border-l-2">
          <div className="bg-muted ml-6 h-2.5 w-36 rounded-full" />
          <div className="bg-muted ml-6 h-2.5 w-36 rounded-full" />
          <div className="bg-muted ml-6 h-2.5 w-36 rounded-full" />
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
        `fixed top-0 left-0 z-50 h-fit max-h-screen w-fit bg-transparent p-4 transition-transform`, // basic part
        `lg:translate-x-0`, // sm + md + xl (responsive part)
        isSidebarOpen ? 'translate-x-0 drop-shadow-2xl' : '-translate-x-96' // Conditional style
      )}
      aria-label="Sidebar"
    >
      <div
        id="rounded-menu-container"
        className="bg-card shadow-primary/20 relative flex max-h-[97vh] w-64 flex-col space-y-3 rounded-md px-3 pt-5 shadow-md"
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
            <div className="bg-foreground text-card flex h-11 w-11 items-center justify-center rounded-full text-base" />
            <SkeletonUserName />
          </div>
          {/* horizontal divider */}
          <Separator />
          {/* Sidebar options buttons */}
          <div className="flex flex-row items-center gap-x-1 self-center align-middle">
            <div className="bg-muted dark:bg-muted mx-2 my-2 h-7 w-7 rounded-full" />
            <div className="bg-muted dark:bg-muted mx-2 my-2 h-7 w-7 rounded-full" />
          </div>

          {/* horizontal divider */}
          <Separator />
        </div>

        {/* Profile LINK */}
        <div className="pb-1">
          <div className="bg-muted ml-4 h-2 w-40 rounded-full pb-5" />
        </div>

        {/* Browse LINK */}
        <div className="pb-1">
          <div className="bg-muted ml-4 h-2 w-40 rounded-full pb-5" />
        </div>

        {/* ABOUT LINK */}
        <div className="pb-1">
          <div className="bg-muted ml-4 h-2 w-40 rounded-full pb-5" />
        </div>

        {/* horizontal divider */}
        <Separator />

        <div className="pb-5">
          <div className="bg-muted ml-4 h-2.5 w-44 rounded-full pb-3" />
        </div>
      </div>
    </aside>
  );
};

export default SkeletonMenu;
