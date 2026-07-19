import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Kanban,
  List,
  BarChart3,
  User,
  Briefcase,
} from 'lucide-react'
import useAuthStore from '../../store/authStore'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/kanban', icon: Kanban, label: 'Kanban' },
  { to: '/applications', icon: List, label: 'Applications' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
]

const Sidebar = () => {
  const { logout } = useAuthStore()

  return (
    <aside className="w-16 bg-white border-r border-gray-100 flex flex-col items-center py-4 gap-2 min-h-screen">
      {/* Logo */}
      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
        <Briefcase size={20} className="text-white" />
      </div>

      {/* Nav items */}
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          title={label}
          className={({ isActive }) =>
            `w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            }`
          }
        >
          <Icon size={20} />
        </NavLink>
      ))}

      {/* Profile at bottom */}
      <div className="mt-auto flex flex-col items-center gap-2">
        <NavLink
          to="/profile"
          title="Profile"
          className={({ isActive }) =>
            `w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            }`
          }
        >
          <User size={20} />
        </NavLink>
      </div>
    </aside>
  )
}

export default Sidebar