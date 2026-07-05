import { notFound } from 'next/navigation';
import PostDetail from '@/components/community/detail/postDetail';
import { serverPostApi } from '@/lib/api/server/post';
import {
  createPostMetadata,
  notFoundPostMetadata,
  errorPostMetadata,
} from '@/lib/metadata/community';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 게시글 상세 페이지 메타데이터 생성
 */
export async function generateMetadata({ params }: PostPageProps) {
  const { id } = await params;
  try {
    const response = await serverPostApi.getPostDetail(id);
    if (!response.data) {
      return notFoundPostMetadata;
    }

    return createPostMetadata(response.data);
  } catch (error) {
    return errorPostMetadata;
  }
}

/**
 * 게시글 상세 페이지
 */
export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  try {
    // 서버에서 초기 게시글 데이터 fetch
    const response = await serverPostApi.getPostDetail(id);

    if (!response.data || response.status !== 200) {
      notFound();
    }

    // TODO: Error: Avoid constructing JSX within try/catch 해결하기
    return <PostDetail postId={id} initialData={response.data} />;
  } catch (error) {
    notFound();
  }
}
