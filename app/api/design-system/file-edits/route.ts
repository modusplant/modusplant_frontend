import { NextRequest, NextResponse } from 'next/server';

import {
  applyDesignSystemFileEdit,
  getDesignSystemFileEditCapabilities,
} from '@/lib/design-system/file-edit-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function forwardToRemoteFileEditServer(payload: unknown) {
  const endpoint = process.env.DESIGN_SYSTEM_FILE_EDIT_ENDPOINT;

  if (!endpoint) {
    return null;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.DESIGN_SYSTEM_FILE_EDIT_TOKEN
        ? {
            Authorization: `Bearer ${process.env.DESIGN_SYSTEM_FILE_EDIT_TOKEN}`,
          }
        : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}

export async function GET() {
  return NextResponse.json(getDesignSystemFileEditCapabilities());
}

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        backend: getDesignSystemFileEditCapabilities().backend,
        mode: 'dryRun',
        applied: false,
        results: [],
        message: 'Request body must be valid JSON.',
      },
      { status: 400 }
    );
  }

  const remoteResponse = await forwardToRemoteFileEditServer(payload);

  if (remoteResponse) {
    return remoteResponse;
  }

  const result = await applyDesignSystemFileEdit(payload);

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
