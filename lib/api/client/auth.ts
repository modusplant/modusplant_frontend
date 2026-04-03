import { ApiResponse } from '@/lib/types/common';
import {
  LoginRequest,
  LoginResponseData,
  User,
  SignupRequest,
  EmailVerificationResponseData,
  NicknameCheckResponseData,
} from '@/lib/types/auth';
import { clientApiInstance } from '../instances/clientInstance';
import { AUTH_ENDPOINTS } from '@/lib/constants/endpoints';

/**
 * 인증 API
 */
export const authApi = {
  /**
   * 로그인
   */
  async login(
    data: LoginRequest
  ): Promise<ApiResponse<LoginResponseData> & { user?: User }> {
    const response = await clientApiInstance.post<LoginResponseData>(
      AUTH_ENDPOINTS.LOGIN,
      data,
      { skipAuth: true }
    );
    return response;
  },

  /**
   * 카카오 로그인
   */
  async kakaoLogin(
    code: string
  ): Promise<ApiResponse<{ accessToken: string }>> {
    const response = await clientApiInstance.post<{ accessToken: string }>(
      AUTH_ENDPOINTS.KAKAO_LOGIN,
      { code },
      { skipAuth: true }
    );
    return response;
  },

  /**
   * 로그아웃
   */
  async logout(): Promise<void> {},

  /**
   * 회원가입
   */
  async signup(data: SignupRequest): Promise<ApiResponse<void>> {
    return clientApiInstance.post<void>(AUTH_ENDPOINTS.SIGNUP, data, {
      skipAuth: true,
    });
  },

  /**
   * 이메일 인증 요청
   */
  async requestEmailVerification(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await clientApiInstance.post<void>(
        AUTH_ENDPOINTS.VERIFY_EMAIL_CODE_SEND,
        { email },
        { skipAuth: true }
      );

      return {
        success: response.status === 200,
        message:
          response.status === 200
            ? '인증 메일이 발송되었습니다.'
            : response.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || '인증 메일 발송에 실패했습니다.',
      };
    }
  },

  /**
   * 이메일 인증 확인
   */
  async verifyEmailCode(
    email: string,
    code: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response =
        await clientApiInstance.post<EmailVerificationResponseData>(
          AUTH_ENDPOINTS.VERIFY_EMAIL_CODE,
          { email, verifyCode: code },
          { skipAuth: true }
        );

      const isVerified = response.data?.hasEmailAuth === true;
      return {
        success: isVerified,
        message: isVerified
          ? '이메일 인증이 완료되었습니다.'
          : '인증에 실패했습니다.',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || '인증 코드 확인에 실패했습니다.',
      };
    }
  },

  /**
   * 닉네임 중복 확인
   */
  async checkNickname(
    nickname: string
  ): Promise<{ success: boolean; available: boolean; message: string }> {
    try {
      const response = await clientApiInstance.get<NicknameCheckResponseData>(
        AUTH_ENDPOINTS.CHECK_NICKNAME(nickname),
        { skipAuth: true }
      );

      const isExisted = response.data?.isNicknameExisted === true;
      return {
        success: true,
        available: !isExisted,
        message: isExisted
          ? '이미 사용중인 닉네임입니다.'
          : '사용 가능한 닉네임입니다.',
      };
    } catch (error: any) {
      return {
        success: false,
        available: false,
        message: error.message || '닉네임 확인에 실패했습니다.',
      };
    }
  },

  /**
   * 비밀번호 재설정 이메일 요청
   */
  async requestPasswordResetEmail(email: string): Promise<ApiResponse<void>> {
    return clientApiInstance.post<void>(
      AUTH_ENDPOINTS.RESET_PASSWORD_CODE_SEND,
      { email },
      { skipAuth: true }
    );
  },

  /**
   * 비밀번호 재설정 이메일 검증
   */
  async verifyPasswordResetEmail(uuid: string): Promise<ApiResponse<void>> {
    return clientApiInstance.post<void>(
      AUTH_ENDPOINTS.RESET_PASSWORD_VERIFY_CODE(uuid),
      undefined,
      { skipAuth: true }
    );
  },

  /**
   * 비밀번호 재설정
   */
  async resetPassword(password: string): Promise<ApiResponse<void>> {
    return clientApiInstance.post<void>(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      { password },
      { skipAuth: true }
    );
  },

  /**
   * 이메일 변경
   */
  async changeEmail(
    userId: string,
    currentEmail: string,
    newEmail: string
  ): Promise<ApiResponse<void>> {
    return clientApiInstance.post<void>(AUTH_ENDPOINTS.CHANGE_EMAIL(userId), {
      currentEmail,
      newEmail,
    });
  },
};
