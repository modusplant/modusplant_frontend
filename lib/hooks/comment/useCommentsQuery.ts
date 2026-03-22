import { useQuery } from '@tanstack/react-query';
import { commentApi } from '@/lib/api/client/comment';
import { Comment } from '@/lib/types/comment';
import { getFullImageUrl } from '@/lib/utils/image';

interface UseCommentsQueryProps {
  postId: string;
}

interface UseCommentsQueryReturn {
  comments: Comment[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useCommentsQuery({
  postId,
}: UseCommentsQueryProps): UseCommentsQueryReturn {
  const {
    data: comments = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await commentApi.getComments(postId);
      const rawComments = response.data || [];

      // profileImagePath를 전체 URL로 변환
      return rawComments.map((comment) => ({
        ...comment,
        profileImagePath:
          getFullImageUrl(comment.profileImagePath) || comment.profileImagePath,
      }));
    },
  });

  return {
    comments,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
