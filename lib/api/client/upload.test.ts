import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/lib/api/instances/clientInstance', () => ({
  clientApiInstance: { post: vi.fn() },
}));

import { clientApiInstance } from '@/lib/api/instances/clientInstance';
import { uploadImageFile } from '@/lib/api/client/upload';

describe('uploadImageFile', () => {
  beforeEach(() => {
    vi.mocked(clientApiInstance.post).mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // 버그 재현: S3 PUT 단계에서만 실패해도 전체 발급(issuePresignedUrls)부터
  // 다시 시도한다. 만약 첫 PUT이 실제로는 S3에 성공적으로 저장됐지만 응답만
  // 못 받은 경우(네트워크 단절 등), 재시도가 새 fileKey를 발급받아 두 번째
  // 오브젝트를 만들게 되어 첫 번째 fileKey의 S3 오브젝트가 orphan으로 남는다.
  // PUT만 실패했을 때는 이미 발급받은 presigned URL을 재사용해야 한다.
  it('S3 PUT만 실패해도 presigned URL을 재발급받지 않고 같은 fileKey로 재시도해야 한다', async () => {
    vi.mocked(clientApiInstance.post).mockResolvedValue({
      status: 200,
      code: 'OK',
      message: 'ok',
      data: [
        {
          filename: 'image_0.jpg',
          uploadUrl: 'https://s3.example.com/key-1',
          fileKey: 'key-1',
        },
      ],
    });

    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('network error'))
      .mockResolvedValueOnce({ ok: true } as Response);
    vi.stubGlobal('fetch', fetchMock);

    const file = new File(['a'], 'a.jpg', { type: 'image/jpeg' });
    const result = await uploadImageFile(file, 'image_0.jpg');

    expect(result.fileKey).toBe('key-1');
    expect(clientApiInstance.post).toHaveBeenCalledTimes(1);
  });
});
