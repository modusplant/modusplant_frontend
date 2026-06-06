import StateMessage from '@/components/_common/stateMessage';

export default function EmptyMyComments() {
  return (
    <StateMessage
      title="작성한 댓글이 없어요!"
      description="초록빛 가득한 이야기들을 탐색하고\n나만의 식물 아카이브를 채워보세요."
      buttonText="둘러보기"
      buttonHref="/"
    />
  );
}
