'use client';

import Image from 'next/image';

export default function GlobalError({
  // error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              padding: '60px 0',
              textAlign: 'center',
            }}
          >
            <Image
              src="/character_sad.svg"
              alt="오류 발생"
              width={100}
              height={100}
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <h2
                style={{
                  color: '#212121',
                  fontSize: '16px',
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                잠시 문제가 생겼어요
              </h2>
              <p
                style={{
                  color: '#515151',
                  fontSize: '15px',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                예기치 못한 오류가 발생했어요.
                <br />
                다시 시도하거나 홈으로 돌아가보세요.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={reset}
                style={{
                  backgroundColor: '#3a972e',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '8px 16px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  height: '48px',
                }}
              >
                다시 시도
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                style={{
                  border: '1px solid #e9e9e9',
                  color: '#313131',
                  borderRadius: '9999px',
                  padding: '8px 24px',
                  fontSize: '16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  height: '48px',
                  boxSizing: 'border-box',
                }}
              >
                홈으로 가기
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
