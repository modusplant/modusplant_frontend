import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import DialogModal from '@/components/_common/modal/dialogModal';

const meta = {
  title: 'Components/공통 컴포넌트/DialogModal',
  component: DialogModal,
  parameters: { layout: 'fullscreen' },
  args: {
    hideModal: fn(),
    onConfirm: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof DialogModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoButton: Story = {
  args: {
    title: '게시글을 삭제할까요?',
    description: '삭제한 게시글은 복구할 수 없어요.',
    type: 'two-button',
    buttonText: '삭제',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const dialog = canvas.getByRole('dialog');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');

    const describedbyId = dialog.getAttribute('aria-describedby');
    const describedByEl = document.getElementById(describedbyId ?? '');
    await expect(describedByEl).toHaveTextContent(
      '삭제한 게시글은 복구할 수 없어요.'
    );

    const cancelButton = canvas.getByRole('button', { name: '취소' });
    const confirmButton = canvas.getByRole('button', { name: '삭제' });
    await expect(cancelButton).toHaveFocus();

    await userEvent.tab();
    await expect(confirmButton).toHaveFocus();

    await userEvent.tab();
    await expect(cancelButton).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await expect(args.onCancel).toHaveBeenCalled();
    await expect(args.hideModal).toHaveBeenCalled();
  },
};
