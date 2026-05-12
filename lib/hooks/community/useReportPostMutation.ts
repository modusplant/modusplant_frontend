import { useMutation } from '@tanstack/react-query';
import { postApi } from '@/lib/api/client/post';
import { ApiError, ApiResponse } from '@/lib/types/common';
import { showModal } from '@/lib/store/modalStore';

/**
 * 게시글 신고 Mutation 훅
 *
 * @example
 * const { mutate, isPending } = useReportPostMutation();
 * mutate(postId);
 */
export const useReportPostMutation = () => {
  return useMutation<ApiResponse<void>, ApiError, string>({
    mutationFn: (postId: string) => postApi.reportPost(postId),
    onSuccess: () => {
      showModal({
        type: 'snackbar',
        description: '게시글 신고가 접수되었습니다.',
      });
    },
    onError: (error) => {
      if (error.status === 409) {
        showModal({
          type: 'snackbar',
          description: '이미 신고된 게시글 입니다.',
        });
        return;
      }

      showModal({
        type: 'snackbar',
        description: '게시글 신고에 실패했습니다.',
      });
    },
  });
};
