import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout() {
  return (
    <div className="grid grid-cols-[240px_1fr] min-h-screen bg-navy text-white">
      <Sidebar />
      <main className="flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
