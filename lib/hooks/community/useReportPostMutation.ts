import { useMutation } from '@tanstack/react-query';
import { postApi } from '@/lib/api/client/post';
import { ApiResponse } from '@/lib/types/common';
import { showModal } from '@/lib/store/modalStore';

/**
 * 게시글 신고 Mutation 훅
 *
 * @example
 * const { mutate, isPending } = useReportPostMutation();
 * mutate(postId);
 */
export const useReportPostMutation = (callbacks?: {
  onSuccess?: () => void;
}) => {
  return useMutation<ApiResponse<void>, Error, string>({
    mutationFn: (postId: string) => postApi.reportPost(postId),
    onSuccess: () => {
      callbacks?.onSuccess?.();
      showModal({
        type: 'snackbar',
        description: '게시글 신고가 접수되었습니다.',
      });
    },
    onError: () => {
      showModal({
        type: 'snackbar',
        description: '게시글 신고에 실패했습니다.',
      });
    },
  });
};
