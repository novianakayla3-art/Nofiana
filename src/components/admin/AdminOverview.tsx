import { PortfolioData } from '../../types';
import {
  FolderGit2,
  Layers,
  Briefcase,
  GraduationCap,
  Languages,
  Phone,
  ArrowUpRight,
  User,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface AdminOverviewProps {
  data: PortfolioData;
  onNavigateTab: (tab: string) => void;
  onNavigateHome: () => void;
}

export function AdminOverview({
  data,
  onNavigateTab,
  onNavigateHome,
}: AdminOverviewProps) {
  const stats = [
    {
      label: 'Projects',
      count: data.projects.length,
      tab: 'projects',
      icon: FolderGit2,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Skills',
      count: data.skills.length,
      tab: 'skills',
      icon: Layers,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      label: 'Experience',
      count: data.experiences.length,
      tab: 'experience',
      icon: Briefcase,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Course & Training',
      count: data.courses.length,
      tab: 'courses',
      icon: GraduationCap,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Languages',
      count: data.languages.length,
      tab: 'languages',
      icon: Languages,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      label: 'Kontak',
      count: data.contacts.length,
      tab: 'contacts',
      icon: Phone,
      color: 'text-rose-600 bg-rose-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Selamat Datang di Dashboard Admin
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            {data.profile.name || 'Portofolio Pribadi'}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Kelola seluruh konten portofolio mulai dari profil, karya project, keahlian, hingga riwayat pengalaman kerja dan kontak.
          </p>
        </div>
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <span>Preview Website</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0">
              <img
                src={data.profile.avatar_url}
                alt={data.profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{data.profile.name}</h3>
              <p className="text-xs text-slate-500">{data.profile.tagline}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('profile')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Edit Profil →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Status:{' '}
              <strong className="text-slate-900 font-semibold">
                {data.profile.status || 'Belum diatur'}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Tombol Resume:{' '}
              <strong
                className={`font-semibold ${
                  data.profile.resume_url ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                {data.profile.resume_url ? 'Aktif (URL Terisi)' : 'Non-aktif (Kosong)'}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.tab}
              onClick={() => onNavigateTab(item.tab)}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all">
                  →
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{item.count}</p>
              <p className="text-xs font-medium text-slate-500 mt-1">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
