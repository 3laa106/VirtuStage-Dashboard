export type BackendSessionStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type SessionStatus =
  | 'Pending'
  | 'Processing Analysis'
  | 'Completed'
  | 'Failed'
  | 'Cancelled';

export interface SessionStatusResponseDto {
  status: BackendSessionStatus;
}

export interface BackendSessionDto {
  session_id: string;
  user_id: string;
  scenario_type: 'interview' | 'public_speaking';
  difficulty_level: 'easy' | 'medium' | 'hard';
  status: BackendSessionStatus;
  start_time: string | null;
  end_time: string | null;
  overall_score: number | null;
  voice_analysis_score?: number | null;
  motion_analysis_score?: number | null;
  created_at: string;
  title?: string;
  recording_url?: string | null;
}

export interface SessionListItem {
  id: string;
  date: string;
  time: string;
  scenario: string;
  score: number | null;
  status: SessionStatus;
}

export interface SessionDetail extends SessionListItem {
  title: string;
  duration: string;
  material?: string;
  videoUrl: string;
}
