import { NextRequest, NextResponse } from 'next/server';

/**
 * 이미지 프록시 API Route
 * CORS 문제를 해결하기 위해 서버 사이드에서 이미지를 가져옴
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // 외부 이미지 서버에서 이미지 가져오기
    const response = await fetch(imageUrl, {
      headers: {
        // User-Agent 등 필요한 헤더 추가
        'User-Agent': 'ModusPlant/1.0',
      },
    });

    if (!response.ok) {
      console.error(
        'Image fetch failed:',
        response.status,
        response.statusText
      );
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` },
        { status: response.status }
      );
    }

    // 이미지 데이터를 blob으로 가져오기
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    // Content-Type 헤더 설정
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // 이미지 반환
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
