export function StatusBadge({ status }: { status: string }) {
  if (status === "Completed") return (
    <span className="px-2 py-1 rounded-lg text-xs font-bold bg-[#0bda62]/10 text-[#0bda62]">
      Completed
    </span>
  )
  if (status === "Processing Analysis") return (
    <span className="px-2 py-1 rounded-lg text-xs font-bold bg-[#FFB703]/10 text-[#FFB703]">
      Processing Analysis
      <span className="ml-2 animate-pulse">...</span>
    </span>
  )
  return (
    <span className="px-2 py-1 rounded-lg text-xs font-bold bg-red-500/10 text-red-400">
      {status}
    </span>
  )
}
