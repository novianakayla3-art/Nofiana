import React, { useState } from 'react';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Layers,
  GraduationCap,
  Languages as LangIcon,
  Phone,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Database,
  CheckCircle2,
  FolderGit2,
} from 'lucide-react';
import { portfolioService } from '../../lib/portfolioService';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
  onNavigateHome: () => void;
  onLogout: () => void;
}

export function AdminLayout({
  currentTab,
  onSelectTab,
  children,
  onNavigateHome,
  onLogout,
}: AdminLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showDbInfo, setShowDbInfo] = useState(false);
  const session = portfolioService.getAdminSession();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profil Saya', icon: User },
    { id: 'projects', label: 'Project & Portfolio', icon: FolderGit2 },
    { id: 'skills', label: 'Skills', icon: Layers },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'courses', label: 'Course & Training', icon: GraduationCap },
    { id: 'languages', label: 'Languages', icon: LangIcon },
    { id: 'contacts', label: 'Kontak', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">
              Dashboard Admin
            </h1>
            <p className="text-2xs text-slate-500">{session?.email || 'Admin'}</p>
          </div>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:w-64 bg-white border-r border-slate-200 flex-col shrink-0 min-h-screen sticky top-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
              A
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Admin Portofolio</h2>
              <p className="text-xs text-slate-500 truncate max-w-[140px]">
                {session?.email || 'admin@portfolio'}
              </p>
            </div>
          </div>

          {/* Supabase status pill */}
          <div
            onClick={() => setShowDbInfo(true)}
            className="mt-3.5 flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>{isSupabaseConfigured ? 'Supabase Live' : 'Penyimpanan Aktif'}</span>
            </div>
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
            ></span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 space-y-1 bg-slate-50/50">
          <button
            onClick={onNavigateHome}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-white transition-colors cursor-pointer text-left"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>Lihat Website Publik</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs flex">
          <div className="w-72 max-w-[80vw] bg-white h-full flex flex-col shadow-xl animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Dashboard Admin</h3>
                <p className="text-2xs text-slate-500">{session?.email}</p>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-3 border-t border-slate-100 space-y-1 bg-slate-50">
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  onNavigateHome();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700"
              >
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>Lihat Website Publik</span>
              </button>
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileNavOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Database Status Modal */}
      {showDbInfo && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">Koneksi Database</h3>
              </div>
              <button
                onClick={() => setShowDbInfo(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-1">
                  Status Saat Ini
                </p>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>
                    {isSupabaseConfigured
                      ? 'Terkoneksi ke Supabase PostgreSQL & Storage'
                      : 'Mode Penyimpanan Lokal Terpadu (Persisten)'}
                  </span>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                Seluruh perubahan data (profil, project, keahlian, pengalaman, pelatihan, bahasa, dan kontak) tersimpan secara aman dan langsung ditampilkan di website publik.
              </p>
              <p className="text-xs text-slate-500">
                Untuk menghubungkan ke project Supabase eksternal, isi variabel <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-mono text-2xs">VITE_SUPABASE_URL</code> dan <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-mono text-2xs">VITE_SUPABASE_ANON_KEY</code>.
              </p>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowDbInfo(false)}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
