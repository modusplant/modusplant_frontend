import { notificationApi } from '@/lib/api/client/notification';
import { useInfiniteQuery } from '@tanstack/react-query';

type UseGetNotificationsQueryParams = {
  status?: 'unread';
  size?: number;
};

export const useGetNotificationsQuery = ({
  status,
  size = 10,
}: UseGetNotificationsQueryParams) => {
  return useInfiniteQuery({
    queryKey: ['notifications', status],
    queryFn: async ({ pageParam }) => {
      const response = await notificationApi.getNotifications({
        status,
        size,
        lastNotificationId: pageParam,
      });
      if (!(response.status === 200)) {
        throw new Error(response.message || '알림 목록 조회에 실패했습니다.');
      }
      return response.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return null;
      const { notifications } = lastPage;

      if (notifications.length < 10) return null;

      return notifications.at(-1)?.notificationId ?? null;
    },
  });
};
