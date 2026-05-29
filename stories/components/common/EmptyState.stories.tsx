import EmptyState from '@/components/_common/emptyState';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Common/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '아직 게시글이 없어요',
    description: '초록빛 가득한 이야기를 둘러보고\\n나만의 식물 기록을 채워보세요.',
    buttonText: '둘러보기',
    buttonHref: '/',
  },
};

export const WithCTA: Story = {
  args: {
    title: '작성한 글이 없어요',
    description: '처음 키우는 식물 이야기부터 가볍게 남겨보세요.',
    buttonText: '글 쓰러 가기',
    buttonHref: '/community/write',
  },
};

export const LongMessage: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  args: {
    title: '검색 결과가 없습니다',
    description:
      '입력한 검색어와 선택한 카테고리에 맞는 게시글을 찾지 못했어요.\\n검색어를 조금 더 짧게 바꾸거나 필터를 초기화해 다시 탐색해 보세요.',
    buttonText: '필터 초기화',
    buttonHref: '/search',
  },
};

