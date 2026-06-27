import { User } from '@/lib/types/auth';

export interface HeaderSharedProps {
  user: User | null;
  scrolled: boolean;
  isRootPath: boolean;
  className?: string;
}
