interface CardProps {
    title: string;
    value: string;
  }
  
  export function Card({ title, value }: CardProps) {
    return (
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {/* Add icon here if needed */}
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {title}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {value}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    )
  }