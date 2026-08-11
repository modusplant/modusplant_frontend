import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import Dropdown from '@/components/_common/dropdown';

const meta = {
  title: 'Components/공통 컴포넌트/Dropdown',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function ItemsDemo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dropdown
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      trigger={
        <button onClick={() => setIsOpen((prev) => !prev)}>메뉴 열기</button>
      }
      items={[
        { label: '수정', onClick: () => {} },
        { label: '삭제', onClick: () => {}, variant: 'danger' },
      ]}
    />
  );
}

function ChildrenDemo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dropdown
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      trigger={
        <button onClick={() => setIsOpen((prev) => !prev)}>알림 열기</button>
      }
    >
      <div style={{ padding: 12 }}>
        <a href="#a">알림 1</a>
      </div>
    </Dropdown>
  );
}

export const WithItems: Story = {
  render: () => <ItemsDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '메뉴 열기' });

    await userEvent.click(trigger);
    const menu = await canvas.findByRole('menu');
    await expect(menu).toBeInTheDocument();

    const menuItems = canvas.getAllByRole('menuitem');
    await expect(menuItems[0]).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await expect(menuItems[1]).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('menu')).toBeNull();
    await expect(trigger).toHaveFocus();
  },
};

export const WithChildren: Story = {
  render: () => <ChildrenDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '알림 열기' });

    await userEvent.click(trigger);
    await expect(canvas.queryByRole('menu')).toBeNull();

    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
  },
};
