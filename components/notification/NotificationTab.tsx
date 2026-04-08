import { cn } from '@/lib/utils/tailwindHelper';

interface NotificationTabProps {
  tabState: 'all' | 'unread';
  handleClickTab: (tabState: 'all' | 'unread') => () => void;
  handleClickReadAll: () => void;
  isDataEmpty: boolean;
}

export const NotificationTab = ({
  handleClickTab,
  handleClickReadAll,
  tabState,
  isDataEmpty,
}: NotificationTabProps) => {
  return (
    <div className="flex items-center justify-between border-y border-[#e9e9e9]">
      <div role="tablist" className="text-neutral-80 flex items-center">
        <NotificationTabButton
          aria-selected={tabState === 'all'}
          onClick={handleClickTab('all')}
          aria-controls="panel-all"
        >
          <span>전체</span>
        </NotificationTabButton>
        <NotificationTabButton
          aria-selected={tabState === 'unread'}
          onClick={handleClickTab('unread')}
          aria-controls="panel-unread"
        >
          읽지 않음
        </NotificationTabButton>
      </div>
      <button
        className="disabled:text-neutral-80 px-5 py-3 text-sm text-[13px] font-semibold text-[#027be5]"
        onClick={handleClickReadAll}
        disabled={isDataEmpty}
      >
        모두 읽기
      </button>
    </div>
  );
};

interface NotificationTabButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {}

const NotificationTabButton = ({
  children,
  className,
  ...props
}: NotificationTabButtonProps) => {
  return (
    <button
      role="tab"
      className={cn('px-5 py-3 text-sm font-semibold', className)}
      {...props}
    >
      <span
        className={cn(
          'relative',
          props['aria-selected'] && [
            'text-primary-50',
            'after:content-[""]',
            'after:absolute',
            'after:block',
            'after:-bottom-11/12',
            'after:left-1/2',
            'after:-translate-x-1/2',
            'after:w-full',
            'after:h-0.5',
            'after:bg-primary-50',
          ]
        )}
      >
        {children}
      </span>
    </button>
  );
};
