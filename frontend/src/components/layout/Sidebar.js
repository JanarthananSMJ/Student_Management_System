import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  UserCog,
  UserCircle,
  Menu,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'staff', 'student'] },
  { to: '/students', label: 'Students', icon: GraduationCap, roles: ['admin', 'staff'] },
  { to: '/staff', label: 'Staff', icon: Users, roles: ['admin'] },
  { to: '/academics', label: 'Academics', icon: BookOpen, roles: ['admin'] },
  { to: '/users', label: 'Users', icon: UserCog, roles: ['admin'] },
  { to: '/profile', label: 'Profile', icon: UserCircle, roles: ['admin', 'staff', 'student'] },
];

export default function Sidebar({ role }) {
  const [open, setOpen] = useState(false);
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

  const content = (
    <>
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white font-bold">
          C
        </div>
        <div>
          <p className="text-sm font-semibold text-white">College ERP</p>
          <p className="text-xs text-gray-400">Student Management</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 text-xs text-gray-500">v1.0 &middot; Phase 1</div>
    </>
  );

  return (
    <>
      {/* Mobile top bar toggle */}
      <div className="flex items-center justify-between bg-gray-950 px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold">
            C
          </div>
          <span className="text-sm font-semibold text-white">College ERP</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-gray-300">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-shrink-0 md:flex-col bg-gray-950 min-h-screen">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="relative z-50 flex h-full w-64 flex-col bg-gray-950">{content}</aside>
        </div>
      )}
    </>
  );
}
