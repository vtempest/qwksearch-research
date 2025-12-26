'use client';

import { cn } from '@/lib/utils';
import {
  BookOpenText,
  Search,
  Settings,
  Plus,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelectedLayoutSegments, useRouter } from 'next/navigation';
import React, { useState, type ReactNode } from 'react';
import Layout from './Layout';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import SettingsButton from './Settings/SettingsButton';
import UserMenu from './UserMenu';
import { ThemeDropdown } from "@/components/theme-dropdown"
import AppDockMenu from '@/components/AppDockMenu';


const VerticalIconContainer = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col items-center w-full">{children}</div>;
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const segments = useSelectedLayoutSegments();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const navLinks = [
    {
      icon: null,
      // customIcon: '/icons/icon-searchresults.svg',
      customIcon: '/icons/apple-touch-icon.png',
      href: '/',
      active: segments.length === 0 || segments.includes('c'),
      label: 'Research',
    },
    {
      icon: null,
      customIcon: '/icons/icon-news-title.svg',
      href: '/news',
      active: segments.includes('news'),
      label: 'News Feed',
    },
    {
      icon: null,
      customIcon: '/icons/icon-history.svg',
      href: '/library',
      active: segments.includes('library'),
      label: 'History',
    },
    {
      icon: null,
      customIcon: '/icons/icon-read.svg',
      href: '/editor',
      active: segments.includes('editor'),
      label: 'Editor',
    },
  ];

  // Convert navLinks to dock apps format
  const dockApps = navLinks.map((link) => ({
    id: link.href,
    title: link.label,
    icon: ({ size }: { size: number }) =>
      `<img src="${link.customIcon}" alt="${link.label}" width="${size}" height="${size}" />`,
  }));

  // Find the currently active link's href for initial active state
  const activeHref = navLinks.find((link) => link.active)?.href || '/';

  return (
    <div>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-[72px] lg:flex-col border-r border-light-200 dark:border-dark-200">
        <div className="flex grow flex-col items-center justify-between gap-y-5 overflow-y-auto bg-light-secondary dark:bg-dark-secondary px-2 py-8 shadow-sm shadow-light-200/10 dark:shadow-black/25">
          <a
            className="p-2.5 rounded-full bg-light-200 text-black/70 dark:bg-dark-200 dark:text-white/70 hover:opacity-70 hover:scale-105 tansition duration-200"
            href="/"
          >
            <Plus size={19} className="cursor-pointer" />
          </a>
          <VerticalIconContainer>
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className={cn(
                  'relative flex flex-col items-center justify-center space-y-0.5 cursor-pointer w-full py-2 rounded-lg',
                  link.active
                    ? 'text-black/70 dark:text-white/70 '
                    : 'text-black/60 dark:text-white/60',
                )}
              >
                <div
                  className={cn(
                    link.active && 'bg-light-200 dark:bg-dark-200',
                    'group rounded-lg hover:bg-light-200 hover:dark:bg-dark-200 transition duration-200',
                  )}
                >
                  {link.customIcon ? (
                    <Image
                      src={link.customIcon}
                      alt={link.label}
                      width={25}
                      height={25}
                      className={cn(
                        !link.active && 'group-hover:scale-105',
                        'transition duration:200 m-1.5',
                      )}
                    />
                  ) : (
                    <link.icon
                      size={25}
                      className={cn(
                        !link.active && 'group-hover:scale-105',
                        'transition duration:200 m-1.5',
                      )}
                    />
                  )}
                </div>
                <p
                  className={cn(
                    link.active
                      ? 'text-black/80 dark:text-white/80'
                      : 'text-black/60 dark:text-white/60',
                    'text-[10px]',
                  )}
                >
                  {link.label}
                </p>
              </Link>
            ))}
          </VerticalIconContainer>

          <div className="flex flex-col items-center gap-3">
            <UserMenu />
            <ThemeDropdown />
            <SettingsButton />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full z-50 flex justify-center pb-4 lg:hidden">
        <AppDockMenu
          listDockApps={dockApps}
          handleAppDockClick={(id) => router.push(id)}
          shouldAutoClickOnHover={false}
          shouldAnimateZoom={true}
          gapBetweenItems={false}
        />
      </div>

      <Layout>{children}</Layout>
    </div>
  );
};

export default Sidebar;
