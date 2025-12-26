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
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';


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
      {/* Desktop: Bottom dock menu */}
      <div className="hidden lg:block lg:fixed lg:bottom-0 lg:left-0 lg:right-0 lg:z-50">
        <Dock className='items-end pb-3'>
          {/* New Chat Button */}
          <DockItem className='aspect-square rounded-full bg-light-200 dark:bg-neutral-800'>
            <DockLabel>New Chat</DockLabel>
            <DockIcon>
              <Link href="/" className="w-full h-full flex items-center justify-center">
                <Plus className="h-full w-full text-neutral-600 dark:text-neutral-300" />
              </Link>
            </DockIcon>
          </DockItem>

          {/* Navigation Links */}
          {navLinks.map((link, i) => (
            <DockItem
              key={i}
              className={cn(
                'aspect-square rounded-full',
                link.active
                  ? 'bg-light-primary dark:bg-dark-primary ring-2 ring-light-primary/50 dark:ring-dark-primary/50'
                  : 'bg-light-200 dark:bg-neutral-800'
              )}
            >
              <DockLabel>{link.label}</DockLabel>
              <DockIcon>
                <Link href={link.href} className="w-full h-full flex items-center justify-center">
                  {link.customIcon ? (
                    <Image
                      src={link.customIcon}
                      alt={link.label}
                      width={32}
                      height={32}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <link.icon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
                  )}
                </Link>
              </DockIcon>
            </DockItem>
          ))}

          {/* Settings, Theme, User Menu */}
          <DockItem className='aspect-square rounded-full bg-light-200 dark:bg-neutral-800'>
            <DockLabel>Settings</DockLabel>
            <DockIcon>
              <div className="w-full h-full flex items-center justify-center">
                <SettingsButton />
              </div>
            </DockIcon>
          </DockItem>

          <DockItem className='aspect-square rounded-full bg-light-200 dark:bg-neutral-800'>
            <DockLabel>Theme</DockLabel>
            <DockIcon>
              <div className="w-full h-full flex items-center justify-center">
                <ThemeDropdown />
              </div>
            </DockIcon>
          </DockItem>

          <DockItem className='aspect-square rounded-full bg-light-200 dark:bg-neutral-800'>
            <DockLabel>Account</DockLabel>
            <DockIcon>
              <div className="w-full h-full flex items-center justify-center">
                <UserMenu />
              </div>
            </DockIcon>
          </DockItem>
        </Dock>
      </div>

      {/* Mobile: Bottom dock menu */}
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
