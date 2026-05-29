import WriteButton from '@/components/community/write/_common/WriteButton';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

const meta = {
  title: 'Components/Community/WriteButton',
  component: WriteButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Deprecated adapter baseline for the community write flow. The public API stays stable while rendering through the common Button.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'default'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
  args: {
    children: 'Submit',
    variant: 'primary',
    disabled: false,
    loading: false,
    onClick: fn(),
  },
} satisfies Meta<typeof WriteButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Default: Story = {
  args: {
    children: 'Save draft',
    variant: 'default',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Submit',
    disabled: true,
  },
};

export const LoadingReady: Story = {
  args: {
    children: 'Submitting',
    loading: true,
  },
};

export const DraftCountLabel: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <span>Load drafts</span>
        <span className="text-surface-stroke">|</span>
        <span className="text-primary-50">3</span>
      </>
    ),
  },
};

export const MobileActionRow: Story = {
  render: () => (
    <div className="flex w-full items-center justify-between gap-2.5 px-4">
      <WriteButton type="button" variant="default">
        <span>Load drafts</span>
        <span className="text-surface-stroke">|</span>
        <span className="text-primary-50">3</span>
      </WriteButton>
      <div className="flex items-center gap-2.5">
        <WriteButton type="button" variant="default" disabled>
          Save draft
        </WriteButton>
        <WriteButton type="submit">Submit</WriteButton>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
};
