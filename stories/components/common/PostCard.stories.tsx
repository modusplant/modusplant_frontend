import PostCard from '@/components/_common/postCard';
import type { PostData } from '@/lib/types/post';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const basePost: PostData = {
  postId: 'post-1',
  primaryCategory: '일상',
  secondaryCategory: '관엽/야생화',
  nickname: '식물집사',
  title: '몬스테라 새 잎이 나왔어요',
  content: [
    {
      type: 'image',
      order: 1,
      filename: 'image_01.png',
      src: '/post/image_01.png',
    },
    {
      type: 'text',
      order: 2,
      filename: 'content.txt',
      data: '겨울 내내 조용하던 몬스테라가 드디어 새 잎을 보여줬어요. 빛과 물주기 기록을 함께 남깁니다.',
    },
  ],
  likeCount: 12,
  publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  commentCount: 3,
  isLiked: false,
  isBookmarked: false,
};

const meta = {
  title: 'Components/Common/PostCard',
  component: PostCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[320px] md:w-[360px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    post: basePost,
  },
};

export const LongTitle: Story = {
  args: {
    post: {
      ...basePost,
      postId: 'post-2',
      title:
        '초보 식집사가 겨울철 베고니아를 살리기 위해 시도한 물주기와 습도 관리 기록',
    },
  },
};

export const LongMetadata: Story = {
  args: {
    post: {
      ...basePost,
      postId: 'post-3',
      nickname: '아주긴닉네임을가진식물집사',
      likeCount: 9999,
      commentCount: 128,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
    },
  },
};

export const NoImageFallback: Story = {
  args: {
    post: {
      ...basePost,
      postId: 'post-4',
      content: [
        {
          type: 'text',
          order: 1,
          filename: 'content.txt',
          data: '이미지가 없는 게시글에서 기본 fallback 이미지가 안정적으로 보이는지 확인합니다.',
        },
      ],
    },
  },
};

export const Liked: Story = {
  args: {
    post: {
      ...basePost,
      postId: 'post-5',
      isLiked: true,
      likeCount: 13,
    },
  },
};

export const Bookmarked: Story = {
  args: {
    post: {
      ...basePost,
      postId: 'post-6',
      isBookmarked: true,
    },
  },
};

export const LoadingImageFallback: Story = {
  name: 'Image fallback candidate',
  args: {
    post: {
      ...basePost,
      postId: 'post-7',
      title: '이미지 로딩 전 fallback 기준 확인',
      content: [],
    },
  },
};

export const MobileViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  args: {
    post: basePost,
  },
};

