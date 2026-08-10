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

  // 버그 재현: 같은 presigned URL로 재시도까지 했는데도 서명 만료로 보이는
  // 에러(403)로 실패하면, 그때는 presigned URL을 재발급받아 마지막으로 한 번
  // 더 재시도해야 한다. PUT 실패 시 무조건 같은 URL로만 재시도하면, 실제로
  // presigned URL이 만료된 경우 영영 성공할 수 없다.
  it('같은 URL로 재시도까지 403으로 실패하면 presigned URL을 재발급받아 재시도해야 한다', async () => {
    vi.mocked(clientApiInstance.post)
      .mockResolvedValueOnce({
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
      })
      .mockResolvedValueOnce({
        status: 200,
        code: 'OK',
        message: 'ok',
        data: [
          {
            filename: 'image_0.jpg',
            uploadUrl: 'https://s3.example.com/key-2',
            fileKey: 'key-2',
          },
        ],
      });

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 403 } as Response)
      .mockResolvedValueOnce({ ok: false, status: 403 } as Response)
      .mockResolvedValueOnce({ ok: true } as Response);
    vi.stubGlobal('fetch', fetchMock);

    const file = new File(['a'], 'a.jpg', { type: 'image/jpeg' });
    const result = await uploadImageFile(file, 'image_0.jpg');

    expect(result.fileKey).toBe('key-2');
    expect(clientApiInstance.post).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
