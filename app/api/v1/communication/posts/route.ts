import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/constants/apiInstance';

export const runtime = 'nodejs';

async function handler(request: NextRequest) {
  const search = request.nextUrl.search;
  const targetUrl = `${BASE_URL}/api/v1/communication/posts${search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'host') headers.set(key, value);
  });

  try {
    const method = request.method;
    const hasBody = method !== 'GET' && method !== 'HEAD';

    const response = await fetch(targetUrl, {
      method,
      headers,
      ...(hasBody && {
        body: request.body,
        duplex: 'half',
      }),
    });

    const responseText = await response.text();
    return new NextResponse(responseText, {
      status: response.status,
      headers: {
        'Content-Type':
          response.headers.get('content-type') || 'application/json',
      },
    });
  } catch {
    return NextResponse.json(
      { status: 500, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
