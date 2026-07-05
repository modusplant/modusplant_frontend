import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MobileSubHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <div className="border-surface-stroke sticky top-0 z-50 flex items-center border-b bg-white md:hidden">
      <button className="flex p-4" onClick={() => router.back()}>
        <ChevronLeft size={28} />
      </button>
      <p className="text-[18px] font-semibold">{title}</p>
    </div>
  );
}
