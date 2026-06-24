// app/components/UserDashboard.tsx
import { StatCard } from "./Card";
import { SectionHeader } from "./SectionHeader";
import { BarChart2, Star, Zap, Sparkles } from "lucide-react";
import { styles } from "../utils/styles";
import { CustomTooltip } from "./CustomTooltip";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { UserDashboardData } from "../types/dashboard";
import { EmptyState } from "./EmptyState";

interface UserDashboardProps {
  name: string;
  data: UserDashboardData;
}

export function UserDashboard({ name, data }: UserDashboardProps) {
  const {
    progressData,
    voiceMotionData,
    totalSessions,
    avgScore,
    improvementRate,
  } = data || {};

  return (
    <>
      <SectionHeader
        title={`Welcome back, ${name?.split(" ")[0]} 👋`}
        subtitle={
          totalSessions === 0
            ? "Complete your first VR session to begin tracking your progress."
            : `You have ${totalSessions} recorded session${totalSessions === 1 ? "" : "s"} available for review.`
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Sessions"
          value={totalSessions != null ? totalSessions.toString() : "--"}
          change={
            totalSessions === 0
              ? "Complete your first training session"
              : "Your recorded training sessions"
          }
          color="#5c7cff"
          icon={<BarChart2 className="w-5 h-5" />}
        />
        <StatCard
          label="Avg Performance Score"
          value={avgScore != null ? `${avgScore}/100` : "--"}
          change={
            totalSessions === 0
              ? "Available after your first analysis"
              : "Based on your analyzed sessions"
          }
          color="#FFB703"
          icon={<Star className="w-5 h-5" />}
        />
        <StatCard
          label="Improvement Rate"
          value={improvementRate != null ? `+${improvementRate}%` : "--"}
          change={
            totalSessions === 0
              ? "Available after multiple sessions"
              : "Compared with your earlier sessions"
          }
          color="#0bda62"
          icon={<Zap className="w-5 h-5" />}
        />
      </div>

      {totalSessions === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No sessions yet"
          description="Start your first VR training session to unlock performance scores, progress trends, and voice and motion analytics."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Progress */}
          <div className={styles.card}>
            <div className="mb-4">
              <h2 className={styles.cardTitle}>Performance Progress</h2>
              <p className={styles.cardSubtitle}>
                Average score trend over the last 30 days
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-white text-3xl font-black">
                  {avgScore ?? "--"}
                </span>
                <span className="text-[#0bda62] text-sm font-bold">
                  {improvementRate != null ? `+${improvementRate}%` : ""}
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={progressData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#272b3a" />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "#5c6484", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#5c6484", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[40, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#5c7cff"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: "#5c7cff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Voice vs Motion */}
          <div className={styles.card}>
            <div className="mb-4">
              <h2 className={styles.cardTitle}>Voice vs. Motion Analytics</h2>
              <p className={styles.cardSubtitle}>
                Skill breakdown per core category
              </p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={voiceMotionData || []} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#272b3a" />
                <XAxis
                  dataKey="category"
                  tick={{ fill: "#5c6484", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#5c6484", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(v) => (
                    <span style={{ color: "#9aa1bc" }}>{v}</span>
                  )}
                />
                <Bar
                  dataKey="voice"
                  name="Voice"
                  fill="#5c7cff"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="motion"
                  name="Motion"
                  fill="#3d4f8a"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}
