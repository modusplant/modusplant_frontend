import { RefObject, useEffect } from 'react';

interface UseInfiniteScrollObserverOptions {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  /** 모바일 여부 등 조건부 활성화용 (기본값: true) */
  enabled?: boolean;
  /** NotificationBox처럼 컨테이너 기준 감시가 필요한 경우 */
  root?: Element | null;
  /** 기본 0.1 */
  threshold?: number;
}

/**
 * IntersectionObserver로 타겟이 보이면 다음 페이지를 가져오는 무한 스크롤 훅
 * @param targetRef 관찰 대상 ref
 */
export function useInfiniteScrollObserver(
  targetRef: RefObject<HTMLElement | null>,
  {
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    enabled = true,
    root = null,
    threshold = 0.1,
  }: UseInfiniteScrollObserverOptions
): void {
  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root, threshold }
    );

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [
    targetRef,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    enabled,
    root,
    threshold,
  ]);
}
