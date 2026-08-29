import Link from 'next/link';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@/components/_common/button';

export default function WriteToButton() {
  return (
    <Link
      href="/community/write"
      className={buttonVariants({
        variant: 'point',
        className:
          'fixed right-8 bottom-8 z-50 gap-1 py-3.5 pr-5 pl-3 text-[15px] font-semibold lg:hidden',
      })}
    >
      <Plus className="h-5 w-5 text-white" strokeWidth={2.5} />
      글쓰기
    </Link>
  );
}
