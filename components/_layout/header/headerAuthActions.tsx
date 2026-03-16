import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/_common/button';
import Profile from '@/components/_common/profileImage';
import Dropdown from '@/components/_common/dropdown';
import { User } from '@/lib/types/auth';

interface HeaderAuthActionsProps {
  user: User;
  onLogout: () => void;
  showWriteButton?: boolean;
}

export default function HeaderAuthActions({
  user,
  onLogout,
  showWriteButton = true,
}: HeaderAuthActionsProps) {
  const router = useRouter();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    onLogout();
  };

  return (
    <>
      {/* 프로필 드롭다운 */}
      <Dropdown
        isOpen={isProfileDropdownOpen}
        onClose={() => setIsProfileDropdownOpen(false)}
        trigger={
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="relative flex h-9 w-9 cursor-pointer items-center rounded-full transition-opacity hover:opacity-80"
            aria-label="프로필 메뉴"
          >
            <Profile imageSrc={user?.image} />
          </button>
        }
        items={[
          {
            label: '마이페이지',
            onClick: () => router.push('/mypage'),
            textAlign: 'left',
          },
          {
            label: '내 활동',
            onClick: () => router.push('/mypage/recent'),
            textAlign: 'left',
          },
          {
            label: '로그아웃',
            onClick: handleLogout,
            textAlign: 'left',
          },
        ]}
        position="center"
        width="w-32"
      />

      {/* 글쓰기 버튼 */}
      {showWriteButton && (
        <Link href="/community/write">
          <Button variant="point" size="sm" className="h-9 rounded-full">
            글쓰기
          </Button>
        </Link>
      )}
    </>
  );
}
