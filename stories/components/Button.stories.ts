import Button from '@/components/_common/button';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import '../../app/globals.css';

import { fn } from 'storybook/test';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'point', 'point2', 'secondary', 'deactivate'],
      description: `버튼 variant
- default: 기본 스타일 (흰색 배경, 테두리)
- point: 강조 스타일 (primary green 배경)
- point2: 강조 스타일2 (primary green 테두리)
- secondary: 보조 스타일 (회색 배경)
- deactivate: 비활성화 스타일 (회색 배경)`,
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: '버튼 크기',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비 사용 여부',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '버튼 비활성화 여부',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: '버튼 내부에 들어갈 콘텐츠',
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '기본 버튼',
    variant: 'default',
    size: 'md',
    fullWidth: false,
    disabled: false,
  },
};

export const Point: Story = {
  args: {
    children: '포인트 버튼',
    variant: 'point',
    size: 'md',
  },
};

export const Point2: Story = {
  args: {
    children: '포인트 버튼 2',
    variant: 'point2',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: '보조 버튼',
    variant: 'secondary',
    size: 'md',
  },
};

export const Deactivate: Story = {
  args: {
    children: '비활성 스타일',
    variant: 'deactivate',
    size: 'md',
  },
};

export const FullWidth: Story = {
  args: {
    children: '전체 너비 버튼',
    variant: 'default',
    size: 'md',
    fullWidth: true,
  },
};
