import { useState, useCallback } from 'react';
import { ProfileFormData } from '@/lib/types/member';
import { useAuthStore } from '@/lib/store/authStore';

/**
 * 프로필 폼 상태 관리 훅
 *
 * @param initialData - 초기 프로필 데이터
 * @returns 폼 상태 및 핸들러 함수들
 */
export function useProfileForm() {
  const { user } = useAuthStore();
  const [prevUserId, setPrevUserId] = useState(user?.id);
  const [formData, setFormData] = useState<ProfileFormData>({
    nickname: user?.nickname || '',
    introduction: user?.introduction || '',
    imageFile: null,
    imagePreview: user?.image || null,
    shouldDeleteImage: false,
  });
  const [initialNickname, setInitialNickname] = useState(user?.nickname || '');

  if (user?.id !== prevUserId) {
    setPrevUserId(user?.id);
    setFormData((prev) => ({
      ...prev,
      nickname: user?.nickname || '',
      introduction: user?.introduction || '',
      imagePreview: user?.image || null,
    }));
    setInitialNickname(user?.nickname || '');
  }

  const [hasChanges, setHasChanges] = useState(false);

  // 닉네임 변경
  const handleNicknameChange = useCallback((nickname: string) => {
    setFormData((prev) => ({ ...prev, nickname }));
    setHasChanges(true);
  }, []);

  // 소개글 변경
  const handleIntroductionChange = useCallback((introduction: string) => {
    setFormData((prev) => ({ ...prev, introduction }));
    setHasChanges(true);
  }, []);

  // 이미지 파일 선택
  const handleImageSelect = useCallback((file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: previewUrl,
      shouldDeleteImage: false,
    }));
    setHasChanges(true);
  }, []);

  // 이미지 삭제
  const handleImageDelete = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      imageFile: null,
      imagePreview: null,
      shouldDeleteImage: true,
    }));
    setHasChanges(true);
  }, []);

  const commitSaved = useCallback(() => {
    setInitialNickname(formData.nickname);
    setHasChanges(false);
  }, [formData.nickname]);

  return {
    initialNickname,
    formData,
    hasChanges,
    handleNicknameChange,
    handleIntroductionChange,
    handleImageSelect,
    handleImageDelete,
    commitSaved,
  };
}
