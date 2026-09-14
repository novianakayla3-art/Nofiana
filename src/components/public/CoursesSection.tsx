import { Course } from '../../types';
import { Award, Building2, Calendar, MapPin } from 'lucide-react';

interface CoursesSectionProps {
  courses: Course[];
}

export function CoursesSection({ courses }: CoursesSectionProps) {
  if (!courses || courses.length === 0) return null;

  const sorted = [...courses].sort((a, b) => {
    return (a.sort_order || 0) - (b.sort_order || 0);
  });

  return (
    <section id="courses" className="py-16 bg-slate-50/50 border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center sm:text-left mb-12">
          <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            Pengembangan Diri
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-1">
            Pelatihan & Sertifikasi
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Program pelatihan, workshop, dan sertifikasi profesional yang telah diselesaikan.
          </p>
        </div>

        {/*
          PRD Specification:
          Struktur mirip Experience:
          - Nama course/pelatihan
          - Penyelenggara
          - Tahun
          - Lokasi
          - Deskripsi singkat
        */}
        <div id="courses-list" className="grid grid-cols-1 gap-6">
          {sorted.map((crs) => (
            <div
              key={crs.id}
              id={`course-item-${crs.id}`}
              className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {crs.name}
                    </h3>
                    {crs.organizer && (
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mt-1">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span>{crs.organizer}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tahun */}
                {crs.year && (
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-200/50 self-start">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{crs.year}</span>
                  </div>
                )}
              </div>

              {/* Lokasi */}
              {crs.location && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2 sm:ml-12">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{crs.location}</span>
                </div>
              )}

              {/* Deskripsi */}
              {crs.description && (
                <p className="text-sm text-slate-600 leading-relaxed mt-3 sm:ml-12 pt-3 border-t border-slate-100">
                  {crs.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
