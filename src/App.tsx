import { useState, useEffect, useCallback } from 'react';
import { PortfolioData } from './types';
import { portfolioService } from './lib/portfolioService';
import { PublicHome } from './components/public/PublicHome';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminProfile } from './components/admin/AdminProfile';
import { AdminProjects } from './components/admin/AdminProjects';
import { AdminSkills } from './components/admin/AdminSkills';
import { AdminExperience } from './components/admin/AdminExperience';
import { AdminCourses } from './components/admin/AdminCourses';
import { AdminLanguages } from './components/admin/AdminLanguages';
import { AdminContacts } from './components/admin/AdminContacts';

// Normalize and parse route string
function normalizeRoute(raw: string): string {
  if (!raw) return '/';
  let cleaned = raw.trim();

  // Strip query string if embedded in route
  if (cleaned.includes('?')) {
    cleaned = cleaned.split('?')[0];
  }

  // Remove leading '#' if present
  if (cleaned.startsWith('#')) {
    cleaned = cleaned.slice(1);
  }

  // Ensure starts with '/'
  if (!cleaned.startsWith('/')) {
    cleaned = '/' + cleaned;
  }

  // Remove trailing slash unless it's just '/'
  if (cleaned.length > 1 && cleaned.endsWith('/')) {
    cleaned = cleaned.slice(0, -1);
  }

  // Support route aliases
  if (cleaned === '/admin' || cleaned === '/login' || cleaned === '/admin/auth') {
    return '/admin/login';
  }

  return cleaned;
}

// Parse path from pathname, hash or query
function getCurrentRoute(): string {
  if (typeof window === 'undefined') return '/';

  // Support query fallback e.g. ?page=/admin/login or ?route=login or ?login or ?admin
  const urlParams = new URLSearchParams(window.location.search);
  const pageParam = urlParams.get('page') || urlParams.get('route') || urlParams.get('path');
  if (pageParam) {
    return normalizeRoute(pageParam);
  }
  if (urlParams.has('login') || urlParams.has('admin')) {
    return '/admin/login';
  }

  // Support hash fallback e.g. #/admin/login or #admin/login or #login
  if (window.location.hash) {
    const hashRoute = normalizeRoute(window.location.hash);
    if (hashRoute !== '/') {
      return hashRoute;
    }
  }

  const pathname = window.location.pathname;
  if (pathname && pathname !== '/') {
    return normalizeRoute(pathname);
  }

  return '/';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(getCurrentRoute());
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load portfolio data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await portfolioService.getPortfolioData();
        setPortfolioData(data);
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Sync route on popstate and hashchange
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getCurrentRoute());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Keyboard shortcut (Alt + A) for easy developer / admin access during preview testing
  // (strictly no visible links on the public page per PRD)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        const session = portfolioService.getAdminSession();
        if (session) {
          navigate('/admin/dashboard');
        } else {
          navigate('/admin/login');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = useCallback((path: string) => {
    try {
      window.history.pushState(null, '', path);
    } catch {
      // fallback in restricted iframe
      window.location.hash = path;
    }
    setCurrentRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (isLoading || !portfolioData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-medium text-slate-500">Memuat Portofolio...</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // ROUTE 1: /admin/login
  // ==========================================
  if (
    currentRoute === '/admin/login' ||
    currentRoute === '/login' ||
    currentRoute === '/admin'
  ) {
    const session = portfolioService.getAdminSession();
    if (session) {
      // Already logged in -> redirect to dashboard
      navigate('/admin/dashboard');
      return null;
    }

    return (
      <AdminLogin
        onLoginSuccess={() => navigate('/admin/dashboard')}
        onNavigateHome={() => navigate('/')}
      />
    );
  }

  // ==========================================
  // ROUTE 2: /admin/dashboard/** (Protected)
  // ==========================================
  if (currentRoute.startsWith('/admin/dashboard')) {
    const session = portfolioService.getAdminSession();
    // Route guard: PRD Bagian 6.1: jika tidak ada sesi valid, redirect ke /admin/login
    if (!session) {
      navigate('/admin/login');
      return null;
    }

    // Determine sub-tab
    let activeTab = 'overview';
    if (currentRoute === '/admin/dashboard/profile') activeTab = 'profile';
    else if (currentRoute === '/admin/dashboard/projects') activeTab = 'projects';
    else if (currentRoute === '/admin/dashboard/skills') activeTab = 'skills';
    else if (currentRoute === '/admin/dashboard/experience') activeTab = 'experience';
    else if (currentRoute === '/admin/dashboard/courses') activeTab = 'courses';
    else if (currentRoute === '/admin/dashboard/languages') activeTab = 'languages';
    else if (currentRoute === '/admin/dashboard/contacts') activeTab = 'contacts';

    const handleSelectTab = (tab: string) => {
      const newPath = tab === 'overview' ? '/admin/dashboard' : `/admin/dashboard/${tab}`;
      navigate(newPath);
    };

    const handleLogout = () => {
      portfolioService.logoutAdmin();
      navigate('/admin/login');
    };

    return (
      <AdminLayout
        currentTab={activeTab}
        onSelectTab={handleSelectTab}
        onNavigateHome={() => navigate('/')}
        onLogout={handleLogout}
      >
        {activeTab === 'overview' && (
          <AdminOverview
            data={portfolioData}
            onNavigateTab={handleSelectTab}
            onNavigateHome={() => navigate('/')}
          />
        )}

        {activeTab === 'profile' && (
          <AdminProfile
            profile={portfolioData.profile}
            onProfileUpdated={(updatedProfile) =>
              setPortfolioData({ ...portfolioData, profile: updatedProfile })
            }
          />
        )}

        {activeTab === 'projects' && (
          <AdminProjects
            projects={portfolioData.projects}
            onProjectsUpdated={(updatedProjects) =>
              setPortfolioData({ ...portfolioData, projects: updatedProjects })
            }
          />
        )}

        {activeTab === 'skills' && (
          <AdminSkills
            skills={portfolioData.skills}
            onSkillsUpdated={(updatedSkills) =>
              setPortfolioData({ ...portfolioData, skills: updatedSkills })
            }
          />
        )}

        {activeTab === 'experience' && (
          <AdminExperience
            experiences={portfolioData.experiences}
            onExperiencesUpdated={(updatedExperiences) =>
              setPortfolioData({ ...portfolioData, experiences: updatedExperiences })
            }
          />
        )}

        {activeTab === 'courses' && (
          <AdminCourses
            courses={portfolioData.courses}
            onCoursesUpdated={(updatedCourses) =>
              setPortfolioData({ ...portfolioData, courses: updatedCourses })
            }
          />
        )}

        {activeTab === 'languages' && (
          <AdminLanguages
            languages={portfolioData.languages}
            onLanguagesUpdated={(updatedLanguages) =>
              setPortfolioData({ ...portfolioData, languages: updatedLanguages })
            }
          />
        )}

        {activeTab === 'contacts' && (
          <AdminContacts
            contacts={portfolioData.contacts}
            onContactsUpdated={(updatedContacts) =>
              setPortfolioData({ ...portfolioData, contacts: updatedContacts })
            }
          />
        )}
      </AdminLayout>
    );
  }

  // ==========================================
  // ROUTE 3: / (Homepage Publik)
  // ==========================================
  return (
    <PublicHome
      data={portfolioData}
      onNavigateAdmin={() => navigate('/admin/login')}
    />
  );
}
