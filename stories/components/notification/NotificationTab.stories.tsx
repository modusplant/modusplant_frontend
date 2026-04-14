import { NotificationTab } from '@/components/notification/NotificationTab';
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useArgs } from 'storybook/internal/preview-api';
import { fn } from 'storybook/test';

const meta = {
  title: 'Components/Notification/NotificationTab',
  component: NotificationTab,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          border: '1px solid lightgray',
          padding: '1rem',
          minWidth: '380px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  args: {
    tabState: 'all',
    handleClickTab: fn(),
    handleClickReadAll: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    const handleClickTab = (tabState: 'all' | 'unread') => () => {
      updateArgs({ tabState });
    };

    return <NotificationTab {...args} handleClickTab={handleClickTab} />;
  },
} satisfies Meta<typeof NotificationTab>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    shouldReadAllDisabled: false,
  },
};

export const 알림없음: Story = {
  args: {
    shouldReadAllDisabled: true,
  },
};
