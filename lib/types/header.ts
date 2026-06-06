import { User } from '@/lib/types/auth';

export interface HeaderSharedProps {
  user: User;
  onLogout: () => void;
  showWriteButton: boolean;
  scrolled: boolean;
  isRootPath: boolean;
}
