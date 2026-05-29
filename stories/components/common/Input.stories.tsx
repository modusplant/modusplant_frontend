import { Input } from '@/components/_common/input';
import Textarea from '@/components/_common/textarea';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta = {
  title: 'Components/Common/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Input stabilization phase 1 baseline for helper, error, password, count, required, and accessibility states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'text' },
    error: { control: 'boolean' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    showPasswordToggle: { control: 'boolean' },
    showCount: { control: 'boolean' },
  },
  args: {
    placeholder: 'Enter email',
    type: 'email',
    'aria-label': '이메일',
    onChange: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    a11y: {
      test: 'error',
    },
  },
};

export const Focused: Story = {
  parameters: {
    a11y: {
      test: 'error',
    },
  },
  args: {
    placeholder: 'Focused state',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Focused state');

    await userEvent.click(input);
    await expect(input).toHaveFocus();
    await userEvent.keyboard('abc');
    await expect(input).toHaveValue('abc');
  },
};

export const Error: Story = {
  args: {
    defaultValue: 'wrong-email',
    error: 'Use a valid email address.',
  },
};

export const AriaInvalidCandidate: Story = {
  args: {
    defaultValue: 'invalid',
    error: true,
    'aria-describedby': 'external-error',
  },
  render: (args) => (
    <div className="flex w-80 flex-col gap-2">
      <Input {...args} />
      <p id="external-error" className="text-system-alert text-sm">
        External error text connected through aria-describedby.
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    a11y: {
      test: 'error',
    },
  },
  args: {
    defaultValue: 'disabled@modusplant.com',
    disabled: true,
  },
};

export const WithHelperText: Story = {
  args: {
    id: 'nickname',
    placeholder: 'Enter nickname',
    helperText: 'Use 2 to 12 characters.',
  },
};

export const Required: Story = {
  parameters: {
    a11y: {
      test: 'error',
    },
  },
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <label
        htmlFor="required-email"
        className="text-neutral-20 text-sm font-medium"
      >
        Email <span className="text-primary-50">*</span>
      </label>
      <Input
        id="required-email"
        type="email"
        required
        placeholder="Enter email"
      />
    </div>
  ),
};

export const PasswordToggle: Story = {
  parameters: {
    a11y: {
      test: 'error',
    },
  },
  args: {
    type: 'password',
    placeholder: 'Password',
    'aria-label': '비밀번호',
    showPasswordToggle: true,
    defaultValue: 'password1234',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Password');
    const toggle = canvas.getByRole('button', { name: 'Show password' });

    await expect(input).toHaveAttribute('type', 'password');
    await userEvent.click(toggle);
    await expect(input).toHaveAttribute('type', 'text');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  },
};

export const LongText: Story = {
  args: {
    defaultValue:
      'A very long input value is used to check clipping, count alignment, and layout stability.',
    showCount: true,
    maxLength: 100,
  },
};

export const LoadingCandidate: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <Input
        defaultValue="Checking nickname..."
        aria-label="닉네임"
        disabled
        aria-busy="true"
        helperText="Validation is running."
      />
      <p className="text-neutral-60 text-sm" role="status">
        Checking availability...
      </p>
    </div>
  ),
};

export const MobileWidth: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => (
    <div className="w-[320px] px-4">
      <Input
        placeholder="Mobile input"
        aria-label="모바일 입력"
        helperText="Mobile 360px baseline."
      />
    </div>
  ),
};

export const FormFieldExample: Story = {
  render: () => (
    <form className="flex w-80 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="form-title"
          className="text-neutral-20 text-sm font-medium"
        >
          Title <span className="text-primary-50">*</span>
        </label>
        <Input
          id="form-title"
          required
          showCount
          maxLength={60}
          placeholder="Enter title"
          helperText="Keep it concise."
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="form-content"
          className="text-neutral-20 text-sm font-medium"
        >
          Content
        </label>
        <Textarea
          id="form-content"
          placeholder="Enter content"
          helperText="Textarea uses the same helper/error contract."
        />
      </div>
    </form>
  ),
};
