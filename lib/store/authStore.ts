import { create } from 'zustand';
import { User } from '@/lib/types/auth';
import { deleteAllCookies } from '@/lib/utils/cookies/client';
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loginAttempts: number;
}
interface AuthActions {
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  incrementLoginAttempts: () => void;
  resetLoginAttempts: () => void;
}

type AuthStore = AuthState & AuthActions;

// Zustand store 생성
export const useAuthStore = create<AuthStore>()((set) => ({
  // 초기 상태
  user: null,
  isAuthenticated: false,
  loginAttempts: 0,

  // 액션들
  login: (user: User) => {
    set({
      user: {
        ...user,
      },
      isAuthenticated: true,
      loginAttempts: 0, // 로그인 성공 시 시도 횟수 초기화
    });
  },

  logout: () => {
    // 모든 쿠키 삭제
    deleteAllCookies();

    set({
      user: null,
      isAuthenticated: false,
      loginAttempts: 0,
    });
  },

  updateUser: (userData: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    }));
  },

  incrementLoginAttempts: () => {
    set((state) => ({
      loginAttempts: state.loginAttempts + 1,
    }));
  },

  resetLoginAttempts: () => {
    set({
      loginAttempts: 0,
    });
  },
}));
