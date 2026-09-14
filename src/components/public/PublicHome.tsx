import { useEffect } from 'react';
import { PortfolioData } from '../../types';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { SkillsSection } from './SkillsSection';
import { ProjectsSection } from './ProjectsSection';
import { ExperienceSection } from './ExperienceSection';
import { CoursesSection } from './CoursesSection';
import { LanguagesSection } from './LanguagesSection';
import { ContactSection } from './ContactSection';
import { Footer } from './Footer';

interface PublicHomeProps {
  data: PortfolioData;
  onNavigateAdmin?: () => void;
}

export function PublicHome({ data, onNavigateAdmin }: PublicHomeProps) {
  // PRD Bagian 5: Format title: "{nama}" | Personal Portfolio Website
  useEffect(() => {
    const name = data.profile?.name ?? 'Portofolio';
    document.title = `${name} | Personal Portfolio Website`;
  }, [data.profile?.name]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar name={data.profile?.name} />

      <main>
        {/* 4.1 Hero Section */}
        <HeroSection profile={data.profile} />

        {/* 4.2 Skills Section */}
        <SkillsSection skills={data.skills} />

        {/* 4.3 Portfolio / Projects Section */}
        <ProjectsSection projects={data.projects} />

        {/* 4.4 Experience Section */}
        <ExperienceSection experiences={data.experiences} />

        {/* 4.5 Course & Training Section */}
        <CoursesSection courses={data.courses} />

        {/* 4.6 Languages Section */}
        <LanguagesSection languages={data.languages} />

        {/* 4.7 Kontak Section */}
        <ContactSection contacts={data.contacts} />
      </main>

      {/* Footer Publik */}
      <Footer name={data.profile?.name} onNavigateAdmin={onNavigateAdmin} />
    </div>
  );
}
