import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface CardSkeletonProps {
  count?: number
}

export const CardSkeleton = ({ count = 3 }: CardSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {Array(count).fill(0).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <Skeleton width={120} height={16} className="mb-2" />
          <Skeleton width={80} height={30} />
        </div>
      ))}
    </div>
  )
}

export const ChartSkeleton = ({ count = 2 }: CardSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {Array(count).fill(0).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <Skeleton width={180} height={24} className="mb-4" />
          <div className="h-80">
            <Skeleton height="100%" />
          </div>
        </div>
      ))}
    </div>
  )
}

export const TableSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <Skeleton width={180} height={24} />
      </div>
      <div className="overflow-x-auto">
        <div className="p-4">
          <Skeleton height={50} className="mb-4" />
          {Array(5).fill(0).map((_, index) => (
            <Skeleton key={index} height={40} className="mb-2" />
          ))}
        </div>
      </div>
    </div>
  )
}

export const FiltersSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, index) => (
          <div key={index}>
            <Skeleton width={80} height={16} className="mb-2" />
            <Skeleton height={38} />
          </div>
        ))}
      </div>
    </div>
  )
}