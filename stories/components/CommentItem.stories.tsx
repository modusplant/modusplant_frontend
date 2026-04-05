import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import CommentItem from '@/components/comment/commentItem';
import { useAuthStore } from '@/lib/store/authStore';
import type { Comment } from '@/lib/types/comment';

// ── 공통 mock 데이터 ──────────────────────────────────────
const baseComment: Comment = {
  nickname: '아무개',
  path: '1',
  content: '오늘 물을 너무 많이 줬나봐요. 잎이 노래지고 있어요 😢',
  likeCount: 5,
  createdAt: '2025-03-20T10:00:00',
  updatedAt: '2025-03-20T10:00:00',
  isDeleted: false,
  isLiked: false,
  profileImagePath: undefined,
  children: [],
};

const commentWithReplies: Comment = {
  ...baseComment,
  path: '1',
  children: [
    {
      nickname: '식물집사',
      path: '1.1',
      content: '과습일 가능성이 높아요! 흙이 마를 때까지 물을 주지 마세요.',
      likeCount: 3,
      createdAt: '2025-03-20T11:00:00',
      updatedAt: '2025-03-20T11:00:00',
      isDeleted: false,
      isLiked: true,
      profileImagePath: undefined,
      children: [],
      depth: 1,
    },
  ],
};

const deletedComment: Comment = {
  ...baseComment,
  isDeleted: true,
};

// ── Meta ──────────────────────────────────────────────────
const meta = {
  title: 'Components/Comment/CommentItem',
  component: CommentItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    postId: 'post-123',
    refetch: fn(),
  },
} satisfies Meta<typeof CommentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ───────────────────────────────────────────────

// 기본 댓글 (비로그인)
export const Default: Story = {
  args: {
    comment: baseComment,
  },
};

// 내 댓글 (로그인 + 작성자 본인)
export const MyComment: Story = {
  args: {
    comment: { ...baseComment, nickname: '작성자 본인' },
  },
  beforeEach: () => {
    // 스토리 렌더링 전에 Zustand 스토어 상태 주입
  },
  decorators: [
    (Story) => {
      useAuthStore.setState({
        user: {
          id: 'user-1',
          nickname: '작성자 본인', // comment.nickname과 일치 → isMyComment = true
          email: 'user@test.com',
          image: null,
          introduction: null,
          role: '',
        },
        isAuthenticated: true,
      });
      return <Story />;
    },
  ],
};

// 타인 댓글 (로그인 상태지만 작성자 아님)
export const OtherComment: Story = {
  args: {
    comment: { ...baseComment, nickname: '다른유저' },
  },
  beforeEach: () => {
    useAuthStore.setState({
      user: {
        id: 'user-2',
        nickname: '다른유저1', // comment.nickname과 불일치 → isMyComment = false
        email: 'other@test.com',
        image: null,
        introduction: null,
        role: '',
      },
      isAuthenticated: true,
    });
  },
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

// 좋아요 누른 상태
export const Liked: Story = {
  args: {
    comment: {
      ...baseComment,
      isLiked: true,
      likeCount: 6,
    },
  },
};

// 수정된 댓글
export const Updated: Story = {
  args: {
    comment: {
      ...baseComment,
      content: '이 댓글은 수정되었어요!',
      updatedAt: '2025-03-21T10:00:00',
    },
  },
};

// 답글 있는 댓글
export const WithReplies: Story = {
  args: {
    comment: commentWithReplies,
  },
};

// 삭제된 댓글
export const Deleted: Story = {
  args: {
    comment: deletedComment,
  },
};
