import Textarea from '@/components/_common/textarea';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within } from 'storybook/test';

const meta = {
  title: 'Components/Common/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Textarea stabilization phase 1 baseline for helper, error, count, required, disabled, and mobile typing states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    error: { control: 'boolean' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    showCount: { control: 'boolean' },
  },
  args: {
    placeholder: 'Enter content',
    onChange: fn(),
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Focused: Story = {
  args: {
    placeholder: 'Focused textarea',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByPlaceholderText('Focused textarea'));
  },
};

export const Error: Story = {
  args: {
    defaultValue: '',
    error: 'Content is required.',
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 'Disabled content',
    disabled: true,
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: 'Write a short introduction.',
  },
};

export const Required: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <label htmlFor="required-content" className="text-neutral-20 text-sm font-medium">
        Content <span className="text-primary-50">*</span>
      </label>
      <Textarea id="required-content" required placeholder="Enter content" />
    </div>
  ),
};

export const LongTextWithCount: Story = {
  args: {
    defaultValue:
      'This long textarea value checks count placement, wrapping, and layout stability in a realistic form field.',
    showCount: true,
    maxLength: 160,
  },
};

export const LoadingCandidate: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <Textarea
        defaultValue="Saving draft..."
        disabled
        aria-busy="true"
        helperText="Draft save is running."
      />
      <p className="text-neutral-60 text-sm" role="status">
        Saving...
      </p>
    </div>
  ),
};

export const MobileTyping: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => (
    <div className="w-[320px] px-4">
      <Textarea
        placeholder="Mobile textarea"
        helperText="Check touch keyboard and text wrapping on mobile."
        showCount
        maxLength={120}
      />
    </div>
  ),
};
