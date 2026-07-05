import { X as IcX } from 'lucide-react';

interface DraftListPopupHeaderProps {
  onClose: () => void;
}

const DraftListPopupHeader = ({ onClose }: DraftListPopupHeaderProps) => {
  return (
    <div className="border-surface-stroke border-b-[1px]">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-neutral-10 text-lg font-bold">임시저장 글</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="hover:bg-surface-98 rounded-full p-1 text-neutral-50"
          aria-label="팝업 닫기"
        >
          <IcX className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default DraftListPopupHeader;
