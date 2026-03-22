import Link from 'next/link';
import Image from 'next/image';

interface HeaderLogoProps {
  isRootPath: boolean;
  scrolled?: boolean;
}

export default function HeaderLogo({
  isRootPath,
  scrolled = false,
}: HeaderLogoProps) {
  const logo =
    isRootPath && !scrolled
      ? '/logo_favicon/Logo_v2_white.svg'
      : '/logo_favicon/Logo_v2_black.svg';

  return (
    <Link href="/" className="transition-opacity hover:opacity-80">
      <Image
        src={logo}
        alt="모두의식물 로고"
        width={117}
        height={26}
        priority
      />
    </Link>
  );
}
