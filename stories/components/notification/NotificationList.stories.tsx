import { NotificationList } from '@/components/notification/NotificationList';
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NotificationListMockData } from './mockData';

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
  args: { tabState: 'all' },
} satisfies Meta<typeof NotificationList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tabState: 'all',
    data: NotificationListMockData,
  },
};
