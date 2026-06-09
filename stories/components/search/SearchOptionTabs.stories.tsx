import SearchOptionTabs from '@/components/search/searchOptionTabs';
import type { SearchOption } from '@/lib/types/search';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta = {
  title: 'Components/Search/SearchOptionTabs',
  component: SearchOptionTabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    selectedOption: 'title',
    onChange: fn(),
  },
} satisfies Meta<typeof SearchOptionTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Selected: Story = {
  args: {
    selectedOption: 'title_content',
  },
};

export const Interactive: Story = {
  render: () => {
    const [selectedOption, setSelectedOption] = useState<SearchOption>('title');

    return (
      <div className="w-[520px]">
        <SearchOptionTabs
          selectedOption={selectedOption}
          onChange={setSelectedOption}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.tab();
    const titleTab = await canvas.findByRole('tab', { name: '제목' });
    await expect(titleTab).toHaveFocus();
    await expect(titleTab).toHaveAttribute('aria-selected', 'true');

    await userEvent.keyboard('{ArrowRight}');
    const contentTab = await canvas.findByRole('tab', {
      name: '본문',
      selected: true,
    });
    await expect(contentTab).toHaveFocus();

    await userEvent.keyboard('{End}');
    const lastTab = await canvas.findByRole('tab', {
      name: '제목+본문+댓글',
      selected: true,
    });
    await expect(lastTab).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    const previousTab = await canvas.findByRole('tab', {
      name: '제목+본문',
      selected: true,
    });
    await expect(previousTab).toHaveFocus();

    await userEvent.keyboard('{Home}');
    await canvas.findByRole('tab', { name: '제목', selected: true });
    await expect(titleTab).toHaveFocus();
  },
};

export const KeyboardFocus: Story = {
  args: {
    selectedOption: 'content',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    const selectedTab = await canvas.findByRole('tab', { name: '본문' });

    await expect(selectedTab).toHaveFocus();
    await expect(selectedTab).toHaveAttribute('aria-selected', 'true');
  },
};

export const LongTabLabel: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => (
    <div className="w-[320px] overflow-x-auto">
      <SearchOptionTabs
        selectedOption="title_content_comment"
        onChange={fn()}
      />
    </div>
  ),
};
