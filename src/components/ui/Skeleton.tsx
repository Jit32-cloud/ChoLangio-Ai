import { cn } from '@/lib/utils'
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-gray-800/80 rounded-md', className)} />
}
export function AILoadingSkeleton({ label = 'Analyzing...' }: { label?: string }) {
  return (
    <div className="card mt-4 space-y-3 animate-pulse">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-800/60">
        <Skeleton className="w-4 h-4 rounded-full" />
        <Skeleton className="w-28 h-3" />
        <span className="ml-auto text-xs text-gray-600">{label}</span>
      </div>
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className={`h-3 ${i % 3 === 2 ? 'w-4/5' : 'w-full'}`} />
      ))}
      <div className="pt-1 space-y-2">
        <Skeleton className="w-1/3 h-3" />
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-3 w-full" />)}
      </div>
    </div>
  )
}
