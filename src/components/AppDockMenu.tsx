"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface DockApp {
  id: string;
  title: string;
  icon: (props: { size: number }) => string;
}

interface AppDockMenuProps {
  listDockApps: DockApp[];
  handleAppDockClick: (id: string) => void;
  shouldAutoClickOnHover?: boolean;
  shouldAnimateZoom?: boolean;
  gapBetweenItems?: boolean;
  bgColor?: string;
  className?: string;
}

/**
 * @module AppDockMenu
 * App Dock Menu with zoom animation on hover, and
 * enhances current app with opacity and shine effect.
 * Option: automatically click on hover
 * @author [vtempest](https://github.com/vtempest)
 */
export default function AppDockMenu({
  listDockApps = [],
  handleAppDockClick = () => {},
  shouldAutoClickOnHover = true,
  shouldAnimateZoom = true,
  gapBetweenItems = false,
  bgColor = "#DED8C4",
  className = "",
}: AppDockMenuProps) {
  const [activeView, setActiveView] = useState(listDockApps?.[0]?.id || "");
  const [dockItemPositions, setDockItemPositions] = useState<Record<string, number>>({});

  const mouseX = useMotionValue(Infinity);
  const containerX = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dockItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update document title and call handler when active view changes
  useEffect(() => {
    if (!activeView) return;

    const activeApp = listDockApps.find((app) => app.id === activeView);
    if (activeApp) {
      document.title = activeApp.title;
      handleAppDockClick(activeView);
    }
  }, [activeView, listDockApps, handleAppDockClick]);

  // Update dock item position
  const updateDockItemPosition = useCallback((index: number, x: number) => {
    setDockItemPositions((prev) => ({
      ...prev,
      [listDockApps[index].id]: x,
    }));
  }, [listDockApps]);

  // Create distance transform for each item
  const createDistanceTransform = useCallback((index: number): MotionValue<number> => {
    return useTransform(mouseX, (val) => {
      const element = dockItemRefs.current[index];
      if (!element) return 0;

      const bounds = element.getBoundingClientRect();
      const XDiffToContainerX = bounds.x - containerX.get();
      const distance = val - bounds.width / 2 - XDiffToContainerX;

      // Update position
      updateDockItemPosition(index, bounds.x);

      return distance;
    });
  }, [mouseX, containerX, updateDockItemPosition]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - rect.left);
      containerX.set(rect.x);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(Infinity);
  };

  const handleItemMouseEnter = (dockItemId: string) => {
    if (shouldAutoClickOnHover) {
      hoverTimeoutRef.current = setTimeout(() => {
        setActiveView(dockItemId);
      }, 500);
    }
  };

  const handleItemMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  return (
    <div style={{ userSelect: "none" }} className={cn("bottom-4", className)}>
      <motion.div
        ref={containerRef}
        role="toolbar"
        aria-orientation="horizontal"
        aria-label="Dock Menu"
        tabIndex={0}
        className={cn(
          "h-16 items-end rounded-full border px-3 pb-2 flex shadow-inner shadow-neutral-300/5",
          gapBetweenItems ? "gap-5" : "gap-1"
        )}
        style={{ userSelect: "none", backgroundColor: bgColor, borderColor: bgColor }}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {listDockApps.map((dockItem, index) => (
          <DockItem
            key={dockItem.id}
            dockItem={dockItem}
            index={index}
            isActive={activeView === dockItem.id}
            shouldAnimateZoom={shouldAnimateZoom}
            mouseX={mouseX}
            containerX={containerX}
            dockItemRefs={dockItemRefs}
            createDistanceTransform={createDistanceTransform}
            onMouseEnter={() => handleItemMouseEnter(dockItem.id)}
            onMouseLeave={handleItemMouseLeave}
            onClick={() => setActiveView(dockItem.id)}
          />
        ))}
      </motion.div>
    </div>
  );
}

interface DockItemProps {
  dockItem: DockApp;
  index: number;
  isActive: boolean;
  shouldAnimateZoom: boolean;
  mouseX: MotionValue<number>;
  containerX: MotionValue<number>;
  dockItemRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  createDistanceTransform: (index: number) => MotionValue<number>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

function DockItem({
  dockItem,
  index,
  isActive,
  shouldAnimateZoom,
  mouseX,
  containerX,
  dockItemRefs,
  createDistanceTransform,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: DockItemProps) {
  const distance = createDistanceTransform(index);
  const widthSync = useTransform(distance, [-125, 0, 125], [44, 85, 44]);
  const width = shouldAnimateZoom
    ? useSpring(widthSync, { stiffness: 400, damping: 25 })
    : widthSync;

  // Safely render icon with error handling
  const renderIcon = () => {
    try {
      if (!dockItem?.icon) return null;
      const iconHtml = dockItem.icon({ size: 32 });
      return <div dangerouslySetInnerHTML={{ __html: iconHtml }} />;
    } catch (error) {
      console.error('Error rendering dock icon:', error);
      return null;
    }
  };

  return (
    <div
      role="button"
      tabIndex={index}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        // Prevent redundant clicks on already active items
        if (!isActive) {
          onClick();
        }
      }}
    >
      <motion.div
        ref={(el) => {
          dockItemRefs.current[index] = el;
        }}
        role="button"
        style={{ width }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 400,
          duration: 0.8,
        }}
        className={cn(
          "group relative p-0.5 flex aspect-square items-center justify-center overflow-hidden rounded-full",
          "transition duration-500",
          "bg-[#DED8C4] hover:bg-[#E5DFC9] shadow-md",
          "before:absolute before:inset-0 before:rounded-full",
          "before:bg-gradient-to-tl before:from-white/40 before:to-transparent before:opacity-100",
          "after:absolute after:inset-0 after:rounded-full",
          "after:bg-gradient-to-br after:from-transparent after:to-black/10",
          isActive
            ? "active ring-1 ring-slate-300 -translate-y-10 duration-4000 ease-out"
            : "cursor-pointer",
          isActive && "before:from-white/70 shadow-lg",
          isActive && "bg-[linear-gradient(110deg,#DED8C4,45%,#EDE8D5,55%,#DED8C4)]",
          isActive && "bg-[length:200%_100%] animate-shine"
        )}
      >
        <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/30 to-black/5 opacity-50 group-[:has(.active)]:from-white/50" />

        <div className="relative z-10 transition-colors duration-300 text-neutral-600 group-hover:text-neutral-800">
          <div
            className={cn(
              "flex flex-col items-center transition-opacity duration-300",
              isActive ? "opacity-100" : "opacity-60"
            )}
          >
            <div className="h-8 w-10 flex items-center justify-center">
              {renderIcon()}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
