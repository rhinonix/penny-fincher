import { useState, useEffect } from 'react'

/**
 * Props for the Notification component
 * @interface NotificationProps
 */
interface NotificationProps {
  message: string
  type: 'success' | 'error'
  isVisible: boolean
  onClose: () => void
  duration?: number
}

/**
 * Animated notification component for displaying success and error messages
 * 
 * Features:
 * - Auto-dismisses after specified duration
 * - Smooth fade in/out animations
 * - Different styling for success and error states
 * - Manual close button
 * 
 * @param {NotificationProps} props - Component props
 * @param {string} props.message - The notification message to display
 * @param {'success' | 'error'} props.type - Type of notification that determines styling
 * @param {boolean} props.isVisible - Whether the notification should be visible
 * @param {() => void} props.onClose - Callback function when notification is closed
 * @param {number} [props.duration=3000] - Time in milliseconds before auto-dismissing
 * @returns {JSX.Element|null} The notification component or null when not visible
 */
function Notification({ message, type, isVisible, onClose, duration = 3000 }: NotificationProps) {
  const [isShowing, setIsShowing] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true)
      const timer = setTimeout(() => {
        setIsShowing(false)
        setTimeout(onClose, 300) // Wait for animation to complete before fully removing
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible && !isShowing) return null

  return (
    <div 
      className={`fixed top-5 right-5 z-[60] p-4 rounded-md shadow-md transition-all duration-300 ${
        isShowing ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      } ${
        type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {type === 'success' ? (
            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 ${
                type === 'success' 
                  ? 'text-green-500 hover:bg-green-200 focus:bg-green-200' 
                  : 'text-red-500 hover:bg-red-200 focus:bg-red-200'
              } focus:outline-none`}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notification