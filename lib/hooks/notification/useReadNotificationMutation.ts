import { notificationApi } from '@/lib/api/client/notification';
import { Notification } from '@/lib/types/notification';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useReadNotificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ notificationId }: { notificationId: string }) =>
      notificationApi.readOneNotification(notificationId),

    onMutate: async ({ notificationId }) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previous = queryClient.getQueryData(['notifications']);

      queryClient.setQueryData<Notification[]>(
        ['notifications'],
        (old?: Notification[]) => {
          if (!old) return [];
          return old.map(
            (n) =>
              n.notificationId === notificationId
                ? { ...n, status: undefined } // 읽음
                : n // 읽지않음
          );
        }
      );
      return { previous };
    },
    onError: (_error, _notificationId, context) => {
      console.error(_error);
      queryClient.setQueryData(['notifications'], context?.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
