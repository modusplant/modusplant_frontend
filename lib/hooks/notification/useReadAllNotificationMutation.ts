import { notificationApi } from '@/lib/api/client/notification';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useReadAllNotificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationApi.readAllNotifications(),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
