import { useMutation } from '@tanstack/react-query';
import { memberApi } from '@/lib/api/client/member';
import { ReportFormValues } from '@/components/mypage/report/ReportSection';
import { ApiResponse } from '@/lib/types/common';
import { showModal } from '@/lib/store/modalStore';
import { useRouter } from 'next/navigation';
import { uploadReportImage } from '@/lib/api/client/report';
import { buildImageApiFilename } from '@/lib/constants/write';

export const useBugReportMutation = (callbacks?: {
  onSuccess?: () => void;
}) => {
  const router = useRouter();

  return useMutation<ApiResponse<void>, Error, ReportFormValues>({
    mutationFn: async (formData: ReportFormValues) => {
      const fileKeys = formData.image
        ? [
            (
              await uploadReportImage(
                formData.image,
                buildImageApiFilename(0, formData.image)
              )
            ).fileKey,
          ]
        : [];

      return memberApi.postBugReport({
        title: formData.title,
        content: formData.content,
        fileKeys,
      });
    },
    onSuccess: () => {
      callbacks?.onSuccess?.();
      showModal({
        type: 'snackbar',
        description: '건의/버그 제보 제출이 완료되었습니다.',
      });
      router.push('/mypage/profile');
    },
    onError: () => {
      showModal({
        type: 'snackbar',
        description: '건의/버그 제보 제출에 실패했습니다.',
      });
    },
  });
};
