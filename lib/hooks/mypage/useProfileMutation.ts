import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberApi } from '@/lib/api/client/member';
import { ProfileData } from '@/lib/types/member';
import { ApiResponse } from '@/lib/types/common';
import { useAuthStore } from '@/lib/store/authStore';
import { buildImageApiFilename } from '@/lib/constants/write';
import { showModal } from '@/lib/store/modalStore';
import {
  extractFileKeyFromImageUrl,
  uploadProfileImage,
} from '@/lib/api/client/profile';

interface ProfileMutationVariables {
  nickname: string;
  introduction: string;
  imageFile: File | null;
  shouldDeleteImage: boolean;
}

/**
 * 프로필 수정 React Query Mutation 훅
 *
 * @returns useMutation 결과 객체
 */
export function useProfileMutation() {
  const queryClient = useQueryClient();
  const { updateUser, user } = useAuthStore();

  return useMutation<ApiResponse<ProfileData>, Error, ProfileMutationVariables>(
    {
      mutationFn: async ({
        nickname,
        introduction,
        imageFile,
        shouldDeleteImage,
      }) => {
        const fileKey = imageFile
          ? (
              await uploadProfileImage(
                imageFile,
                buildImageApiFilename(0, imageFile)
              )
            ).fileKey
          : shouldDeleteImage
            ? undefined
            : extractFileKeyFromImageUrl(user?.image);

        return memberApi.updateProfile({
          nickname,
          introduction,
          fileKey,
        });
      },
      onSuccess: (data, variables) => {
        // 1. 프로필 쿼리 캐시 무효화 (최신 데이터 다시 가져오기)
        queryClient.invalidateQueries({
          queryKey: ['profile'],
        });

        // 2. authStore의 user 정보 업데이트
        if (data.data) {
          updateUser({
            nickname: data.data.nickname,
            image:
              data.data.imageUrl ||
              (variables.shouldDeleteImage ? null : (user?.image ?? null)),
            introduction: data.data.introduction,
          });
        }
      },
      onError: () => {
        showModal({
          type: 'snackbar',
          description: '프로필 수정에 실패했습니다.',
        });
      },
      retry: 0,
    }
  );
}
