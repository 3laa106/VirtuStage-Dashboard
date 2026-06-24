import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { PageLayout } from "../components/PageLayout"
import { ProtectedRoute } from "../components/ProtectedRoute"
import { Card } from "../components/Card"
import { Button } from "../components/Button"
import { ArrowLeft, Calendar, Clock, Monitor } from "lucide-react"
import { getSessionById } from "../services/sessionService"

import { ScoreBadge } from "../components/ScoreBadge"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { ErrorMessage } from "../components/ErrorMessage"
import { StatInfoCard } from "../components/StatInfoCard"
import { styles } from "../utils/styles"
import type { SessionDetail } from "../types/session"
import { getApiErrorMessage } from "../utils/apiError"

export default function SessionReplay() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [session, setSession] = useState<SessionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSession = async () => {
    if (!id) {
      setError("Session ID is missing from the URL.")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const sessionData = await getSessionById(id)
      setSession(sessionData)
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to load session recording."))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSession()
  }, [id])

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['user']}>
        <PageLayout>
          <LoadingSpinner text="Loading session recording..." />
        </PageLayout>
      </ProtectedRoute>
    )
  }

  if (error || !session) {
    return (
      <ProtectedRoute allowedRoles={['user']}>
        <PageLayout>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ErrorMessage 
              title="Session Unavailable" 
              message={error || "Session not found"} 
              onRetry={id && error !== "Session not found" ? fetchSession : undefined}
            />
            {error === "Session not found" && (
              <Button onClick={() => navigate("/sessions")} variant="secondary">
                Back to Sessions
              </Button>
            )}
          </div>
        </PageLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['user']}>
      <PageLayout>
        {/* Back Button + Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/sessions")}
            className="flex items-center gap-2 text-[#9aa1bc] hover:text-white text-sm font-medium mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Recordings
          </button>
          <h1 className={styles.pageTitle}>{session.title}</h1>
        </div>

        {/* Session Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatInfoCard label="Scenario" value={session.scenario} />
          <StatInfoCard 
            label="Date" 
            value={
              <>
                <Calendar className="w-3 h-3" />
                {session.date}
              </>
            } 
          />
          <StatInfoCard 
            label="Duration" 
            value={
              <>
                <Clock className="w-3 h-3" />
                {session.duration}
              </>
            } 
          />
          <StatInfoCard 
            label="Overall Score" 
            value={<ScoreBadge score={session.score ?? 0} className="text-xl" />} 
          />
        </div>

        {/* Video Player */}
        <Card title="Session Recording">
          <div className="rounded-xl overflow-hidden bg-[#080a12] aspect-video flex items-center justify-center relative">
            {session.videoUrl ? (
              <video
                src={session.videoUrl}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
                <div className={`w-20 h-20 rounded-2xl bg-[#5c7cff]/10 ${styles.flexCenter}`}>
                  <Monitor className="w-10 h-10 text-[#5c7cff]/50" />
                </div>
                <div>
                  <p className="text-[#9aa1bc] font-bold">VR Session Recording</p>
                  <p className={`${styles.textMuted} mt-1`}>
                    No recording is available for this session.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </PageLayout>
    </ProtectedRoute>
  )
}
