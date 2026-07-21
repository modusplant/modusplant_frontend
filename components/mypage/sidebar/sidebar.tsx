'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { showModal } from '@/lib/store/modalStore';
import { usePathname } from 'next/navigation';
import { MYPAGE_MENU_SECTIONS } from '@/lib/constants/mypage';
import { cn } from '@/lib/utils/tailwindHelper';
import Link from 'next/link';

export default function Sidebar() {
  const { logout } = useAuthStore();
  const pathname = usePathname();
  const isMenuPage = pathname === '/mypage/menu';

  const handleLogout = () => {
    showModal({
      type: 'two-button',
      title: '로그아웃 하시겠어요?',
      description: '메인페이지로 이동합니다.',
      buttonText: '로그아웃',
      onConfirm: () => {
        logout();
        window.location.href = '/';
      },
    });
  };

  return (
    <aside
      className={`${isMenuPage ? 'flex' : 'hidden'} lg:border-surface-98 mb-16.25 h-fit w-full shrink-0 flex-col gap-5 rounded-xl bg-white lg:mb-0 lg:flex lg:w-62 lg:border lg:p-8`}
    >
      {MYPAGE_MENU_SECTIONS.map((section, sectionIndex) => (
        <div
          key={section.title}
          className="flex flex-col gap-2.5 pt-5 first:pt-0 lg:pt-0"
        >
          {/* 섹션 제목 */}
          <div className="px-0 py-1">
            <span className="text-[14px] leading-[1.2] font-medium tracking-[-0.02em] text-neutral-50">
              {section.title}
            </span>
          </div>

          {/* 메뉴 아이템 */}
          <div className="flex flex-col">
            {section.items.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex rounded-[10px] px-0 py-3.25',
                    'text-[16px] leading-[1.19] tracking-[-0.02em]',
                    'transition-colors',
                    isActive && 'text-neutral-5 font-semibold',
                    !isActive && 'text-neutral-30 font-medium'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* 로그아웃 버튼을 마지막 섹션 목록에 붙여서 정렬 */}
            {sectionIndex === MYPAGE_MENU_SECTIONS.length - 1 && (
              <button
                onClick={handleLogout}
                className={cn(
                  'flex w-full rounded-[10px] px-0 py-3.25 text-left',
                  'text-[16px] leading-[1.19] tracking-[-0.02em]',
                  'text-neutral-30 cursor-pointer font-medium transition-colors'
                )}
              >
                로그아웃
              </button>
            )}
          </div>

          {/* 구분선 */}
          {sectionIndex < MYPAGE_MENU_SECTIONS.length - 1 && (
            <div className="bg-surface-stroke mt-2.5 h-px" />
          )}
        </div>
      ))}
    </aside>
  );
}
