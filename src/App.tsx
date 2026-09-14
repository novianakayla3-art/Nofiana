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

// Parse path from pathname, hash or query
function getCurrentRoute(): string {
  if (typeof window === 'undefined') return '/';
  
  const pathname = window.location.pathname;
  if (pathname && pathname !== '/') {
    return pathname;
  }

  // Support hash fallback e.g. #/admin/login
  if (window.location.hash.startsWith('#/')) {
    return window.location.hash.slice(1);
  }

  // Support query fallback e.g. ?page=/admin/login
  const urlParams = new URLSearchParams(window.location.search);
  const pageParam = urlParams.get('page') || urlParams.get('route');
  if (pageParam) {
    return pageParam;
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
  if (currentRoute === '/admin/login') {
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
  return <PublicHome data={portfolioData} />;
}
