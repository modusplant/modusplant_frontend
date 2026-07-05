import { create } from 'zustand';

interface NotificationStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: (isOpen: boolean) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: (isOpen: boolean) => set({ isOpen: !isOpen }),
}));
