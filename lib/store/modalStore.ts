import { create } from 'zustand';

export interface ModalStore {
  isVisible: boolean;
  title?: string;
  description: string;
  type: 'one-button' | 'two-button' | 'snackbar';
  buttonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showModal: (
    modalData: Omit<ModalStore, 'isVisible' | 'showModal' | 'hideModal'>
  ) => void;
  hideModal: () => void;
  align?: 'center';
  preserveLineBreak?: boolean;
}

const useModalStore = create<ModalStore>((set) => ({
  isVisible: false,
  title: '',
  description: '',
  type: 'one-button',
  buttonText: undefined,
  onConfirm: undefined,
  onCancel: undefined,
  align: undefined,
  preserveLineBreak: false,

  showModal: (
    modalData: Omit<ModalStore, 'isVisible' | 'showModal' | 'hideModal'>
  ) => {
    set(() => ({
      isVisible: true,
      ...modalData,
    }));
  },

  hideModal: () => {
    set(() => ({
      isVisible: false,
      title: '',
      description: '',
      type: 'one-button',
      buttonText: undefined,
      onConfirm: undefined,
      onCancel: undefined,
    }));
  },
}));

export default useModalStore;

export const showModal = (
  modalData: Omit<ModalStore, 'isVisible' | 'showModal' | 'hideModal'>
) => useModalStore.getState().showModal(modalData);
