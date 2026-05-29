import SnackbarModal from '@/components/_common/modal/snackbarModal';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

const meta = {
  title: 'Components/Common/SnackbarModal',
  component: SnackbarModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Toast layer baseline for overlay stabilization. Snackbar uses a polite live region and the toast z-index layer.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    description: 'Saved successfully.',
    isAnimating: true,
  },
} satisfies Meta<typeof SnackbarModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visible: Story = {
  parameters: {
    a11y: {
      test: 'error',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = await canvas.findByRole('status');

    await expect(status).toHaveAttribute('aria-live', 'polite');
    await expect(status).toHaveAttribute('aria-atomic', 'true');
    await expect(status).toHaveTextContent('Saved successfully.');
  },
};

export const Hidden: Story = {
  args: {
    isAnimating: false,
  },
};

export const LongMessage: Story = {
  args: {
    description:
      'The request could not be completed. Please check the form and try again.',
  },
};
