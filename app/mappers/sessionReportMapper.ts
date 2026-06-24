import type { SessionAnalytics } from '../types/analytics';
import type { SessionReportDto } from '../types/report.dto';

export function mapSessionReport(
  dto: SessionReportDto,
  fallbackId: string,
): SessionAnalytics {
  const session = dto.session ?? {};
  const voice = dto.voice ?? {};
  const motion = dto.motion ?? {};

  return {
    id: String(session.id ?? fallbackId),
    title: session.title ?? 'Training Session',
    date: session.startedAt
      ? new Date(session.startedAt).toLocaleDateString()
      : 'N/A',
    time: session.startedAt
      ? new Date(session.startedAt).toLocaleTimeString()
      : 'N/A',
    duration: session.durationSeconds
      ? `${Math.round(session.durationSeconds / 60)} mins`
      : 'N/A',
    overallScore: session.overallScore ?? null,
    pacing: voice.pacingWpm ?? null,
    pacingStatus: voice.pacingStatus,
    fillerWords: voice.fillerWords ?? null,
    eyeContact: motion.eyeContactPercentage ?? null,
    pitchHz:
      voice.averagePitchHz != null
        ? `${voice.averagePitchHz}Hz`
        : undefined,
    pitchConsistency: voice.pitchConsistency,
    volumeDb:
      voice.averageVolumeDb != null
        ? `${voice.averageVolumeDb}dB`
        : undefined,
    volumeStatus: voice.volumeStatus,
    pitchData: voice.pitchTimeline ?? [],
    volumeData: voice.volumeTimeline ?? [],
    emotions: dto.emotionTimeline ?? [],
    strengths: dto.strengths ?? [],
    growthAreas: dto.growthAreas ?? [],
    recommendations: dto.recommendations ?? [],
    context: dto.context,
    environment: dto.environment,
    hardware: dto.hardware,
    aiEngine: dto.aiEngine,
  };
}
