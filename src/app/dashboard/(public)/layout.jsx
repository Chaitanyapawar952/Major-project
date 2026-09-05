'use client';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  );
}
