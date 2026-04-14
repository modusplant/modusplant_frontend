import { postApi } from '@/lib/api/client/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteDraftMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postApi.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['draftList'] });
    },
    onError: (error) => {
      console.error('게시글 삭제 실패:', error);
    },
  });
};
