import { Metadata } from 'next';
import { createMetadata } from './helpers';

/**
 * 로그인 페이지 메타데이터
 */
export const loginMetadata: Metadata = createMetadata({
  title: '로그인 | 모두의식물',
  description:
    '모두의식물에 로그인하여 다양한 식물 정보를 공유하고 소통해보세요.',
  path: '/login',
  keywords: ['로그인', '모두의식물', '식물 커뮤니티'],
});

/**
 * 회원가입 페이지 메타데이터
 */
export const signupMetadata: Metadata = createMetadata({
  title: '회원가입 | 모두의식물',
  description:
    '모두의식물 회원이 되어 식물 애호가들과 함께 정보를 나누고 소통하세요.',
  path: '/signup',
  keywords: ['회원가입', '모두의식물', '식물 커뮤니티', '가입'],
});

/**
 * 비밀번호 재설정 페이지 메타데이터
 */
export const resetPasswordMetadata: Metadata = createMetadata({
  title: '비밀번호 재설정 | 모두의식물',
  description: '모두의식물 계정의 비밀번호를 재설정합니다.',
  path: '/reset-password',
  keywords: ['비밀번호 재설정', '모두의식물', '계정 복구'],
});
