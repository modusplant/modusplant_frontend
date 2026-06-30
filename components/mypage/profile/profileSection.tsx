'use client';

import { useProfileMutation } from '@/lib/hooks/mypage/useProfileMutation';
import { useProfileForm } from '@/lib/hooks/mypage/useProfileForm';
import ProfileImageUploader from './profileImageUploader';
import ProfileFormFields from './profileFormFields';
import Button from '@/components/_common/button';
import { showModal } from '@/lib/store/modalStore';
import Image from 'next/image';
import FixedBottomButton from '@/components/_common/fixedBottomButton';

export default function ProfileSection() {
  // 프로필 수정 Mutation
  const { mutate: updateProfile, isPending } = useProfileMutation();

  // 폼 상태 관리
  const {
    formData,
    hasChanges,
    handleNicknameChange,
    handleIntroductionChange,
    handleImageSelect,
    handleImageDelete,
    createFormData,
  } = useProfileForm();

  // 저장 핸들러
  const handleSave = () => {
    if (!hasChanges) return;

    const data = createFormData();
    updateProfile(
      { formData: data },
      {
        onSuccess: () => {
          showModal({
            type: 'snackbar',
            description: '프로필이 성공적으로 수정되었습니다.',
          });
        },
        onError: (error) => {
          showModal({
            type: 'snackbar',
            description: error.message || '프로필 수정에 실패했습니다.',
          });
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 프로필 정보 카드 */}
      <div className="lg:border-surface-98 flex flex-col gap-7.5 rounded-xl bg-white lg:border lg:p-10">
        <h2 className="text-neutral-5 sr-only text-[18px] leading-[1.2] font-semibold tracking-[-0.01em] lg:not-sr-only">
          프로필 정보
        </h2>

        <div className="flex flex-col gap-10">
          {/* 프로필 이미지 업로더 */}
          <ProfileImageUploader
            imagePreview={formData.imagePreview}
            onImageSelect={handleImageSelect}
            onImageDelete={handleImageDelete}
          />

          {/* 닉네임 및 소개글 입력 필드 */}
          <ProfileFormFields
            nickname={formData.nickname}
            introduction={formData.introduction}
            onNicknameChange={handleNicknameChange}
            onIntroductionChange={handleIntroductionChange}
          />
        </div>
      </div>

      {/* 저장 버튼 */}
      <FixedBottomButton>
        <div className="border-surface-98 flex border-t lg:flex-col lg:items-end">
          <Button
            variant={hasChanges && !isPending ? 'point' : 'deactivate'}
            size="md"
            onClick={handleSave}
            disabled={!hasChanges || isPending}
            className="w-full rounded-lg py-3 text-[16px] font-semibold md:w-auto lg:h-12.5 lg:rounded-full lg:px-5 lg:text-[15px] lg:font-medium"
          >
            {isPending ? (
              <Image
                src={'/icon/loading.gif'}
                alt="Loading"
                width={20}
                height={20}
                unoptimized
              />
            ) : (
              '변경사항 저장'
            )}
          </Button>
        </div>
      </FixedBottomButton>
    </div>
  );
}
