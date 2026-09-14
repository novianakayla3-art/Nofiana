import { Skill } from '../../types';
import { Badge } from '../ui/Badge';

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <section id="skills" className="py-14 bg-white border-y border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Keahlian & Kemampuan
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Teknologi, perangkat, dan kompetensi yang digunakan dalam pekerjaan sehari-hari.
          </p>
        </div>

        {/*
          PRD Specification:
          Ditampilkan sebagai kumpulan badge/box sederhana dalam flex flex-wrap gap-2.
          Setiap badge HANYA menampilkan nama skill (contoh: "Canva", "Microsoft Word").
          TIDAK ADA indikator level (Intermediate/Expert/dsb).
          Varian secondary dengan sedikit border biru muda.
        */}
        <div id="skills-list" className="flex flex-wrap gap-2.5">
          {skills.map((skill) => (
            <Badge
              key={skill.id}
              id={`skill-badge-${skill.id}`}
              variant="secondary"
              className="text-sm px-3.5 py-1.5 font-medium rounded-lg"
            >
              {skill.name}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
