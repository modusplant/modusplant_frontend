import ChangeEmailForm from '@/components/mypage/account/changeEmailForm';
import { changeEmailMetadata as metadata } from '@/lib/metadata/auth';

export { metadata };

/**
 * 이메일 변경 페이지
 * - mypage/account에서 진입, 로그인 사용자 전용
 */
export default function ResetEmailPage() {
  return <ChangeEmailForm />;
}
