import { NotificationItem } from '@/components/notification/NotificationItem';
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import '@/app/globals.css';

const meta = {
  title: 'Components/NotificationItem',
  component: NotificationItem,

  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ border: '1px solid black', maxWidth: '80vw' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    isRead: {},
  },
} satisfies Meta<typeof NotificationItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '내 댓글이 좋아요를 받았어요.',
    content: `플랜트메이트님, 안녕하세요! 자세한 답변 정말 감사드립니다! 😭😭😭
          말씀해주신 내용들 읽어보니 제 아글라오네마에게 해당하는 부분이 많은 것
          같아요. 특히 흙 마름과 통풍 문제는 미처 신경 쓰지 못했던 부분인데,
          바로 확인해봐야겠어요. 물을 줄 때 늘 겉흙이 마르면 바로 줬었는데,
          속흙까지는 잘 확인 안 했거든요. 그리고 잎 뒷면도 오늘 저녁에 퇴근해서
          꼼꼼히 살펴봐야겠습니다! 조언해주신 대로 잘 관리해서 우리
          아글라오네마가 다시 예쁜 잎을 보여줄 수 있도록 노력해볼게요. 정말 큰
          도움이 되었어요! 다시 한번 감사드립니다! 🙏`,
    createdAt: '오전 10:11',
    isRead: false,
  },
};
