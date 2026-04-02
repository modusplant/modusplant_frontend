'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '@/lib/api/client/post';
import { PostWritePayload } from '@/lib/types/post';
import { showModal } from '@/lib/store/modalStore';

/**
 * 게시글 작성/수정 커스텀 훅
 * @param postId 수정 모드일 경우 게시글 ID
 */
export default function usePostWrite() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const showMsg = (message: string) => {
    showModal({ type: 'snackbar', description: message });
  };

  const handleError = (error: unknown) => {
    const _getErrorMessage = (err: unknown): string => {
      if (err instanceof Error) return err.message;
      return '알 수 없는 오류가 발생했습니다.';
    };

    const errorMessage = _getErrorMessage(error);
    showMsg(errorMessage);
  };

  // 게시글 작성 Mutation
  const createPostMutation = useMutation({
    mutationFn: (payload: PostWritePayload) => postApi.createPost(payload),
    onSuccess: (_, payload) => {
      if (payload.isPublished) {
        showMsg('게시글이 작성되었습니다.');
        router.push('/');
      } else {
        showMsg('임시 저장되었습니다.');
        queryClient.invalidateQueries({ queryKey: ['draftList'] });
      }
    },
    onError: handleError,
  });

  // 게시글 수정 Mutation
  type UpdatePostParams = { postId: string; payload: PostWritePayload };
  const updatePostMutation = useMutation({
    mutationFn: ({ postId, payload }: UpdatePostParams) =>
      postApi.updatePost(postId, payload),
    onSuccess: (_, { postId, payload }) => {
      if (payload.isPublished) {
        showMsg('게시글이 수정되었습니다.');
        router.push(`/community/${postId}`);
      } else {
        showMsg('임시 저장되었습니다.');
        queryClient.invalidateQueries({ queryKey: ['draftList'] });
      }
    },
    onError: handleError,
  });

  return {
    createPost: createPostMutation.mutate,
    updatePost: updatePostMutation.mutate,
  };
}
