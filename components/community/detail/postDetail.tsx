import PostContent from './postContent';
import PostActions from './postActions';
import CommentSection from '../../comment/commentSection';
import PostDetailHeader from './postDetailHeader';
import { PostDetail as PostDetailType } from '@/lib/types/post';

interface PostDetailProps {
  postId: string;
  initialData: PostDetailType;
}

export default function PostDetail({ postId, initialData }: PostDetailProps) {
  return (
    <div className="mx-auto max-w-212 px-5 py-12">
      {/* 헤더: 카테고리 + 작성자 정보 */}
      <PostDetailHeader
        secondaryCategory={initialData.secondaryCategory}
        title={initialData.title}
        authorImageUrl={initialData.authorImageUrl}
        nickname={initialData.nickname}
        publishedAt={initialData.publishedAt}
        viewCount={initialData.viewCount}
        isUpdated={initialData.publishedAt !== initialData.updatedAt}
      />

      {/* 본문 */}
      <PostContent content={initialData.content} />

      {/* 액션 버튼 */}
      <div className="mt-12 pt-6">
        <PostActions
          postId={postId}
          authorId={initialData.authorId}
          initialLikeCount={initialData.likeCount}
          initialIsLiked={initialData.isLiked}
          initialIsBookmarked={initialData.isBookmarked}
        />
      </div>

      {/* 댓글 섹션 */}
      <CommentSection postId={postId} />
    </div>
  );
}
