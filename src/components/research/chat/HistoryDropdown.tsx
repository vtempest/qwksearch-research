'use client';

import { History, ClockIcon, Trash } from 'lucide-react';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Description,
  TransitionChild,
} from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useSession } from '@/lib/hooks/useSession';
import { getGuestChats, deleteGuestChat } from '@/lib/guestStorage';
import { Chat } from '@/app/library/page';
import { formatTimeDifference } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';

interface HistoryDropdownProps {
  position?: 'top' | 'bottom';
  align?: 'left' | 'center' | 'right';
}

const HistoryDropdown = ({ position = 'bottom', align = 'right' }: HistoryDropdownProps) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { isAuthenticated, isLoading: sessionLoading } = useSession();

  const fetchChats = async () => {
    // Wait for session to load
    if (sessionLoading) return;

    setLoading(true);

    if (isAuthenticated) {
      // Fetch from API for authenticated users
      const res = await fetch(`/api/chats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      setChats(data.chats);
    } else {
      // Load from local storage for guests
      const guestChats = getGuestChats();
      setChats(guestChats);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchChats();
  }, [isAuthenticated, sessionLoading]);

  const handleDeleteClick = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setChatToDelete(chatId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!chatToDelete) return;

    setDeleting(true);
    try {
      if (isAuthenticated) {
        const res = await fetch(`/api/chats/${chatToDelete}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.status !== 200) {
          throw new Error('Failed to delete chat');
        }
      } else {
        deleteGuestChat(chatToDelete);
      }

      setChats(chats.filter((chat) => chat.id !== chatToDelete));
      toast.success('Chat deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete chat');
    } finally {
      setDeleteDialogOpen(false);
      setChatToDelete(null);
      setDeleting(false);
    }
  };

  const panelPositionClasses = position === 'top'
    ? 'bottom-full mb-2'
    : 'mt-2';

  const panelAlignClasses = align === 'left'
    ? 'left-0 origin-top-left'
    : align === 'center'
    ? 'left-1/2 -translate-x-1/2 origin-top'
    : 'right-0 origin-top-right';

  return (
    <>
      <Popover className="relative">
        <PopoverButton className="p-2 rounded-lg hover:bg-secondary transition-colors duration-200 flex items-center gap-1.5">
          <History size={16} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground hidden sm:inline">
            History
          </span>
        </PopoverButton>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel className={`absolute ${panelPositionClasses} ${panelAlignClasses} w-80 rounded-2xl bg-popover border border-border shadow-xl z-50`}>
            <div className="p-3">
              <div className="mb-2 pb-2 border-b border-border">
                <p className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wide">
                  Chat History
                </p>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6 text-light-200 fill-light-secondary dark:text-[#202020] animate-spin dark:fill-[#ffffff3b]"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100.003 78.2051 78.1951 100.003 50.5908 100C22.9765 99.9972 0.997224 78.018 1 50.4037C1.00281 22.7993 22.8108 0.997224 50.4251 1C78.0395 1.00281 100.018 22.8108 100 50.4251ZM9.08164 50.594C9.06312 73.3997 27.7909 92.1272 50.5966 92.1457C73.4023 92.1642 92.1298 73.4365 92.1483 50.6308C92.1669 27.8251 73.4392 9.0973 50.6335 9.07878C27.8278 9.06026 9.10003 27.787 9.08164 50.594Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4037 97.8624 35.9116 96.9801 33.5533C95.1945 28.8227 92.871 24.3692 90.0681 20.348C85.6237 14.1775 79.4473 9.36872 72.0454 6.45794C64.6435 3.54717 56.3134 2.65431 48.3133 3.89319C45.869 4.27179 44.3768 6.77534 45.014 9.20079C45.6512 11.6262 48.1343 13.0956 50.5786 12.717C56.5073 11.8281 62.5542 12.5399 68.0406 14.7911C73.527 17.0422 78.2187 20.7487 81.5841 25.4923C83.7976 28.5886 85.4467 32.059 86.4416 35.7474C87.1273 38.1189 89.5423 39.6781 91.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              ) : chats.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">No chats found.</p>
                </div>
              ) : (
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className="group flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary transition-colors duration-200"
                    >
                      <Link
                        href={`/c/${chat.id}`}
                        className="flex-1 min-w-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-popover-foreground truncate">
                            {chat.title}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <ClockIcon size={12} className="text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              {formatTimeDifference(new Date(), chat.createdAt)} ago
                            </p>
                          </div>
                        </div>
                      </Link>
                      <button
                        onClick={(e) => handleDeleteClick(e, chat.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all duration-200"
                        title="Delete chat"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {chats.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border">
                  <Link
                    href="/library"
                    className="block text-center text-xs text-primary hover:underline"
                  >
                    View all chats
                  </Link>
                </div>
              )}
            </div>
          </PopoverPanel>
        </Transition>
      </Popover>

      {/* Delete Confirmation Dialog */}
      <Transition appear show={deleteDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[100]"
          onClose={() => {
            if (!deleting) {
              setDeleteDialogOpen(false);
              setChatToDelete(null);
            }
          }}
        >
          <DialogBackdrop className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform rounded-2xl bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle className="text-lg font-medium leading-6 dark:text-white">
                    Delete Confirmation
                  </DialogTitle>
                  <Description className="text-sm dark:text-white/70 text-black/70">
                    Are you sure you want to delete this chat?
                  </Description>
                  <div className="flex flex-row items-end justify-end space-x-4 mt-6">
                    <button
                      onClick={() => {
                        if (!deleting) {
                          setDeleteDialogOpen(false);
                          setChatToDelete(null);
                        }
                      }}
                      className="text-black/50 dark:text-white/50 text-sm hover:text-black/70 hover:dark:text-white/70 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      disabled={deleting}
                      className="text-red-400 text-sm hover:text-red-500 transition duration-200 disabled:opacity-50"
                    >
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default HistoryDropdown;
