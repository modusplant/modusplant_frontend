'use client';

import MypageBox from '../common/MypageBox';

const ReportSection = () => {
  return (
    <MypageBox className="px-10 py-12">
      <div className="flex w-full flex-col gap-6">
        <h1 className="text-bold-20 leading-[1.2]">건의/버그제보</h1>

        <div className="bg-surface-99 rounded-lg px-[18px] py-[14px]">
          <p className="text-[14px]">
            서비스 개선을 위한 소중한 의견을 보내주세요. 제출하신 내용은
            운영진이 검토 후 등록하신 이메일로 답변을 보내드립니다.
          </p>
        </div>
      </div>
    </MypageBox>
  );
};

export default ReportSection;
