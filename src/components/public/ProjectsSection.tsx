import { Project } from '../../types';
import { ExternalLink } from 'lucide-react';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
              Portofolio Pilihan
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-1">
              Karya & Project
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
              Koleksi project terpilih yang telah diselesaikan untuk berbagai klien dan inisiatif kreatif.
            </p>
          </div>
        </div>

        {/*
          PRD Specification:
          Grid card:
          Mobile: 1 kolom (grid-cols-1)
          Tablet (sm): 2 kolom (sm:grid-cols-2)
          Desktop (lg): 3 kolom (lg:grid-cols-3)
        */}
        <div
          id="projects-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {projects.map((project) => (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group"
            >
              {/* Gambar project (rasio 16:9, object-cover, rounded) */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={
                    project.image_url ||
                    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
              </div>

              {/* Card content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  {/* Deskripsi singkat (di-truncate/line-clamp jika terlalu panjang) */}
                  <p className="text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Link ("Lihat Project →") */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {project.link_url ? (
                    <a
                      href={project.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Lihat Project
                      <span aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">Dokumentasi Internal</span>
                  )}
                  {project.link_url && (
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
