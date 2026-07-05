import z from 'zod';
import { MAX_TITLE_LENGTH } from '../constants/write';

export const WriteImageSchema = z.object({
  id: z.uuidv4(),
  content: z.union([z.instanceof(File), z.string()]),
  isThumbnail: z.boolean(),
});

export const WriteFormSchema = z.object({
  primaryCategoryId: z.string().nonempty('1차 카테고리를 선택해주세요.'),
  secondaryCategoryId: z.string().nonempty('2차 카테고리를 선택해주세요.'),
  title: z
    .string()
    .trim()
    .nonempty('제목을 입력해주세요.')
    .max(
      MAX_TITLE_LENGTH,
      `제목은 최대 ${MAX_TITLE_LENGTH}자까지 입력 가능합니다.`
    ),
  textContent: z.string().trim().nonempty('본문 내용을 입력해주세요.'),
  images: z.array(WriteImageSchema),
});

export const DraftWriteFormSchema = z
  .object({
    primaryCategoryId: z.string(),
    secondaryCategoryId: z.string(),
    title: z
      .string()
      .trim()
      .max(
        MAX_TITLE_LENGTH,
        `제목은 최대 ${MAX_TITLE_LENGTH}자까지 입력 가능합니다.`
      ),
    textContent: z.string().trim(),
    images: z.array(WriteImageSchema),
  })
  .refine(({ title, textContent }) => !!title.trim() || !!textContent.trim(), {
    message: '제목 또는 본문을 입력해주세요.',
    path: ['title'],
  });

export type WriteImageData = z.infer<typeof WriteImageSchema>;
export type WriteFormData = z.infer<typeof WriteFormSchema>;
