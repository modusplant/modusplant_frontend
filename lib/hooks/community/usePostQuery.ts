import { postApi } from '@/lib/api/client/post';
import { skipToken, useQuery } from '@tanstack/react-query';

export const usePostQuery = (postId: string | null) => {
  const { data } = useQuery({
    queryKey: ['post', postId],
    queryFn: postId ? () => postApi.getEditPostDetail(postId) : skipToken,
    select: ({ data }) => data,
  });

  return { post: data };
};
