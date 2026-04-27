import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SocialProvider } from '../constants/oauth';

interface OAuthState {
  signupData: {
    email: string;
    nickname: string;
    type: 'NEED_SIGNUP' | 'NEED_LINK';
    provider: SocialProvider;
  } | null;
}

interface OAuthActions {
  setSignupData: (data: NonNullable<OAuthState['signupData']>) => void;
  clearSignupData: () => void;
}

type OAuthStore = OAuthState & OAuthActions;

export const useOAuthStore = create<OAuthStore>()(
  persist(
    (set) => ({
      signupData: null,

      setSignupData: (data) => set({ signupData: data }),
      clearSignupData: () => set({ signupData: null }),
    }),
    {
      name: 'oauth-signup',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
