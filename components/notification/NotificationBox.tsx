'use client';
import React from 'react';
import { NotificationList } from './NotificationList';
import { NotificationTab } from './NotificationTab';
import { useGetNotificationsQuery } from '@/lib/hooks/notification/useGetNotificationsQuery';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface NotificationBoxProps {
  isMobile: boolean;
}

export const NotificationBox = ({ isMobile }: NotificationBoxProps) => {
  const [tabState, setTabState] = React.useState<'all' | 'unread'>('all');

  // 데스크탑일 때, 모달 내부 리스트 컨테이너를 루트로 지정하기 위한 container ref
  const observerRootContainer = React.useRef<HTMLUListElement>(null);

  const observerTarget = React.useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetNotificationsQuery({
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

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 타겟이 보이고, 다음 페이지가 있고, 현재 로딩 중이 아닐 때
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      // 모바일 페이지에서는 body를 기준으로, 데스크탑 모달에서는 리스트 ul 태그를 기준으로 루트 설정
      { threshold: 0.1, root: isMobile ? null : observerRootContainer.current }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="relative">
      {isMobile ? (
        <div className="sticky top-0 bg-white">
          <Link
            href="/"
            replace
            className="flex w-fit items-center gap-2.5 px-3.25 py-4"
          >
            <ChevronLeft size={28} />
            <p className="typo-semibold14 py-[11.5px] text-[18px]">알림</p>
          </Link>

          <NotificationTab
            tabState={tabState}
            handleClickTab={handleClickTab}
            handleClickReadAll={handleClickReadAll}
            isDataEmpty={notifications.length === 0}
          />
        </div>
      ) : (
        <>
          <p className="typo-bold15 px-5 py-[11.5px] font-bold">알림</p>
          <NotificationTab
            tabState={tabState}
            handleClickTab={handleClickTab}
            handleClickReadAll={handleClickReadAll}
            isDataEmpty={notifications.length === 0}
          />
        </>
      )}
      <NotificationList
        tabState={tabState}
        data={notifications}
        isMobile={isMobile}
        observerTarget={observerTarget}
        observerRootContainer={observerRootContainer}
      />
    </div>
  );
};
