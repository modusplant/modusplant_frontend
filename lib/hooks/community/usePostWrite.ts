'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { postApi } from '@/lib/api/client/post';
import { PostWritePayload } from '@/lib/types/post';
import { showModal } from '@/lib/store/modalStore';

/**
 * 게시글 작성/수정 커스텀 훅
 * @param postId 수정 모드일 경우 게시글 ID
 */
export default function usePostWrite(postId?: string) {
  const router = useRouter();

  const showMsg = (message: string) => {
    showModal({ type: 'snackbar', description: message });
  };

  // 게시글 작성 Mutation
  const createMutation = useMutation({
    mutationFn: (payload: PostWritePayload) => postApi.createPost(payload),
    onSuccess: () => {
      showMsg('게시글이 등록되었습니다.');
      router.push('/');
    },
    onError: (error) => {
      console.error('게시글 작성 실패:', error);
      showMsg(error.message);
    },
  });

  // 게시글 수정 Mutation
  const updateMutation = useMutation({
    mutationFn: (payload: PostWritePayload) => {
      if (!postId) return Promise.reject(new Error('게시글 ID가 필요합니다.'));
      return postApi.updatePost(postId, payload);
    },
    onSuccess: () => {
      showMsg('게시글이 수정되었습니다.');
      router.push(`/community/${postId}`);
    },
    onError: (error) => {
      console.error('게시글 수정 실패:', error);
      showMsg(error.message);
    },
  });

  return { createMutation, updateMutation };
}
