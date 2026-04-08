import { NotificationItem } from './NotificationItem';
import { Notification } from '@/lib/types/notification';
import React from 'react';
import { cn } from '@/lib/utils/tailwindHelper';

interface NotificationListProps {
  tabState: 'all' | 'unread';
  data: Notification[];
  isMobile: boolean;
  observerTarget?: React.RefObject<HTMLDivElement | null>;
  observerRootContainer?: React.RefObject<HTMLUListElement | null>;
}

export const NotificationList = ({
  tabState,
  data,
  isMobile,
  observerTarget,
  observerRootContainer,
}: NotificationListProps) => {
  // 최대 10개 노출 그 이상은 무한 스크롤 적용
  const reactiveHeight = isMobile ? 'h-100dvh' : 'h-83';
  if (data.length === 0) {
    return tabState === 'all' ? (
      <EmptyListBox className={reactiveHeight}>
        최근 알림이 없어요.
      </EmptyListBox>
    ) : (
      <EmptyListBox className={reactiveHeight}>
        모든 알림을 확인했어요.
      </EmptyListBox>
    );
  }
  if (data.length < 5) {
    return (
      <ul className={cn(reactiveHeight)}>
        {data.map((notificationData) => (
          <li key={notificationData.notificationId}>
            <NotificationItem data={notificationData} />
            <hr className="border-[#e9e9e9]" />
          </li>
        ))}
      </ul>
    );
  } else {
    return (
      <ul
        className={cn(reactiveHeight, isMobile ? '' : 'overflow-y-auto')}
        ref={observerRootContainer}
      >
        {data.map((notificationData) => (
          <li key={notificationData.notificationId}>
            <NotificationItem data={notificationData} />
            <hr className="border-[#e9e9e9]" />
          </li>
        ))}
        <div ref={observerTarget} />
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

const EmptyListBox = ({
  children,
  className,
}: React.PropsWithChildren & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('flex w-full items-center justify-center', className)}>
      {children}
    </div>
  );
};
