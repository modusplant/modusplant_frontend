import { postApi } from '@/lib/api/client/post';
import { useQuery } from '@tanstack/react-query';

export const useDraftListQuery = (
  options: { page?: number; size?: number } = {}
) => {
  const { page = 1, size = 10 } = options;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['draftList', page, size],
    queryFn: () => postApi.getDraftList({ page, size }),
    select: ({ data }) => data,
  });

  return {
    drafts: data?.posts || [],
    draftCount: data?.totalElements || 0,
    isLoading,
    isError,
    refetchDrafts: refetch,
  };
};
