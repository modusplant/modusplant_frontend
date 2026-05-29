import DialogModal from '@/components/_common/modal/dialogModal';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta = {
  title: 'Components/Common/DialogModal',
  component: DialogModal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    hideModal: fn(),
  },
} satisfies Meta<typeof DialogModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultOpen: Story = {
  args: {
    title: '알림',
    description: '작업이 완료되었습니다.',
    type: 'one-button',
    buttonText: '확인',
  },
};

export const LongContent: Story = {
  args: {
    title: '긴 안내 문구 확인',
    description:
      '여러 줄로 길게 작성된 안내 문구가 들어왔을 때 모바일과 데스크탑에서 줄바꿈, 중앙 정렬, 버튼 위치가 안정적으로 유지되는지 확인합니다.',
    type: 'one-button',
    buttonText: '확인',
    align: 'center',
  },
};

export const DestructiveConfirm: Story = {
  args: {
    title: '정말 삭제하시겠어요?',
    description: '삭제한 게시글은 다시 복구할 수 없습니다.',
    type: 'two-button',
    buttonText: '삭제',
    onConfirm: fn(),
    onCancel: fn(),
    align: 'center',
  },
};

export const KeyboardFocus: Story = {
  args: {
    title: '키보드 포커스 확인',
    description: 'Tab 키로 버튼에 접근 가능한지 확인합니다.',
    type: 'two-button',
    buttonText: '확인',
    align: 'center',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = await canvas.findByRole('dialog', {
      name: '키보드 포커스 확인',
    });

    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await userEvent.tab();
    const cancelButton = await canvas.findByRole('button', { name: '취소' });

    await expect(cancelButton).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(args.hideModal).toHaveBeenCalled();
  },
};

export const MobileViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  args: {
    title: '모바일 다이얼로그',
    description:
      '360px 수준의 모바일 폭에서 다이얼로그 너비와 버튼을 확인합니다.',
    type: 'two-button',
    buttonText: '확인',
    align: 'center',
  },
};
