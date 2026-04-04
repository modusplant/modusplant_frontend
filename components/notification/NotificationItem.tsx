import { cn } from '@/lib/utils/tailwindHelper';
import { Dot } from 'lucide-react';

interface NotificationItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export const NotificationItem = ({
  title,
  content,
  createdAt,
  isRead,
  className,
  ...props
}: NotificationItemProps) => {
  // 최대 10개 노출 그 이상은 무한 스크롤 적용
  return (
    <div
      className={cn(className, 'flex w-full items-center py-4 pr-2.5 pl-5')}
      {...props}
    >
      <div className="overflow-hidden">
        <div className="flex items-center justify-between pb-1">
          <p className="text-semibold-14">{title}</p>
          <p className="text-regular14 text-neutral-60 text-[13px]">
            {createdAt}
          </p>
        </div>
        <p className="text-regular14 truncate text-[13px]">{content}</p>
      </div>
      {!isRead && (
        <div className="text-[#f44335]">
          <Dot strokeWidth={6} />
        </div>
      )}
    </div>
  );
};
