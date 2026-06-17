import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-6 space-y-8 bg-background h-full">
      <div className="flex justify-between items-center pb-4 border-b border-border">
        <Skeleton className="h-10 w-64 bg-accent/50" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-20 bg-accent/50" />
          <Skeleton className="h-10 w-10 rounded-full bg-accent/50" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="p-4 rounded-lg shadow-sm bg-card border border-border"
          >
            <Skeleton className="h-4 w-1/2 mb-3 bg-muted" />
            <Skeleton className="h-10 w-3/4 mb-2 bg-muted" />
            <Skeleton className="h-4 w-full bg-muted" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-lg shadow-md bg-card border border-border">
          <Skeleton className="h-6 w-1/4 mb-4 bg-muted" />
          <Skeleton className="h-80 w-full bg-muted" />
        </div>

        <div className="p-6 rounded-lg shadow-md bg-card border border-border space-y-4">
          <Skeleton className="h-6 w-2/5 mb-4 bg-muted" />
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full bg-muted" />
              <Skeleton className="h-4 w-3/4 bg-muted" />
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-lg shadow-md bg-card border border-border space-y-4">
        <Skeleton className="h-6 w-1/5 mb-4 bg-muted" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-full bg-muted" />
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex justify-between items-center">
              <Skeleton className="h-4 w-1/6 bg-muted" />
              <Skeleton className="h-4 w-1/4 bg-muted" />
              <Skeleton className="h-4 w-1/6 bg-muted" />
              <Skeleton className="h-4 w-1/4 bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
