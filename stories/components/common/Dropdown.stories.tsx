import Button from '@/components/_common/button';
import Dropdown from '@/components/_common/dropdown';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta = {
  title: 'Components/Common/Dropdown',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Generic dropdown keyboard and accessibility baseline. A11y enforcement remains global todo until secondary/danger contrast debt is resolved.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj;

const baseItems = [
  { label: '마이페이지', onClick: fn(), textAlign: 'left' as const },
  { label: '내 활동', onClick: fn(), textAlign: 'left' as const },
  { label: '로그아웃', onClick: fn(), textAlign: 'left' as const },
];

export const MenuBaseline: Story = {
  render: function MenuBaselineStory() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="w-40">
        <Dropdown
          isOpen={isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
          contentAriaLabel="프로필 메뉴"
          trigger={
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen((prev) => !prev)}
              fullWidth
            >
              프로필 메뉴
            </Button>
          }
          items={baseItems}
          width="w-40"
        />
      </div>
    );
  },
};

export const KeyboardFocus: Story = {
  render: function KeyboardFocusStory() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="w-40">
        <Dropdown
          isOpen={isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
          contentAriaLabel="키보드 메뉴"
          trigger={
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen((prev) => !prev)}
              fullWidth
            >
              옵션 열기
            </Button>
          }
          items={baseItems}
          width="w-40"
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByRole('button', { name: '옵션 열기' });

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowDown}');
    const firstItem = await canvas.findByRole('menuitem', {
      name: '마이페이지',
    });

    await expect(firstItem).toHaveFocus();
    await userEvent.keyboard('{End}');
    const lastItem = await canvas.findByRole('menuitem', { name: '로그아웃' });

    await expect(lastItem).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(firstItem).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(lastItem).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

export const DisabledItem: Story = {
  render: function DisabledItemStory() {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="w-40">
        <Dropdown
          isOpen={isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
          contentAriaLabel="비활성 항목 메뉴"
          trigger={
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen((prev) => !prev)}
              fullWidth
            >
              작업 메뉴
            </Button>
          }
          items={[
            { label: '수정', onClick: fn(), textAlign: 'left' },
            {
              label: '삭제 중',
              onClick: fn(),
              disabled: true,
              textAlign: 'left',
            },
            {
              label: '신고',
              onClick: fn(),
              variant: 'danger',
              textAlign: 'left',
            },
          ]}
          width="w-40"
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByRole('button', { name: '작업 메뉴' });
    const disabledItem = await canvas.findByRole('menuitem', {
      name: '삭제 중',
    });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    const firstItem = await canvas.findByRole('menuitem', { name: '수정' });

    await expect(firstItem).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    const nextEnabledItem = await canvas.findByRole('menuitem', {
      name: '신고',
    });

    await expect(disabledItem).toBeDisabled();
    await expect(nextEnabledItem).toHaveFocus();
  },
};

export const MobileViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: function MobileViewportStory() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="w-[320px] p-4">
        <Dropdown
          isOpen={isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
          contentAriaLabel="모바일 메뉴"
          trigger={
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen((prev) => !prev)}
              fullWidth
            >
              모바일 메뉴
            </Button>
          }
          items={baseItems}
          width="w-full"
        />
      </div>
    );
  },
};
