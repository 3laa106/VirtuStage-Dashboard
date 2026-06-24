export interface ChartPoint {
  t?: string;
  v: number;
}

export interface FeedbackItem {
  title: string;
  desc: string;
}

export interface EmotionSegment {
  label: string;
  flex: number;
  color: string;
  tooltip: string;
}

export interface SessionAnalytics {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  overallScore: number | null;
  scoreDelta?: string;
  pacing: number | null;
  pacingStatus?: string;
  fillerWords: number | null;
  fillerDelta?: string;
  eyeContact: number | null;
  eyeDelta?: string;
  pitchHz?: string;
  pitchConsistency?: string;
  volumeDb?: string;
  volumeStatus?: string;
  pitchData: ChartPoint[];
  volumeData: ChartPoint[];
  emotions: EmotionSegment[];
  strengths: FeedbackItem[];
  growthAreas: FeedbackItem[];
  recommendations: FeedbackItem[];
  context?: string;
  environment?: string;
  hardware?: string;
  aiEngine?: string;
}
