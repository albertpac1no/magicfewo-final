import { Skeleton } from '@/components/ui/Skeleton'

export default function FooterPageLoading() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <Skeleton className="h-10 w-72 mb-4" />
        <Skeleton className="h-5 w-full max-w-2xl mb-8" />
        <div className="space-y-6">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
