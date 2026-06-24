// app/components/EmotionTimeline.tsx
import { useState } from 'react';
interface Emotion {
  label: string
  flex: number
  color: string
  tooltip: string
}
import { styles } from '../utils/styles';

interface EmotionTimelineProps {
  emotions: Emotion[];
  duration: string;
}

export function EmotionTimeline({ emotions, duration }: EmotionTimelineProps) {
  const [hoveredEmotion, setHoveredEmotion] = useState<string | null>(null);

  return (
    <div className="mb-8">
      <h2 className={styles.heading2}>😊 Emotion Timeline</h2>
      <div className="w-full h-20 rounded-2xl flex border border-[#272b3a]">
        {emotions.map((e) => (
          <div
            key={e.label}
            className="h-full flex items-center justify-center relative cursor-default transition-opacity first:rounded-l-2xl last:rounded-r-2xl"
            style={{ flex: e.flex, backgroundColor: e.color + 'cc' }}
            onMouseEnter={() => setHoveredEmotion(e.label)}
            onMouseLeave={() => setHoveredEmotion(null)}
          >
            <span className="text-white text-xs font-black opacity-80">
              {e.label}
            </span>
            {hoveredEmotion === e.label && (
              <div
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[#393f56] bg-[#1b1d28] px-3 py-1.5 text-xs text-white shadow-xl"
              >
                {e.tooltip}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={`${styles.flexBetween} mt-2 px-1`}>
        <span className={styles.textMuted}>0:00</span>
        <span className={styles.textMuted}>Session Duration ({duration})</span>
      </div>
    </div>
  );
}
