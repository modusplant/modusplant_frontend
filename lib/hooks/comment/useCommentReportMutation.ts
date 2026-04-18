import { useMutation } from '@tanstack/react-query';
import { memberApi } from '@/lib/api/client/member';
import { ApiResponse } from '@/lib/types/common';
import { showModal } from '@/lib/store/modalStore';

interface PostCommentReportParams {
  postUlid: string;
  path: string;
}

/**
 * 댓글 신고 Mutation 훅
 */
export const useCommentReportMutation = (callbacks?: {
  onSuccess?: () => void;
}) => {
  return useMutation<ApiResponse<void>, Error, PostCommentReportParams>({
    mutationFn: async ({ postUlid, path }) => {
      return memberApi.postCommentReport(postUlid, path);
    },
    onSuccess: () => {
      callbacks?.onSuccess?.();
      showModal({
        type: 'snackbar',
        description: '댓글 신고가 접수되었습니다.',
      });
    },
    onError: (error) => {
      showModal({
        type: 'snackbar',
        description: error.message || '댓글 신고에 실패했습니다.',
      });
    },
  });
};
