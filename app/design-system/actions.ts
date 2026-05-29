'use server';

import { applyDesignSystemFileEdit } from '@/lib/design-system/file-edit-service';
import type {
  DesignSystemFileEditRequest,
  DesignSystemFileEditResponse,
} from '@/lib/design-system/file-edit-contract';

export async function submitDesignSystemFileEdit(
  request: DesignSystemFileEditRequest
): Promise<DesignSystemFileEditResponse> {
  return applyDesignSystemFileEdit(request);
}
