import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import PrimaryCategoryFilter from '@/components/_common/primaryCategoryFilter';
import SecondaryCategoryFilter from '@/components/_common/secondaryCategoryFilter';
import { expect, userEvent, within } from 'storybook/test';

const meta = {
  title: 'Components/Common/CategoryFilter',
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const PrimaryFilter: Story = {
  render: function PrimaryFilterStory() {
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');

    return (
      <div className="w-80 p-6">
        <PrimaryCategoryFilter
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={setSelectedCategoryId}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByRole('button', { name: '전체' });

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowDown}');
    const firstOption = await canvas.findByRole('option', { name: '전체' });

    await expect(firstOption).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(canvas.getAllByRole('option').at(-1)).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

export const SecondaryFilterMultiSelect: Story = {
  render: function SecondaryFilterMultiSelectStory() {
    const [selectedCategoryIds, setSelectedCategoryIds] = useState(['all']);

    return (
      <div className="w-96 p-6">
        <SecondaryCategoryFilter
          primaryCategoryId="1"
          selectedCategoryIds={selectedCategoryIds}
          onCategoriesChange={setSelectedCategoryIds}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByRole('button', { name: '전체' });

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowDown}');
    const firstOption = await canvas.findByRole('option', { name: '전체' });

    await expect(firstOption).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

export const WriteSelectorPair: Story = {
  render: function WriteSelectorPairStory() {
    const [primaryCategoryId, setPrimaryCategoryId] = useState('');
    const [secondaryCategoryIds, setSecondaryCategoryIds] = useState<string[]>(
      []
    );

    return (
      <div className="flex w-80 flex-col gap-4 p-6">
        <PrimaryCategoryFilter
          variant="selector"
          showAll={false}
          selectedCategoryId={primaryCategoryId}
          onCategoryChange={(categoryId) => {
            setPrimaryCategoryId(categoryId);
            setSecondaryCategoryIds([]);
          }}
        />
        <SecondaryCategoryFilter
          variant="selector"
          multiSelect={false}
          showAll={false}
          primaryCategoryId={primaryCategoryId}
          selectedCategoryIds={secondaryCategoryIds}
          onCategoriesChange={setSecondaryCategoryIds}
        />
      </div>
    );
  },
};
