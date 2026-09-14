import { Experience } from '../../types';
import { Briefcase, MapPin, Calendar } from 'lucide-react';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  if (!experiences || experiences.length === 0) return null;

  // Ensure sorted descending
  const sorted = [...experiences].sort((a, b) => {
    return (a.sort_order || 0) - (b.sort_order || 0);
  });

  return (
    <section id="experience" className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center sm:text-left mb-12">
          <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            Rekam Jejak
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-1">
            Pengalaman Kerja
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Riwayat karier dan tanggung jawab profesional yang pernah diemban.
          </p>
        </div>

        {/*
          PRD Specification:
          Ditampilkan sebagai timeline/list vertikal.
          Setiap item menampilkan:
          - Nama instansi/perusahaan.
          - Tahun (periode, contoh: "2022 — 2024").
          - Lokasi.
          - Deskripsi singkat peran/tanggung jawab.
          Diurutkan dari yang terbaru.
        */}
        <div id="experience-timeline" className="relative pl-6 sm:pl-8 border-l-2 border-blue-100 space-y-10">
          {sorted.map((exp) => (
            <div
              key={exp.id}
              id={`experience-item-${exp.id}`}
              className="relative group"
            >
              {/* Timeline marker icon */}
              <div className="absolute -left-9 sm:-left-11 top-0.5 w-6 h-6 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center shadow-xs">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              </div>

              {/* Content card */}
              <div className="bg-slate-50/60 rounded-xl p-5 border border-slate-200/80 hover:border-blue-200 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {exp.institution}
                  </h3>
                  {/* Tahun (periode, contoh: "2022 — 2024") */}
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60 self-start sm:self-auto">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {exp.year_start} {exp.year_end ? `— ${exp.year_end}` : ''}
                    </span>
                  </div>
                </div>

                {/* Peran / Role */}
                {exp.role && (
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-800 mb-2">
                    <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{exp.role}</span>
                  </div>
                )}

                {/* Lokasi */}
                {exp.location && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>{exp.location}</span>
                  </div>
                )}

                {/* Deskripsi singkat peran/tanggung jawab */}
                {exp.description && (
                  <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
