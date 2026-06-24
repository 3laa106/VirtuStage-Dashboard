import type { UserRole } from './auth';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  sessions: number;
  lastActive: string;
  role: UserRole;
  disabled: boolean;
}

export interface PlatformActivity {
  id: string;
  type: string;
  icon: string;
  title: string;
  desc: string;
  time: string;
}

export interface TrainingScenario {
  id: string;
  name: string;
  enabled: boolean;
}

export interface AdminPanelData {
  users: ManagedUser[];
  activities: PlatformActivity[];
  scenarios: TrainingScenario[];
}
