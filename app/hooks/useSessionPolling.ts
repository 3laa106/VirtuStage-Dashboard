import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { mapSessionStatus } from '../mappers/sessionMapper';
import type {
  SessionStatusResponseDto,
  SessionStatus,
} from '../types/session';
import api from '../utils/api';

const TERMINAL_STATUSES: SessionStatus[] = [
  'Completed',
  'Failed',
  'Cancelled',
];

export function useSessionPolling(
  sessionId: string | null,
  isProcessing: boolean,
) {
  const [status, setStatus] = useState<SessionStatus>(
    isProcessing ? 'Processing Analysis' : 'Completed',
  );
  const [isPolling, setIsPolling] = useState(isProcessing);

  useEffect(() => {
    setStatus(isProcessing ? 'Processing Analysis' : 'Completed');
    setIsPolling(isProcessing);
  }, [sessionId, isProcessing]);

  useEffect(() => {
    if (!sessionId || !isPolling) return;

    let active = true;
    const poll = async () => {
      try {
        const { data } = await api.get<SessionStatusResponseDto>(
          API_ENDPOINTS.sessions.status(sessionId),
        );
        if (!active) return;
        const nextStatus = mapSessionStatus(data.status);
        setStatus(nextStatus);
        if (TERMINAL_STATUSES.includes(nextStatus)) setIsPolling(false);
      } catch {
        // Retry temporary failures on the next interval.
      }
    };

    void poll();
    const interval = window.setInterval(poll, 3000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [sessionId, isPolling]);

  return { isPolling, status };
}
