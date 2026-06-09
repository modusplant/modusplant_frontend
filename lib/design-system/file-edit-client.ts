import type {
  DesignSystemFileEditCapabilities,
  DesignSystemFileEditRequest,
  DesignSystemFileEditResponse,
} from '@/lib/design-system/file-edit-contract';

export async function getDesignSystemFileEditClientCapabilities(
  signal?: AbortSignal
) {
  const response = await fetch('/api/design-system/file-edits', {
    method: 'GET',
    signal,
  });

  if (!response.ok) {
    throw new Error('Failed to load design-system file edit capabilities.');
  }

  return (await response.json()) as DesignSystemFileEditCapabilities;
}

export async function requestDesignSystemFileEdit(
  request: DesignSystemFileEditRequest,
  signal?: AbortSignal
) {
  const response = await fetch('/api/design-system/file-edits', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    signal,
  });

  const payload = (await response.json()) as DesignSystemFileEditResponse;

  if (!response.ok || !payload.ok) {
    throw new Error(payload.message ?? 'Design-system file edit failed.');
  }

  return payload;
}
