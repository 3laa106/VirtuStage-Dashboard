import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { PageLayout } from '../components/PageLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import {
  ArrowLeft,
  RefreshCw,
  Video,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { getSessionAnalytics } from '../services/analyticsService';
interface Emotion { label: string; flex: number; color: string; tooltip: string }
interface Strength { title: string; desc: string }
interface Recommendation { title: string; desc: string }

import { styles } from '../utils/styles';
import { SectionHeader } from '../components/SectionHeader';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { AnalyticsStatCard } from '../components/AnalyticsStatCard';
import { FeedbackItem } from '../components/FeedbackItem';
import { RecommendationItem } from '../components/RecommendationItem';
import { EmotionTimeline } from '../components/EmotionTimeline';
import type { SessionAnalytics as SessionAnalyticsData } from '../types/analytics';
import { getApiErrorMessage } from '../utils/apiError';

export default function SessionAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tone' | 'pitch'>('tone');

  const [session, setSession] = useState<SessionAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessionAnalytics = async () => {
    if (!id) {
      setError('Session ID is missing from the URL.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const sessionData = await getSessionAnalytics(id);
      setSession(sessionData);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to load session analytics.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionAnalytics();
  }, [id]);

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['user']}>
        <PageLayout>
          <LoadingSpinner text="Analyzing session data..." />
        </PageLayout>
      </ProtectedRoute>
    );
  }

  if (error || !session) {
    return (
      <ProtectedRoute allowedRoles={['user']}>
        <PageLayout>
          <ErrorMessage
            title="Analysis Unavailable"
            message={error || 'Analytics not found for this session'}
            onRetry={
              id && error !== 'Analytics not found for this session'
                ? fetchSessionAnalytics
                : undefined
            }
          />
        </PageLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['user']}>
      <PageLayout>
        {/* Back */}
        <button
          onClick={() => navigate('/analytics')}
          className="flex items-center gap-2 text-[#9aa1bc] hover:text-white text-sm font-medium mb-4 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Sessions
        </button>

        <SectionHeader
          title={session.title}
          subtitle={`📅 ${session.date} • ${session.time} (${session.duration})`}
          action={
            <div className="flex gap-3 mt-4 sm:mt-0">
              <button
                onClick={() => navigate(`/session/${id}`)}
                className={styles.btnWhiteIcon}
              >
                <Video className="w-4 h-4" />
                Watch Replay
              </button>
            </div>
          }
        />
        <div className="flex items-center gap-2 text-[#5c7cff] text-xs font-bold uppercase tracking-wider mb-6 -mt-8">
          <span className="w-2 h-2 rounded-full bg-[#5c7cff]" />
          Detailed Analysis
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <AnalyticsStatCard
            label="Overall Score"
            value={session.overallScore ?? 'N/A'}
            badgeText={session.scoreDelta ?? ''}
            badgeType="positive"
            barProgress={session.overallScore ?? 0}
          />
          <AnalyticsStatCard
            label="Pacing (WPM)"
            value={session.pacing ?? 'N/A'}
            badgeText={session.pacingStatus ?? ''}
            badgeType="positive"
            subText="Industry standard: 130-150"
          />
          <AnalyticsStatCard
            label="Filler Words"
            value={session.fillerWords ?? 'N/A'}
            badgeText={session.fillerDelta ?? ''}
            badgeType="warning"
            subText="Um, Ah, Like, So"
          />
          <AnalyticsStatCard
            label="Eye Contact"
            value={session.eyeContact == null ? 'N/A' : `${session.eyeContact}%`}
            badgeText={session.eyeDelta ?? ''}
            badgeType="positive"
            subText="Maintained across quadrants"
          />
        </div>

        {/* Voice & Tone Analytics */}
        <div className="mb-8">
          <div className={`${styles.flexBetween} mb-4`}>
            <h2 className={styles.heading2}>🎙️ Voice & Tone Analytics</h2>
            <div className="flex gap-2">
              {(['tone', 'pitch'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-[#272b3a] text-white'
                      : 'text-[#5c6484] hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pitch Chart */}
            <div className="bg-[#101218]/50 border border-[#393f56] rounded-2xl p-6">
              <div className={`${styles.flexBetween} mb-4`}>
                <div>
                  <p className={styles.cardSubtitle}>Active Range</p>
                  <p className="text-white text-3xl font-black">
                    {session.pitchHz ?? 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <p className={styles.cardSubtitle}>Consistency</p>
                  <p className="text-[#0bda62] text-lg font-bold">
                    {session.pitchConsistency ?? 'Not available'}
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={session.pitchData}>
                  <defs>
                    <linearGradient id="pitchGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5c7cff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#5c7cff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="t"
                    tick={{ fill: '#5c6484', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1b1d28',
                      border: '1px solid #393f56',
                      borderRadius: 8,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke="#5c7cff"
                    strokeWidth={3}
                    dot={false}
                    fill="url(#pitchGrad)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Volume Chart */}
            <div className="bg-[#101218]/50 border border-[#393f56] rounded-2xl p-6">
              <div className={`${styles.flexBetween} mb-4`}>
                <div>
                  <p className={styles.cardSubtitle}>Average Volume</p>
                  <p className="text-white text-3xl font-black">
                    {session.volumeDb ?? 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <p className={styles.cardSubtitle}>Status</p>
                  <p className="text-orange-400 text-lg font-bold">
                    {session.volumeStatus ?? 'Not available'}
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={session.volumeData} barSize={28}>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1b1d28',
                      border: '1px solid #393f56',
                      borderRadius: 8,
                    }}
                  />
                  <Bar
                    dataKey="v"
                    fill="#5c7cff"
                    fillOpacity={0.6}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <p className={`${styles.textMuted} mt-2`}>INTENSITY PROFILE</p>
            </div>
          </div>
        </div>

        {/* Emotion Timeline */}
        <EmotionTimeline
          emotions={session.emotions}
          duration={session.duration}
        />

        {/* Strengths + AI Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Strengths & Growth */}
          <div className="space-y-5">
            <div>
              <h3 className={styles.heading3}>
                <CheckCircle className="w-5 h-5 text-[#0bda62]" /> Key Strengths
              </h3>
              <div className="space-y-2">
                {session.strengths.map((s: Strength) => (
                  <FeedbackItem
                    key={s.title}
                    title={s.title}
                    desc={s.desc}
                    type="strength"
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className={styles.heading3}>
                <AlertTriangle className="w-5 h-5 text-orange-400" /> Growth
                Areas
              </h3>
              <div className="space-y-2">
                {session.growthAreas.map((g: Strength) => (
                  <FeedbackItem
                    key={g.title}
                    title={g.title}
                    desc={g.desc}
                    type="growth"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="lg:col-span-2 bg-[#1e2433] rounded-3xl p-7 border border-transparent">
            <div className={`${styles.flexBetween} mb-6`}>
              <div>
                <h3 className="text-white text-2xl font-black">
                  AI Recommendations
                </h3>
                <p className={styles.cardSubtitle}>
                  Tailored for your {session.title}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#5c7cff]/10 rounded-2xl flex items-center justify-center text-xl">
                💡
              </div>
            </div>
            <div className="space-y-5">
              {session.recommendations.map((r: Recommendation, i: number) => (
                <RecommendationItem
                  key={i}
                  num={i + 1}
                  title={r.title}
                  desc={r.desc}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Session Context Footer */}
        <div className="border-t border-[#272b3a] pt-8 pb-4 flex flex-wrap justify-between gap-8">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 bg-[#5c7cff] rounded-sm" />
              <h4 className="text-white font-bold">Session Context</h4>
            </div>
            <p className="text-[#9aa1bc] text-sm leading-relaxed">
              {session.context ?? 'Session context is not available yet.'}
            </p>
          </div>
          <div className="flex gap-10">
            <div>
              <p className={`${styles.labelMuted} mb-3`}>Environment</p>
              <p className="text-white text-sm font-medium">
                🏛️ {session.environment}
              </p>
            </div>
            <div>
              <p className={`${styles.labelMuted} mb-3`}>Hardware</p>
              <p className="text-white text-sm font-medium">
                🎧 {session.hardware}
              </p>
            </div>
            <div>
              <p className={`${styles.labelMuted} mb-3`}>AI Engine</p>
              <p className="text-white text-sm font-medium">
                🤖 {session.aiEngine}
              </p>
            </div>
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
