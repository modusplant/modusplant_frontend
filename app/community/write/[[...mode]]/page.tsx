'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import usePostWrite from '@/lib/hooks/community/usePostWrite';
import { postApi } from '@/lib/api/client/post';
import { getTextContent, getImageContent } from '@/lib/utils/post';
import TitleField from '@/components/community/write/TitleField';
import ContentField from '@/components/community/write/ContentField';
import ActionButtonField from '@/components/community/write/ActionButtonField';
import ImageUploadField from '@/components/community/write/ImageUploadField';
import PostWriteHeader from '@/components/community/write/PostWriteHeader';
import CategorySelector from '@/components/community/write/CategorySelector';
import { type WriteFormData, WriteFormSchema } from '@/lib/schemas/writeForm';
import { ContentPart } from '@/lib/types/post';

const PostWritePage = () => {
  const { mode } = useParams<{ mode: string[] | undefined }>();

  // 수정 모드 확인 (URL: /community/write/edit/[postId])
  const postId = mode?.[1]; // postId가 존재하면 수정 모드
  const isEditMode = !!postId;

  // 수정 모드일 경우 기존 데이터 로드
  const { data: post } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => {
      // postId가 없으면 API 호출하지 않음
      if (!postId) return Promise.reject(new Error('게시글 ID가 필요합니다.'));
      return postApi.getEditPostDetail(postId);
    },
    enabled: isEditMode,
    select: (data) => data.data, // API 응답에서 실제 게시글 데이터만 선택
  });

  const form = useForm<WriteFormData>({
    resolver: zodResolver(WriteFormSchema),
    mode: 'onChange',
    defaultValues: {
      primaryCategoryId: '',
      secondaryCategoryId: '',
      title: '',
      textContent: '',
      images: [],
    },
  });

  const { handleSubmit, reset } = form;

  // 기존 게시글 데이터 가공
  useEffect(() => {
    if (!post) return undefined;

    const {
      content,
      primaryCategoryId,
      secondaryCategoryId,
      title,
      thumbnailFilename,
    } = post;

    reset({
      primaryCategoryId,
      secondaryCategoryId,
      title,
      textContent: getTextContent(content),
      images: getImageContent(content)
        .filter((item): item is ContentPart & { src: string } => !!item.src)
        .map(({ src, filename }) => ({
          id: crypto.randomUUID(),
          content: src,
          isThumbnail: filename == thumbnailFilename,
        })),
    });
  }, [post, reset]);

  const { createMutation, updateMutation } = usePostWrite(postId);

  const onValid = (data: WriteFormData) => {
    const payload = {
      primaryCategoryId: data.primaryCategoryId,
      secondaryCategoryId: data.secondaryCategoryId,
      title: data.title,
      textContent: data.textContent,
      images: data.images.map(({ content }) => content),
    };

    // 수정 모드 여부에 따라 적절한 Mutation 호출
    if (isEditMode) return updateMutation.mutate(payload);
    createMutation.mutate(payload);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-full flex-col gap-5 bg-neutral-100 px-4 py-5 md:px-8 lg:w-212 lg:px-10">
      <PostWriteHeader isEditMode={isEditMode} />
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(onValid)}
          className="flex flex-col gap-4 self-stretch"
        >
          <CategorySelector isEditMode={isEditMode} />
          <TitleField />
          <div className="border-surface-stroke flex w-full flex-col self-stretch rounded-[10px] border">
            <ContentField />
            <ImageUploadField />
          </div>
          <ActionButtonField isEditMode={isEditMode} />
        </form>
      </FormProvider>
    </div>
  );
};

export default PostWritePage;
