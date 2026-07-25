'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import usePostWrite from '@/lib/hooks/community/usePostWrite';
import { getTextContent, getImageContent } from '@/lib/utils/post';
import TitleField from '@/components/community/write/TitleField';
import ContentField from '@/components/community/write/ContentField';
import { ActionButtonField } from '@/components/community/write/ActionButtonField';
import ImageUploadField from '@/components/community/write/ImageUploadField';
import PostWriteHeader from '@/components/community/write/PostWriteHeader';
import CategorySelector from '@/components/community/write/CategorySelector';
import {
  DraftWriteFormSchema,
  type WriteFormData,
  WriteFormSchema,
} from '@/lib/schemas/writeForm';
import { ContentFilePayload, ContentPart, PostEditData } from '@/lib/types/post';
import { createUuid } from '@/lib/utils/uuid';
import { showModal } from '@/lib/store/modalStore';
import { useDraftListQuery } from '@/lib/hooks/community/useDraftListQuery';
import { DRAFT_INVALID_MESSAGE } from '@/lib/constants/write';
import { usePostQuery } from '@/lib/hooks/community/usePostQuery';
import { DraftListPopup } from '@/components/community/write/DraftListPopup';

const PostWritePage = () => {
  const { mode } = useParams<{ mode: string[] | undefined }>();

  // 수정 모드 확인 (URL: /community/write/edit/[postId])
  const postId = mode?.[1] ?? null; // postId가 존재하면 수정 모드
  const isEditMode = !!postId;

  const [isDraftPopupOpen, setIsDraftPopupOpen] = useState(false);
  const [draftPostId, setDraftPostId] = useState<string | null>(null);

  const { post } = usePostQuery(postId);
  const { createPost, updatePost } = usePostWrite();

  const { drafts, draftCount } = useDraftListQuery();
  const { post: draftPost } = usePostQuery(draftPostId);

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

  const { handleSubmit, reset, getValues } = form;

  const resetForm = useCallback(
    (post: PostEditData) => {
      // TODO: primary, secondCategoryId가 UUID로 구현되어있었으나 API 명세에 따르면 number로 내려옴
      // 추후 수정 필요
      reset({
        primaryCategoryId: post.primaryCategoryId?.toString() ?? '',
        secondaryCategoryId: post.secondaryCategoryId?.toString() ?? '',
        title: post.title ?? '',
        textContent: getTextContent(post.content ?? []),
        images: getImageContent(post.content ?? [])
          .filter((item): item is ContentPart & { src: string } => !!item.src)
          .map((item) => {
            const id = createUuid();
            const isThumbnail = item.filename === post.thumbnailFilename;
            return {
              id,
              content: item.src,
              isThumbnail,
              filename: item.filename,
              fileKey: item.fileKey,
              status: 'done' as const,
              isExisting: true,
            };
          }),
      });
    },
    [reset]
  );

  // 기존 게시글 데이터 가공
  useEffect(() => {
    if (!post) return;
    resetForm(post);
  }, [post, resetForm]);

  useEffect(() => {
    if (!draftPost) return;
    resetForm(draftPost);
  }, [draftPost, resetForm]);

  const buildWritePayload = ({
    data,
    isPublished,
  }: {
    data: WriteFormData;
    isPublished: boolean;
  }) => {
    // 업로드가 완료되어 fileKey/filename을 모두 가진 이미지만 제출 대상
    const uploadedImages = data.images.filter(
      (image): image is typeof image & { filename: string; fileKey: string } =>
        !!image.filename && !!image.fileKey
    );

    const contentFiles: ContentFilePayload[] = uploadedImages.map(
      (image, index) => ({
        order: index + 1,
        filename: image.filename,
        fileKey: image.fileKey,
      })
    );

    const thumbnailFilename = uploadedImages.find(
      ({ isThumbnail }) => isThumbnail
    )?.filename;

    return {
      primaryCategoryId: data.primaryCategoryId,
      secondaryCategoryId: data.secondaryCategoryId,
      title: data.title,
      contentText: data.textContent,
      contentFiles,
      thumbnailFilename,
      isPublished,
    };
  };

  const onValid = (data: WriteFormData) => {
    const payload = buildWritePayload({ data, isPublished: true });

    // 수정 모드 여부에 따라 적절한 Mutation 호출
    if (postId) return updatePost({ postId, payload });
    createPost(payload);
  };

  const handleDraftSave = () => {
    const values = getValues();
    const parseResult = DraftWriteFormSchema.safeParse(values);

    if (!parseResult.success) {
      const message = parseResult.error.issues[0].message;
      showModal({
        type: 'snackbar',
        description: message || DRAFT_INVALID_MESSAGE,
      });
      return;
    }

    const payload = buildWritePayload({
      data: parseResult.data,
      isPublished: false,
    });
    if (draftPostId) {
      updatePost({ postId: draftPostId, payload });
      return;
    }
    createPost(payload);
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
          <ActionButtonField
            isEditMode={isEditMode}
            draftCount={draftCount}
            onClickLoadDraft={() => setIsDraftPopupOpen(true)}
            onClickSaveDraft={handleDraftSave}
          />
        </form>
      </FormProvider>

      {isDraftPopupOpen && (
        <DraftListPopup
          isOpen={isDraftPopupOpen}
          onClose={() => setIsDraftPopupOpen(false)}
          drafts={drafts}
          onSelectDraft={(draftPostId) => {
            setDraftPostId(draftPostId);
            setIsDraftPopupOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default PostWritePage;
