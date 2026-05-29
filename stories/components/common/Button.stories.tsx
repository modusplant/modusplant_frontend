import Button from '@/components/_common/button';
import { Plus, Trash2 } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta = {
  title: 'Components/Common/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Button migration phase 1 baseline입니다. 신규 variant를 지원하되 point/point2/deactivate는 deprecated alias로 유지합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'tertiary',
        'ghost',
        'danger',
        'default',
        'point',
        'point2',
        'deactivate',
      ],
      description:
        '신규 variant와 deprecated alias를 함께 지원합니다. point→primary, point2→tertiary, deactivate→disabled fallback.',
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
    loading: {
      control: 'boolean',
      description: '로딩 상태. disabled와 aria-busy가 함께 적용됩니다.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: '버튼 내부 콘텐츠',
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    a11y: {
      test: 'error',
    },
  },
  args: {
    children: '기본 버튼',
    variant: 'default',
    size: 'md',
    fullWidth: false,
    disabled: false,
    loading: false,
  },
};

export const Primary: Story = {
  args: {
    children: '등록하기',
    variant: 'primary',
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

export const Tertiary: Story = {
  args: {
    children: '수정하기',
    variant: 'tertiary',
    size: 'md',
  },
};

export const Ghost: Story = {
  parameters: {
    a11y: {
      test: 'error',
    },
  },
  args: {
    children: '건너뛰기',
    variant: 'ghost',
    size: 'md',
  },
};

export const Danger: Story = {
  args: {
    children: '삭제하기',
    variant: 'danger',
    size: 'md',
  },
};

export const Disabled: Story = {
  parameters: {
    a11y: {
      test: 'error',
    },
  },
  args: {
    children: '비활성 버튼',
    variant: 'primary',
    disabled: true,
  },
};

export const Loading: Story = {
  parameters: {
    a11y: {
      test: 'error',
    },
  },
  args: {
    children: '저장 중',
    variant: 'primary',
    loading: true,
  },
};

export const FocusVisible: Story = {
  args: {
    children: 'Tab으로 포커스',
    variant: 'primary',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    const button = await canvas.findByRole('button', {
      name: 'Tab으로 포커스',
    });

    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalled();
  },
};

export const IconOnly: Story = {
  parameters: {
    a11y: {
      test: 'error',
    },
  },
  render: () => (
    <Button variant="primary" size="sm" aria-label="새 글 작성">
      <Plus className="h-4 w-4" aria-hidden="true" />
    </Button>
  ),
};

export const LongLabel: Story = {
  args: {
    children: '아주 긴 버튼 라벨이 들어왔을 때 줄바꿈과 너비를 확인합니다',
    variant: 'primary',
    size: 'md',
    className: 'max-w-80 whitespace-normal text-center',
  },
};

export const FullWidth: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => (
    <div className="w-[320px]">
      <Button variant="primary" fullWidth>
        모바일 전체 너비 CTA
      </Button>
    </div>
  ),
};

export const DestructiveIconLabel: Story = {
  render: () => (
    <Button variant="danger" aria-label="게시글 삭제">
      <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
      삭제
    </Button>
  ),
};

export const LegacyPoint: Story = {
  name: 'Legacy / point → primary',
  args: {
    children: '기존 point',
    variant: 'point',
  },
};

export const LegacyPoint2: Story = {
  name: 'Legacy / point2 → tertiary',
  args: {
    children: '기존 point2',
    variant: 'point2',
  },
};

export const LegacyDeactivate: Story = {
  name: 'Legacy / deactivate → disabled fallback',
  parameters: {
    a11y: {
      test: 'error',
    },
  },
  args: {
    children: '기존 deactivate',
    variant: 'deactivate',
  },
};
