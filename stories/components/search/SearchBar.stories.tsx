import SearchBar from '@/components/search/searchbar';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within } from 'storybook/test';

const meta = {
  title: 'Components/Search/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    placeholder: '검색어를 입력해 주세요',
  },
};

export const Typing: Story = {
  args: {
    defaultValue: '몬스테라',
  },
};

export const ClearButton: Story = {
  args: {
    defaultValue: '지우기 버튼 확인',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '검색어 지우기' }));
  },
};

export const Focus: Story = {
  args: {
    placeholder: 'focus-within 확인',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByPlaceholderText('focus-within 확인'));
  },
};

export const MobileWidth: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => (
    <div className="w-[320px]">
      <SearchBar placeholder="모바일 검색" />
    </div>
  ),
};

