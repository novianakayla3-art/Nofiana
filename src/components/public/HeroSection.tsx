import { Profile } from '../../types';
import { Badge } from '../ui/Badge';
import { ArrowDown, FileText } from 'lucide-react';

interface HeroSectionProps {
  profile: Profile;
}

export function HeroSection({ profile }: HeroSectionProps) {
  // Format name: first word colored blue, rest dark
  const renderStyledName = (fullName: string) => {
    if (!fullName) return <span className="text-blue-600">Portofolio</span>;
    const parts = fullName.trim().split(' ');
    const firstName = parts[0];
    const restName = parts.slice(1).join(' ');

    return (
      <>
        <span className="text-blue-600">{firstName}</span>
        {restName && <span className="text-slate-900"> {restName}</span>}
      </>
    );
  };

  const hasResume = Boolean(profile.resume_url && profile.resume_url.trim() !== '');

  return (
    <section
      id="hero"
      className="pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/*
          PRD Specification:
          Desktop (>= md): grid 2 columns (grid-cols-2).
          Left column: Photo 1:1 ratio, rounded-xl, border/shadow tipis. Under photo: status with dot indicator.
          Right column: Badge -> Name -> Tagline -> Description -> Action buttons.

          Mobile (< md): grid-cols-1 / flex-col.
          Order: Photo on top -> status label -> badge -> name -> tagline -> description -> full-width action buttons.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* Photo & Status Column */}
          <div className="flex flex-col items-center md:items-start order-1">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-84 md:h-84 lg:w-96 lg:h-96 rounded-xl overflow-hidden border border-slate-200/90 shadow-sm bg-white p-1.5">
              <img
                id="hero-avatar"
                src={
                  profile.avatar_url ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
                }
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Status dot indicator */}
            {profile.status && (
              <div
                id="hero-status-indicator"
                className="mt-3.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-2xs text-xs font-medium text-slate-700"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{profile.status}</span>
              </div>
            )}
          </div>

          {/* Content Column */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left order-2">
            {/* 1. Badge kecil: Portofolio Profesional (outline biru) */}
            <div className="mb-3.5">
              <Badge variant="blue-outline">Portofolio Profesional</Badge>
            </div>

            {/* 2. Nama besar: nama depan biru, sisanya gelap */}
            <h1
              id="hero-name"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
            >
              {renderStyledName(profile.name)}
            </h1>

            {/* 3. Tagline / jabatan */}
            {profile.tagline && (
              <p
                id="hero-tagline"
                className="mt-3 text-lg sm:text-xl font-medium text-slate-700"
              >
                {profile.tagline}
              </p>
            )}

            {/* 4. Deskripsi singkat (2-3 kalimat) */}
            <p
              id="hero-description"
              className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl"
            >
              {profile.description}
            </p>

            {/* 5. Tombol aksi */}
            <div
              id="hero-actions"
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"
            >
              {/* Hubungi Saya: primary solid blue */}
              <a
                id="hero-btn-contact"
                href="#contact"
                className="inline-flex items-center justify-center font-medium rounded-lg px-6 py-3 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer text-center"
              >
                Hubungi Saya
              </a>

              {/* Lihat Project: secondary/outline */}
              <a
                id="hero-btn-projects"
                href="#projects"
                className="inline-flex items-center justify-center font-medium rounded-lg px-6 py-3 text-sm sm:text-base bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-colors cursor-pointer text-center"
              >
                Lihat Project
                <ArrowDown className="w-4 h-4 ml-2 opacity-70" />
              </a>

              {/* Resume: KONDISIONAL - HANYA dirender jika resume_url tidak kosong/null */}
              {hasResume && (
                <a
                  id="hero-btn-resume"
                  href={profile.resume_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center font-medium rounded-lg px-6 py-3 text-sm sm:text-base bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors cursor-pointer text-center"
                >
                  <FileText className="w-4 h-4 mr-2 text-blue-600" />
                  Resume
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
