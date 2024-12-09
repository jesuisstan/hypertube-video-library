import { MouseEventHandler } from 'react';
import Link from 'next/link';

import clsx from 'clsx';

import MessagesCounterWrapper from '@/components/wrappers/messages-counter-wrapper';
import NotificationsCounterWrapper from '@/components/wrappers/notifications-counter-wrapper';
import { capitalize } from '@/utils/format-string';

const MenuList = ({
  onClick,
  pathname,
  translate,
}: {
  onClick: MouseEventHandler<HTMLAnchorElement>;
  pathname: string;
  translate: (key: string) => string;
}) => {
  return (
    <ul className="space-y-4 overflow-y-auto text-sm font-bold text-foreground">
      <li>
        <span className="group ml-3 flex items-center">{capitalize(translate(`account`))}</span>
        <ul className="ml-4 mt-2 border-l-2 border-secondary font-normal text-secondary">
          <li>
            <Link
              href={pathname !== '/profile' ? `/profile` : ''} // conditional href to prevent reloading of a page on clicking this link when user is already on this page
              className={clsx(
                `group flex w-full items-center text-secondary smooth42transition`,
                `hover:text-c42orange`
              )}
              onClick={onClick}
              scroll={false}
            >
              <div
                id="smartdata-chosen-pointer"
                className={clsx('ml-[-5px] mr-4 h-2 w-2 rounded-full', {
                  'bg-secondary': pathname === '/profile',
                  'bg-transparent': pathname !== '/profile',
                })}
              />
              <div title={translate(`profile`)} className="max-w-[170px] truncate">
                {translate(`profile`)}
              </div>
            </Link>
          </li>
          {/* NOTIFICATIONS */}
          <li>
            <Link
              href={pathname !== '/notifications' ? '/notifications' : ''} // conditional href to prevent reloading of a page on clicking this link when user is already on this page
              className={clsx(
                `group flex w-full items-center text-secondary smooth42transition`,
                `hover:text-c42orange`
              )}
              onClick={onClick}
              scroll={false}
            >
              <div
                id="smartdata-chosen-pointer"
                className={clsx('ml-[-5px] mr-4 h-2 w-2 rounded-full', {
                  'bg-secondary': pathname === '/notifications',
                  'bg-transparent': pathname !== '/notifications',
                })}
              />
            </Link>
          </li>
        </ul>
      </li>

      <li>
        <span className="group ml-3 flex items-center">
          {capitalize(translate(`search.search`))}
        </span>
        <ul className="ml-4 mt-2 border-l-2 border-secondary font-normal text-secondary">
          <li>
            <Link
              href={pathname !== '/search/smart-suggestions' ? `/search/smart-suggestions` : ''} // conditional href to prevent reloading of a page on clicking this link when user is already on this page
              className={clsx(
                `group mb-1 flex w-full items-center text-secondary smooth42transition`,
                `hover:text-c42orange`
              )}
              onClick={onClick}
              scroll={false}
            >
              <div
                id="smartdata-chosen-pointer"
                className={clsx('ml-[-5px] mr-4 h-2 w-2 rounded-full', {
                  'bg-secondary': pathname === '/search/smart-suggestions',
                  'bg-transparent': pathname !== '/search/smart-suggestions',
                })}
              />
              <div title={translate(`search.smart-suggestions`)} className="max-w-[170px] truncate">
                {translate(`search.smart-suggestions`)}
              </div>
            </Link>
          </li>

          <li>
            <Link
              href={pathname !== '/search/advanced' ? `/search/advanced` : ''} // conditional href to prevent reloading of a page on clicking this link when user is already on this page
              className={clsx(
                `group flex w-full items-center text-secondary smooth42transition`,
                `hover:text-c42orange`
              )}
              onClick={onClick}
              scroll={false}
            >
              <div
                id="chosen-pointer"
                className={clsx('ml-[-5px] mr-4 h-2 w-2 rounded-full', {
                  'bg-secondary': pathname === '/search/advanced',
                  'bg-transparent': pathname !== '/search/advanced',
                })}
              />
              <div title={translate(`search.advanced`)} className="max-w-[170px] truncate">
                {translate(`search.advanced`)}
              </div>
            </Link>
          </li>
        </ul>
      </li>
    </ul>
  );
};

export default MenuList;
