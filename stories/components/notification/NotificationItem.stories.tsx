import { NotificationItem } from '@/components/notification/NotificationItem';
import { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Notification/NotificationItem',
  component: NotificationItem,

  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ border: '1px solid lightgray', maxWidth: '80vw' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {},
} satisfies Meta<typeof NotificationItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      notificationId: '01JY3PPG5YJ41H7BPD0DSQW4BB',
      action: 'COMMENT_LIKED',
      status: 'unread',
      actorId: 'd8e9f0a1-b2c3-4567-defa-678901234567',
      actorNickname: '초보가드너',
      postId: '01DY5ZZKBKACTAV9WEVGEMMVBS',
      commentPath: '0.0.5',
      contentType: 'comment',
      contentPreview: '처음 식물 키우는데 이 글 덕분에 많이 배웠어요.',
      createdAt: '2026-04-01T14:00:00',
    },
  },
};
