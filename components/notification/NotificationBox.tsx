import React from 'react';
import { NotificationList } from './NotificationList';
import { NotificationTab } from './NotificationTab';
import { useGetNotificationsQuery } from '@/lib/hooks/notification/useGetNotificationsQuery';

interface NotificationBoxProps {}

export const NotificationBox = ({}: NotificationBoxProps) => {
  const [tabState, setTabState] = React.useState<'all' | 'unread'>('all');

  const { data } = useGetNotificationsQuery({
    status: tabState === 'unread' ? 'unread' : undefined,
  });

  const handleClickTab = (tabState: 'all' | 'unread') => () => {
    setTabState(tabState);
  };

  // TODO: 전체 알림 읽기 API 연결
  const handleClickReadAll = () => {};
  // if (!data) return;

  const notifications = React.useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((p) => p?.notifications ?? []);
  }, [data]);

  return (
    <div className="size-full">
      <p className="typo-bold15 px-5 py-[11.5px] font-bold">알림</p>
      <NotificationTab
        tabState={tabState}
        handleClickTab={handleClickTab}
        handleClickReadAll={handleClickReadAll}
        isDataEmpty={notifications.length === 0}
      />
      <NotificationList tabState={tabState} data={notifications} />
    </div>
  );
};
