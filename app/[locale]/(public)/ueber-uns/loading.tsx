import { Skeleton } from '@/components/ui/Skeleton'

export default function UeberUnsLoading() {
  return (
    <div>
      <Skeleton className="h-[400px] w-full" />
      <div className="container mx-auto px-4 py-16">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-5 w-full max-w-2xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
