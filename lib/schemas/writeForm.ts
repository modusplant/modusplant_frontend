import z from 'zod';
import { MAX_TITLE_LENGTH } from '../constants/write';

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
  images: z.array(z.union([z.instanceof(File), z.string()])),
});

export type WriteFormData = z.infer<typeof WriteFormSchema>;
