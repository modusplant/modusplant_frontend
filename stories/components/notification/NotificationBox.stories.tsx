import { NotificationBox } from '@/components/notification/NotificationBox';
import { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Notification/NotificationBox',
  component: NotificationBox,
  tags: ['autodocs'],
} satisfies Meta<typeof NotificationBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="h-105 w-95 overflow-hidden rounded-[15px] shadow-2xl">
        <Story />
      </div>
    ),
  ],
};

export const Mobile: Story = {
  decorators: [
    (Story) => (
      <div className="h-full w-full">
        <Story />
      </div>
    ),
  ],
};
