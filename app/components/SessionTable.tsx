import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSessionPolling } from '../hooks/useSessionPolling';
import { styles } from '../utils/styles';
import { StatusBadge } from './StatusBadge';
import { ScenarioBadge } from './ScenarioBadge';
import { ScoreProgressBar } from './ScoreBadge';
import type { SessionListItem } from '../types/session';

const ITEMS_PER_PAGE = 4;

interface SessionTableProps {
  sessions: SessionListItem[];
  navigateTo: string; // e.g. "/session" or "/session-analytics"
  actionLabel: string; // e.g. "View Replay" or "View Analysis"
  onRowClick: (id: number | string) => void;
}

export function SessionTable({
  sessions,
  navigateTo,
  actionLabel,
  onRowClick,
}: SessionTableProps) {
  const [search, setSearch] = useState('');
  const [scenario, setScenario] = useState('All');
  const [page, setPage] = useState(1);

  const filtered = sessions.filter((s) => {
    const matchSearch =
      s.scenario.toLowerCase().includes(search.toLowerCase()) ||
      s.date.toLowerCase().includes(search.toLowerCase());
    const matchScenario = scenario === 'All' || s.scenario === scenario;
    return matchSearch && matchScenario;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5c6484]" />
          <input
            type="text"
            placeholder="Search sessions by keyword..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className={`${styles.inputBase} ${styles.inputWithIcon}`}
          />
        </div>
        <select
          value={scenario}
          onChange={(e) => {
            setScenario(e.target.value);
            setPage(1);
          }}
          className={styles.selectBase}
        >
          <option value="All">Scenario: All</option>
          <option>Job Interview</option>
          <option>Keynote Speech</option>
          <option>Executive Meeting</option>
          <option>Public Speaking</option>
        </select>
      </div>

      {/* Table */}
      <div className={`${styles.tableContainer} mb-6`}>
        {/* Table Header */}
        <div
          className={`grid grid-cols-12 px-6 py-3 ${styles.tableHeaderGroup}`}
        >
          <div className="col-span-3">Date & Time</div>
          <div className="col-span-3">Scenario Type</div>
          <div className="col-span-4">AI Performance Score</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Rows */}
        {paginated.map((session) => (
          <SessionRow
            key={session.id}
            session={session}
            actionLabel={actionLabel}
            onClick={() => onRowClick(session.id)}
          />
        ))}
      </div>

      {/* Pagination — hidden when no results */}
      {totalPages > 0 && (
        <div className={`${styles.flexBetween} mb-8`}>
          <p className="text-[#5c6484] text-sm">
            Showing{' '}
            <span className="text-white font-bold">
              {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}
            </span>{' '}
            to{' '}
            <span className="text-white font-bold">
              {Math.min(page * ITEMS_PER_PAGE, filtered.length)}
            </span>{' '}
            of <span className="text-white font-bold">{filtered.length}</span>{' '}
            sessions
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-lg bg-[#12141c] border border-[#272b3a] flex items-center justify-center text-[#9aa1bc] hover:border-[#5c7cff] disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                  page === p
                    ? 'bg-[#5c7cff] text-white'
                    : 'bg-[#12141c] border border-[#272b3a] text-[#9aa1bc] hover:border-[#5c7cff]'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="w-9 h-9 rounded-lg bg-[#12141c] border border-[#272b3a] flex items-center justify-center text-[#9aa1bc] hover:border-[#5c7cff] disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function SessionRow({
  session,
  actionLabel,
  onClick,
}: {
  session: SessionListItem;
  actionLabel: string;
  onClick: () => void;
}) {
  const isProcessing = session.status === 'Processing Analysis';
  const { status } = useSessionPolling(session.id, isProcessing);

  const currentStatus = isProcessing ? status : session.status;
  const isNowCompleted = currentStatus === 'Completed';

  return (
    <div
      onClick={() => isNowCompleted && onClick()}
      className={`grid grid-cols-12 px-6 py-5 transition-colors last:border-0 border-b border-[#1a1c25] ${
        !isNowCompleted
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:bg-white/5 cursor-pointer'
      }`}
    >
      {/* Date */}
      <div className="col-span-3">
        <p className="text-white font-semibold text-sm">{session.date}</p>
        <p className={styles.textMuted}>{session.time}</p>
      </div>

      {/* Scenario */}
      <div className="col-span-3 flex items-center">
        <ScenarioBadge scenario={session.scenario} />
      </div>

      {/* Score */}
      <div className="col-span-4 flex items-center gap-3">
        {isNowCompleted ? (
          <ScoreProgressBar score={session.score ?? 0} />
        ) : (
          <StatusBadge status={currentStatus} />
        )}
      </div>

      {/* Actions */}
      <div
        className="col-span-2 flex items-center justify-end gap-2"
        onClick={(e) => {
          if (!isNowCompleted) e.stopPropagation();
        }}
      >
        {!isNowCompleted ? (
          <span className="text-[#5c6484] text-xs font-bold">
            Processing...
          </span>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className={styles.btnLink}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
