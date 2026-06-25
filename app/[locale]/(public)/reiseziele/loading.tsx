import { Skeleton } from '@/components/ui/Skeleton'

export default function ReisezieleLoading() {
  return (
    <div>
      <Skeleton className="h-[400px] w-full" />
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border">
              <Skeleton className="h-64 w-full" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-32 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
