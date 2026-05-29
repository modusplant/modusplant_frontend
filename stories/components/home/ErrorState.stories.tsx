import Button from '@/components/_common/button';
import ErrorState from '@/components/home/errorState';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

const meta = {
  title: 'Components/Home/ErrorState',
  component: ErrorState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithoutRetry: Story = {
  args: {
    message: '잠시 후 다시 시도해 주세요.',
  },
};

export const WithRetry: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <ErrorState message="네트워크 상태를 확인한 뒤 다시 시도해 주세요." />
      <Button variant="point2" onClick={fn()}>
        다시 시도
      </Button>
    </div>
  ),
};

export const LongErrorText: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  args: {
    message:
      '서버 응답이 지연되어 게시글 목록을 불러오지 못했습니다. 잠시 후 다시 시도하거나 네트워크 연결 상태를 확인해 주세요.',
  },
};

