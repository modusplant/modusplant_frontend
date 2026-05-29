import Button from '@/components/_common/button';
import LoadingState from '@/components/home/loadingState';
import { Loader2 } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Home/LoadingState',
  component: LoadingState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoadingState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PageLoading: Story = {};

export const SectionLoading: Story = {
  render: () => (
    <section className="border-surface-stroke w-[320px] rounded-lg border">
      <LoadingState />
    </section>
  ),
};

export const ButtonLoading: Story = {
  render: () => (
    <Button variant="point" disabled aria-busy="true">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
      제출 중
    </Button>
  ),
};

