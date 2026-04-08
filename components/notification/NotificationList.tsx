import { useGetNotificationsQuery } from '@/lib/hooks/notification/useGetNotificationsQuery';
import { NotificationItem } from './NotificationItem';
import { Notification } from '@/lib/types/notification';
import React from 'react';

interface NotificationListProps {
  tabState: 'all' | 'unread';
  data: Notification[];
}

export const NotificationList = ({ tabState, data }: NotificationListProps) => {
  // 최대 10개 노출 그 이상은 무한 스크롤 적용
  if (data.length === 0) {
    return tabState === 'all' ? (
      <EmptyListBox>모든 알림을 확인했어요.</EmptyListBox>
    ) : (
      <EmptyListBox>최근 알림이 없어요.</EmptyListBox>
    );
  }
  if (data.length < 5) {
    return (
      <ul className="max-h-83">
        {data.map((notificationData) => (
          <li id={notificationData.notificationId}>
            <NotificationItem data={notificationData} />
            <hr className="border-[#e9e9e9]" />
          </li>
        ))}
      </ul>
    );
  } else {
    return (
      <ul className="max-h-83 overflow-y-scroll">
        {data.map((notificationData) => (
          <li id={notificationData.notificationId}>
            <NotificationItem data={notificationData} />
            <hr className="border-[#e9e9e9]" />
          </li>
        ))}
      </ul>
    );
  }

  // return (
  //   <div className="max-h-83 overflow-y-scroll">
  //     {data.length > 0 ? (
  //       data.map((notificationData) => (
  //         <>
  //           <NotificationItem data={notificationData} />
  //           <hr className="border-[#e9e9e9]" />
  //         </>
  //       ))
  //     ) : tabState === 'unread' ? (
  //       <div>모든 알림을 확인했어요.</div>
  //     ) : (
  //       <div>최근 알림이 없어요.</div>
  //     )}
  //   </div>
  // );
};

const EmptyListBox = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex h-83 w-full items-center justify-center">
      {children}
    </div>
  );
};
