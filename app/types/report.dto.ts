import type {
  ChartPoint,
  EmotionSegment,
  FeedbackItem,
} from './analytics';

export interface SessionReportDto {
  session?: {
    id?: string;
    title?: string;
    startedAt?: string;
    durationSeconds?: number;
    overallScore?: number | null;
  };
  voice?: {
    pacingWpm?: number | null;
    pacingStatus?: string;
    fillerWords?: number | null;
    averagePitchHz?: number | null;
    pitchConsistency?: string;
    averageVolumeDb?: number | null;
    volumeStatus?: string;
    pitchTimeline?: ChartPoint[];
    volumeTimeline?: ChartPoint[];
  };
  motion?: {
    eyeContactPercentage?: number | null;
  };
  emotionTimeline?: EmotionSegment[];
  strengths?: FeedbackItem[];
  growthAreas?: FeedbackItem[];
  recommendations?: FeedbackItem[];
  context?: string;
  environment?: string;
  hardware?: string;
  aiEngine?: string;
}
