import Image from 'next/image';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { CircleUser, Search, ShieldQuestion } from 'lucide-react';

import ContactSupportBlock from './contact-support-block';
import SideBarHeader from './side-bar-header';

import LocaleSwitcher from '@/components/ui/buttons/locale-switcher';
import ThemeToggler from '@/components/ui/buttons/theme-toggler';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link, usePathname } from '@/i18n/routing';
import useUserStore from '@/stores/user';

export function AppSidebar() {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);
  const pathname = usePathname();

  const items = [
    {
      title: t(`profile`),
      url: '/profile',
      icon: CircleUser,
    },
    {
      title: t(`browse`),
      url: '/browse',
      icon: Search,
    },
    {
      title: t(`about`),
      url: '/about',
      icon: ShieldQuestion,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
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
            Array.isArray(user?.photos) && user?.photos.length > 0 ? user.photos[0] : undefined
          }
          translate={t}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/*<SidebarGroupLabel>Application</SidebarGroupLabel>*/}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} isActive={item.url === pathname}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            <Label className="text-muted-foreground text-xs">{t(`color-theme`)}</Label>
            <ThemeToggler translate={t} />
          </div>
          <Separator />
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            <Label className="text-muted-foreground text-xs">{t(`app-language`)}</Label>
            <LocaleSwitcher />
          </div>
          <Separator />
          <ContactSupportBlock translate={t} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
