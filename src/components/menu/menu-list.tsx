import { MouseEventHandler } from 'react';
import Link from 'next/link';

import clsx from 'clsx';

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
    <ul className="space-y-4 overflow-y-auto text-sm font-normal text-card-foreground">
      <li>
        <span
          className={clsx('group ml-3 flex items-center smooth42transition', {
            'text-c42green': pathname === '/profile',
          })}
        >
          {capitalize(translate(`account`))}
        </span>
        <ul className="ml-4 mt-2 border-l border-muted-foreground font-normal text-muted-foreground">
          <li>
            <Link
              href={pathname !== '/profile' ? `/profile` : ''} // conditional href to prevent reloading of a page on clicking this link when user is already on this page
              className={clsx(
                `group flex w-full items-center text-muted-foreground smooth42transition`,
                `hover:text-c42orange`
              )}
              onClick={onClick}
              scroll={false}
            >
              <div
                id="smartdata-chosen-pointer"
                className={clsx('ml-[-5px] mr-4 h-2 w-2 rounded-full', {
                  'bg-muted-foreground': pathname === '/profile',
                  'bg-transparent': pathname !== '/profile',
                })}
              />
              <div title={translate(`profile`)} className="max-w-[170px] truncate">
                {translate(`profile`)}
              </div>
            </Link>
          </li>
        </ul>
      </li>

      <li>
        <span
          className={clsx('group ml-3 flex items-center smooth42transition', {
            'text-c42green': pathname === '/search',
          })}
        >
          {capitalize(translate(`search.search`))}
        </span>
        <ul className="ml-4 mt-2 border-l border-muted-foreground font-normal text-muted-foreground">
          <li>
            <Link
              href={pathname !== '/search/smart-suggestions' ? `/search/smart-suggestions` : ''} // conditional href to prevent reloading of a page on clicking this link when user is already on this page
              className={clsx(
                `group mb-1 flex w-full items-center text-muted-foreground smooth42transition`,
                `hover:text-c42orange`
              )}
              onClick={onClick}
              scroll={false}
            >
              <div
                id="smartdata-chosen-pointer"
                className={clsx('ml-[-5px] mr-4 h-2 w-2 rounded-full', {
                  'bg-muted-foreground': pathname === '/search/smart-suggestions',
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
                `group flex w-full items-center text-muted-foreground smooth42transition`,
                `hover:text-c42orange`
              )}
              onClick={onClick}
              scroll={false}
            >
              <div
                id="chosen-pointer"
                className={clsx('ml-[-5px] mr-4 h-2 w-2 rounded-full', {
                  'bg-muted-foreground': pathname === '/search/advanced',
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
