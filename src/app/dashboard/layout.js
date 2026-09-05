'use client';

import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 md:ml-64 p-4 md:p-8 border border-red-400">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
