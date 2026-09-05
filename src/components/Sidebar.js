'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '@/store/userSlice';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import {
  LayoutDashboard,
  Plane,
  DollarSign,
  MapPin,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Trips', icon: Plane, href: '/dashboard/trips' },
  { label: 'Join Trip', icon: Users, href: '/dashboard/join' }, // NEW
  { label: 'Expenses', icon: DollarSign, href: '/dashboard/expenses' },
  { label: 'Destinations', icon: MapPin, href: '/dashboard/destinations' },
  { label: 'Chat', icon: MessageSquare, href: '/dashboard/chat' },
  { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
];


  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white text-purple-600 p-3 rounded-xl shadow-lg border border-gray-200"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 transition-transform duration-300 z-40 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 shadow-xl`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-600 to-purple-900 p-2 rounded-xl">
              <Plane size={28} className="text-white" />
            </div>
            <div>
              <Link href={'/'} className="text-2xl font-bold text-gray-900">TravelPlan</Link>
              <p className="text-xs text-gray-500">Your Journey Starts Here</p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName}
                className="w-12 h-12 rounded-xl border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {user?.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{user?.displayName || 'User'}</p>
              <p className="text-xs text-gray-600 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className={active ? 'text-white' : 'text-gray-500 group-hover:text-purple-600'} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {active && <ChevronRight size={18} />}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
