/**
 * 알림 API
 * https://www.notion.so/312eed37f9c58057a8f7d342b038739f?v=312eed37f9c581c8bb52000cb14b045f&source=copy_link
 */

import {
  buildQueryString,
  NOTIFICATION_ENDPOINTS,
} from '@/lib/constants/endpoints';
import { clientApiInstance } from '../instances/clientInstance';
import {
  GetNotificationRequestParams,
  GetNotificationResponseData,
} from '@/lib/types/notification';
import { ApiResponse } from '@/lib/types/common';

export const notificationApi = {
  /**
   * 전체 알림 목록 조회 (무한 스크롤)
   */
  getNotifications: async (
    params: GetNotificationRequestParams
  ): Promise<ApiResponse<GetNotificationResponseData>> => {
    const queryString = buildQueryString({ ...params });

    const endPoint = `${NOTIFICATION_ENDPOINTS.GET_NOTIFICATIONS()}${queryString}`;

    return clientApiInstance.get(endPoint);
  },
  /**
   * 알림 단건 읽음 처리
   */
  /**
   * 알림 모두 읽음 처리
   */
  /**
   * 읽지 않은 알림 개수 조회
   */
  getUnreadNotificationsCount: async (): Promise<ApiResponse<number>> => {
    const endPoint = `${NOTIFICATION_ENDPOINTS.GET_UNREAD_NOTIFICATIONS_COUNT()}`;
    return clientApiInstance.get(endPoint);
  },
};
