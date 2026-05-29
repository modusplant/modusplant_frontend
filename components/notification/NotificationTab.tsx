import { cn } from '@/lib/utils/tailwindHelper';

interface NotificationTabProps {
  tabState: 'all' | 'unread';
  handleClickTab: (tabState: 'all' | 'unread') => () => void;
  handleClickReadAll: () => void;
  shouldReadAllDisabled: boolean;
}

export const NotificationTab = ({
  handleClickTab,
  handleClickReadAll,
  tabState,
  shouldReadAllDisabled,
}: NotificationTabProps) => {
  return (
    <div className="border-border-subtle flex items-center justify-between border-y">
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
        className="text-feedback-info-strong disabled:text-action-secondary-bg px-5 py-3 text-sm text-[13px] font-semibold"
        onClick={handleClickReadAll}
        disabled={shouldReadAllDisabled}
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
            'text-action-tertiary-fg',
            'after:content-[""]',
            'after:absolute',
            'after:block',
            'after:-bottom-11/12',
            'after:left-1/2',
            'after:-translate-x-1/2',
            'after:w-full',
            'after:h-0.5',
            'after:bg-action-tertiary-fg',
          ]
        )}
      >
        {children}
      </span>
    </button>
  );
};
