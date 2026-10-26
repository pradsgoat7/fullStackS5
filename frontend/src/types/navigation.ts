import type { LucideIcon } from 'lucide-react';
import type { Role } from './auth';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string | number;
  /** If set, only these roles see the item */
  roles?: Role[];
}
