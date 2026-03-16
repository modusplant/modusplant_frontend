'use client';

import { Checkbox } from '@/components/_common/checkbox';
import { UseFormRegisterReturn } from 'react-hook-form';

interface TermsItemProps {
  id: string;
  label: string;
  checked: boolean;
  register: UseFormRegisterReturn;
  isExpanded: boolean;
  onToggle: () => void;
  content: {
    title: string;
    items: string[];
  };
}

export default function TermsItem({
  id,
  label,
  checked,
  register,
  isExpanded,
  onToggle,
  content,
}: TermsItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox {...register} id={id} checked={checked} />
          <label
            htmlFor={id}
            className="text-neutral-60 cursor-pointer text-sm"
          >
            {label}
          </label>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="text-neutral-60 ml-2 cursor-pointer text-sm whitespace-nowrap underline"
        >
          {isExpanded ? '접기' : '보기'}
        </button>
      </div>
      {isExpanded && (
        <div className="bg-neutral-98 text-neutral-60 ml-6 rounded-md p-3 text-sm leading-relaxed">
          <p className="mb-2 font-medium">{content.title}</p>
          <ul className="space-y-1 text-xs md:text-sm">
            {content.items.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
