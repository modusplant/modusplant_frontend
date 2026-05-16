import { showModal } from '@/lib/store/modalStore';
import { useEffect } from 'react';

export const useLinkError = () => {
  useEffect(() => {
    const linkError = sessionStorage.getItem('linkError');
    if (!linkError) return;

    showModal({
      type: 'snackbar',
      description: linkError,
    });
    sessionStorage.removeItem('linkError');
  }, []);
};
