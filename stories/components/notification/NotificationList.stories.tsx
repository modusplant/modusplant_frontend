import { NotificationList } from '@/components/notification/NotificationList';
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NOTIFICATION_LIST_MOCK_DATA } from './mockData';

const meta = {
  title: 'Components/Notification/NotificationList',
  component: NotificationList,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          border: '1px solid lightgray',
          minWidth: '80vw',
        }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    observerTarget: { table: { disable: true } },
  },
  args: { tabState: 'all' },
} satisfies Meta<typeof NotificationList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {
    tabState: 'all',
    isMobile: false,
    data: NOTIFICATION_LIST_MOCK_DATA,
  },
};
export const Mobile: Story = {
  args: {
    tabState: 'all',
    isMobile: true,
    data: NOTIFICATION_LIST_MOCK_DATA,
  },
  decorators: [
    (Story) => (
      <div className="h-50vh overflow-hidden">
        <Story />
      </div>
    ),
  ],
};
