'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { Binoculars, CircleUser, MenuIcon, ShieldQuestion } from 'lucide-react';

import ContactSupportBlock from '@/components/menu/contact-support-block';
import SideBarHeader from '@/components/menu/side-bar-header';
import { Separator } from '@/components/ui/separator';
import SkeletonMenu from '@/components/ui/skeletons/skeleton-menu';
import { Link } from '@/i18n/routing';
import { usePathname } from '@/i18n/routing';
import useUserStore from '@/stores/user';

const Menu: React.FC = () => {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);
  const globalLoading = useUserStore((state) => state.globalLoading);
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null); // to handle closing on outside click
  const [isClient, setIsClient] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  /* To render Menu only on client side to avoid hydration errors */
  useEffect(() => {
    setIsClient(true);
  }, []);

  /* To blur the content when SidebarMenu is opened */
  useEffect(() => {
    const handleWindowResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 1200 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleWindowResize);
    const mainElement = document?.getElementById('main-content') || null;
    isSidebarOpen
      ? (mainElement!.style.filter = 'blur(3px)')
      : (mainElement!.style.filter = 'none');
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [isSidebarOpen]);

  /* Event listener to close Menu when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    if (isSidebarOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="relative z-50 h-10 w-[330px] flex-shrink">
      {/* Menu on small screens */}
      <div
        className={clsx(
          `bg-background/80 text-foreground fixed mt-2 ml-3 inline-flex items-center space-x-1 rounded-lg p-2 text-sm`,
          `lg:hidden`
        )}
      >
        <button
          data-drawer-target="default-sidebar"
          aria-controls="default-sidebar"
          type="button"
          onClick={toggleSidebar}
          title={t('menu-open')}
          className="flex w-fit cursor-pointer flex-row items-center space-x-3"
        >
          <div>
            <MenuIcon />
          </div>
          {isClient && (
            <Image
              src="/identity/logo-title-only.png"
              blurDataURL="/identity/logo-title-only.png"
              alt="logo"
              width={121}
              height={0}
              placeholder="blur"
              priority
            />
          )}
        </button>
      </div>

      {/* Menu Sidebar */}
      {isClient && !globalLoading && user ? (
        <>
          <div
            id="menu-sidebar"
            className={clsx(
              `fixed top-0 left-0 z-50 h-fit max-h-screen w-fit bg-transparent p-4 transition-transform`, // basic part
              `lg:translate-x-0`, // sm + md + xl (responsive part)
              isSidebarOpen ? 'translate-x-0 drop-shadow-2xl' : '-translate-x-96' // Conditional style
            )}
            aria-label="menuSidebar"
            ref={menuRef}
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

              <SideBarHeader
                name={user?.nickname || user?.firstname}
                photoUrl={
                  Array.isArray(user?.photos) && user?.photos.length > 0
                    ? user.photos[0]
                    : undefined
                }
                translate={t}
              />

              {/* Horizontal divider */}
              <Separator />

              {/* PROFILE PAGE LINK */}
              <div id="profile-link" className="ml-3 flex w-fit items-center gap-2 text-sm">
                <CircleUser />
                <Link
                  href={`/profile`}
                  className={clsx(
                    `smooth42transition flex w-full items-center`,
                    `hover:text-c42orange`,
                    pathname === `/profile` && 'text-positive'
                  )}
                  onClick={() => {
                    if (isSidebarOpen) setIsSidebarOpen(false);
                  }}
                  scroll={false}
                >
                  {t(`profile`)}
                </Link>
              </div>

              {/* BROWSE PAGE LINK */}
              <div id="browse-link" className="ml-3 flex w-fit items-center gap-2 text-sm">
                <Binoculars />
                <Link
                  href={`/browse`}
                  className={clsx(
                    `smooth42transition flex w-full items-center`,
                    `hover:text-c42orange`,
                    pathname.includes(`/browse`) && 'text-positive'
                  )}
                  onClick={() => {
                    if (isSidebarOpen) setIsSidebarOpen(false);
                  }}
                  scroll={false}
                >
                  {t(`browse`)}
                </Link>
              </div>

              {/* ABOUT LINK */}
              <div id="about-link" className="ml-3 flex w-fit items-center gap-2 text-sm">
                <ShieldQuestion />
                <Link
                  href={`/about`}
                  className={clsx(
                    `smooth42transition flex w-full items-center`,
                    `hover:text-c42orange`,
                    pathname === `/about` && 'text-positive'
                  )}
                  onClick={() => {
                    if (isSidebarOpen) setIsSidebarOpen(false);
                  }}
                  scroll={false}
                >
                  {t(`about`)}
                </Link>
              </div>

              {/* horizontal divider */}
              <Separator />

              {/* SUPPORT BLOCK */}
              <ContactSupportBlock translate={t} />
            </div>
          </div>
        </>
      ) : (
        <SkeletonMenu isSidebarOpen={isSidebarOpen} />
      )}
    </div>
  );
};

export default Menu;
