import { notificationApi } from '@/lib/api/client/notification';
import { useQuery } from '@tanstack/react-query';

export const useGetNotificationCountQuery = () => {
  return useQuery({
    queryKey: ['notifications', 'count'],
    queryFn: async () => {
      const response = await notificationApi.getUnreadNotificationsCount();

      if (response.status !== 200) {
        throw new Error('읽지 않은 알림 개수를 조회할 수 없습니다.');
      }

      return response.data;
    },
  });
};
