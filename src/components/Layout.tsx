import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, HomeIcon, BanknotesIcon, ChartPieIcon, ClipboardDocumentListIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { NavLink, Outlet } from 'react-router-dom'

/**
 * Navigation items for the sidebar
 * @type {Array<{name: string, href: string, icon: React.ComponentType}>}
 */
const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Transactions', href: '/transactions', icon: BanknotesIcon },
  { name: 'Budget', href: '/budget', icon: ClipboardDocumentListIcon },
  { name: 'Reports', href: '/reports', icon: ChartPieIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

/**
 * Main layout component with responsive sidebar navigation
 * 
 * Provides the application structure with:
 * - Responsive sidebar that collapses on mobile
 * - Navigation menu with icons
 * - User profile section
 * - Content area for page components via Outlet
 * 
 * @returns {JSX.Element} The layout with sidebar and content area
 */
export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-full">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>

                {/* Sidebar component for mobile */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6">
                  <NavLink to="/" className="flex h-16 shrink-0 items-center gap-x-2">
                    <img 
                      src="/logo.svg" 
                      alt="PennyFincher Logo" 
                      className="h-8 w-8 transition-transform duration-300 hover:rotate-12" 
                    />
                    <h1 className="text-2xl font-bold text-gray-900 hover:text-green-600">PennyFincher</h1>
                  </NavLink>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <NavLink
                                to={item.href}
                                className={({ isActive }) =>
                                  isActive
                                    ? 'bg-gray-50 text-green-600 group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                                }
                                onClick={() => setSidebarOpen(false)}
                              >
                                <item.icon
                                  className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-green-600"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="mt-auto">
                        <div className="flex items-center gap-x-4 py-3 border-t border-gray-200">
                          <div className="flex-shrink-0">
                            <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                              <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700">User Account</span>
                            <span className="text-xs text-gray-500">user@example.com</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <NavLink to="/" className="flex h-16 shrink-0 items-center gap-x-2">
            <img 
              src="/logo.svg" 
              alt="PennyFincher Logo" 
              className="h-8 w-8 transition-transform duration-300 hover:rotate-12" 
            />
            <h1 className="text-2xl font-bold text-gray-900 hover:text-green-600">PennyFincher</h1>
          </NavLink>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          isActive
                            ? 'bg-gray-50 text-green-600 group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                            : 'text-gray-700 hover:text-green-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                        }
                      >
                        <item.icon
                          className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-green-600"
                          aria-hidden="true"
                        />
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="flex items-center gap-x-4 py-3 border-t border-gray-200">
                  <div className="flex-shrink-0">
                    <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                      <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">User Account</span>
                    <span className="text-xs text-gray-500">user@example.com</span>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Content area */}
      <div className="lg:pl-72">
        {/* Mobile menu button */}
        <div className="sticky top-0 z-40 flex justify-start px-4 py-2 lg:hidden">
          <button
            type="button"
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <main className="py-2 lg:py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
