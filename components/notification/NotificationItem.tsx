import { useReadNotificationMutation } from '@/lib/hooks/notification/useReadNotificationMutation';
import { Notification } from '@/lib/types/notification';
import { cn } from '@/lib/utils/tailwindHelper';
import { Dot } from 'lucide-react';
import Link from 'next/link';

interface NotificationItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  data: Notification;
}

const buildTitleString = (
  action: Notification['action'],
  actorNickname: Notification['actorNickname']
): string => {
  switch (action) {
    case 'POST_LIKED':
      return '내 게시글이 좋아요를 받았어요.';
    case 'COMMENT_LIKED':
      return '내 댓글이 좋아요를 받았어요';
    case 'COMMENT_ADDED':
      return `${actorNickname}님이 댓글을 달았어요.`;
    case 'COMMENT_REPLY_ADDED':
      return `${actorNickname}님이 대댓글을 달았어요.`;
  }
};

const buildHrefString = (
  postId: Notification['postId'],
  path?: Notification['commentPath']
): string => {
  return `/community/${postId}${path ? '/' + path : ''}`;
};

const formatDate = (dateString: Notification['createdAt']): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMilliSeconds = now.getTime() - date.getTime();

  const diffDays = Math.floor(diffMilliSeconds / (1000 * 60 * 60 * 24));

  if (diffDays < 2) {
    return (
      (diffDays === 1 ? '어제 ' : '') +
      new Intl.DateTimeFormat('ko-KR', {
        dayPeriod: 'short',
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
      }).format(date)
    );
  }

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const NotificationItem = ({
  data,
  className,
  ...props
}: NotificationItemProps) => {
  const {
    notificationId,
    action,
    status,
    actorNickname,
    postId,
    commentPath,
    contentType,
    contentPreview,
    createdAt,
  } = data;
  const { mutate } = useReadNotificationMutation();

  const handleClickNotificationItem = async () => {
    if (status !== 'unread') return;

    mutate({ notificationId });
  };
  return (
    <Link
      className={cn(
        className,
        'flex w-full min-w-75 items-center py-4 pr-5.5 pl-5'
      )}
      href={buildHrefString(postId, commentPath)}
      onClick={handleClickNotificationItem}
      {...props}
    >
      <div className="w-full overflow-hidden">
        <div className="flex items-center justify-between pb-1">
          <p className="typo-semibold14">
            {buildTitleString(action, actorNickname)}
          </p>
          <p className="typo-regular14 text-neutral-60 text-[13px]">
            {formatDate(createdAt)}
          </p>
        </div>
        <p className="typo-regular14 truncate text-[13px]">{contentPreview}</p>
      </div>
      {status === 'unread' && (
        <div className="pl-3 text-[#f44335]">
          <Dot strokeWidth={5} />
        </div>
      )}
    </Link>
  );
};
