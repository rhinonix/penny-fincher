import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

/**
 * Props for skeleton loader components
 * @interface CardSkeletonProps
 */
interface CardSkeletonProps {
  count?: number
}

/**
 * Renders skeleton loading states for dashboard cards
 * 
 * @param {CardSkeletonProps} props - Component props
 * @param {number} [props.count=3] - Number of card skeletons to render
 * @returns {JSX.Element} The card skeleton component
 */
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

/**
 * Renders skeleton loading states for chart containers
 * 
 * @param {CardSkeletonProps} props - Component props
 * @param {number} [props.count=2] - Number of chart skeletons to render
 * @returns {JSX.Element} The chart skeleton component
 */
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

/**
 * Renders skeleton loading state for data tables
 * 
 * @returns {JSX.Element} The table skeleton component
 */
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

/**
 * Renders skeleton loading state for filter controls
 * 
 * @returns {JSX.Element} The filters skeleton component
 */
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