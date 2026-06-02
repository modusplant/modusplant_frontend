'use client';

import Image from 'next/image';
import Link from 'next/link';

interface StateMessageProps {
  /**
   * 캐릭터 이미지 경로
   * @default "/character.svg"
   */
  imageSrc?: string;
  /**
   * 주요 메시지 (강조)
   */
  title: string;
  /**
   * 부가 설명 (여러 줄 가능)
   */
  description: string;
  /**
   * 버튼 텍스트
   */
  buttonText?: string;
  /**
   * 버튼 클릭 시 이동할 경로
   */
  buttonHref?: string;
}

/**
 * 상태 안내 메시지 컴포넌트
 *
 * 이미지, 제목, 설명, CTA 버튼을 조합하여
 * 사용자에게 현재 상태를 안내합니다.
 *
 * 사용 예시
 * - 빈 상태 (데이터 없음)
 * - 로그인 필요
 * - 404 페이지
 * - 에러 상태
 * - 처리 중 상태
 *
 * @example
 * ```tsx
 * <StateMessage
 *   title="최근 본 식물 기록이 없어요!"
 *   description="초록빛 가득한 이야기들을 탐색하고\n나만의 식물 아카이브를 채워보세요."
 *   buttonText="둘러보기"
 *   buttonHref="/"
 * />
 * ```
 */
export default function StateMessage({
  imageSrc = '/character.svg',
  title,
  description,
  buttonText,
  buttonHref,
}: StateMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-15">
      {/* 캐릭터 이미지 */}
      <div className="relative h-25 w-25">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-contain"
          loading="lazy"
        />
      </div>

      {/* 안내 문구 */}
      <div className="flex flex-col items-center gap-3">
        <h3 className="text-neutral-10 text-base leading-[1.19] font-semibold tracking-[-0.02em]">
          {title}
        </h3>
        <p className="text-neutral-40 text-center text-[15px] leading-normal font-normal tracking-[-0.02em]">
          {description.split('\\n').map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </div>

      {/* CTA 버튼 */}
      {buttonText && buttonHref && (
        <Link
          href={buttonHref}
          className="border-surface-stroke text-neutral-20 flex h-12 items-center justify-center gap-2.25 rounded-[31px] border px-6 py-4 text-base leading-[1.2] font-medium tracking-[-0.03em]"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
}
