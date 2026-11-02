import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TableSkeletonProps {
  columns?: number
  rows?: number
  showHeaderFilters?: boolean
  showPagination?: boolean
  className?: string
}

export function TableSkeleton({
  columns = 5,
  rows = 6,
  showHeaderFilters = true,
  showPagination = true,
  className = "",
}: TableSkeletonProps) {
  return (
    <div className={`w-full space-y-4 animate-in fade-in-50 duration-300 ${className}`}>
      {showHeaderFilters && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border/80 overflow-hidden bg-card/60 backdrop-blur-xs">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              {Array.from({ length: columns }).map((_, idx) => (
                <TableHead key={idx} className="h-11">
                  <Skeleton className="h-4 w-20 md:w-28" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <TableRow key={rowIdx} className="hover:bg-transparent">
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <TableCell key={colIdx} className="py-3.5">
                    <Skeleton
                      className={`h-4 rounded ${
                        colIdx === 0
                          ? "w-12 md:w-16"
                          : colIdx === 1
                          ? "w-32 md:w-48"
                          : colIdx === columns - 1
                          ? "w-16 ml-auto"
                          : "w-20 md:w-32"
                      }`}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
          <Skeleton className="h-4 w-40" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
      )}
    </div>
  )
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in-50 duration-300">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-3 backdrop-blur-xs"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="space-y-1.5 pt-1">
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

