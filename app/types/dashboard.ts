export interface PerformancePoint {
  week: string;
  score: number;
}

export interface VoiceMotionPoint {
  category: string;
  voice: number;
  motion: number;
}

export interface UserDashboardData {
  totalSessions: number;
  avgScore: number;
  improvementRate: number;
  progressData: PerformancePoint[];
  voiceMotionData: VoiceMotionPoint[];
}

export interface AdminSessionsPoint {
  day: string;
  sessions: number;
}

export interface AdminScorePoint {
  month: string;
  score: number;
}

export interface RecentRegistration {
  name: string;
  email: string;
  time: string;
}

export interface AdminDashboardData {
  totalUsers: number;
  totalSessions: number;
  platformAvgScore: number;
  activeToday: number;
  adminSessionsData: AdminSessionsPoint[];
  adminScoreData: AdminScorePoint[];
  recentRegistrations: RecentRegistration[];
}
