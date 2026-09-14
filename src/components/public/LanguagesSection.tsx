import { Language } from '../../types';

interface LanguagesSectionProps {
  languages: Language[];
}

export function LanguagesSection({ languages }: LanguagesSectionProps) {
  if (!languages || languages.length === 0) return null;

  const sorted = [...languages].sort((a, b) => {
    return (a.sort_order || 0) - (b.sort_order || 0);
  });

  return (
    <section id="languages" className="py-14 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Bahasa
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Bahasa komunikasi yang dikuasai untuk keperluan kolaborasi dan profesional.
          </p>
        </div>

        {/*
          PRD Specification:
          Ditampilkan sebagai daftar teks sederhana, format: {Nama Bahasa} — {Level}
          Contoh: Bahasa Indonesia — Native, Bahasa Inggris — Intermediate
          TIDAK ADA progress bar, star rating, atau indikator visual lain — murni teks!
        */}
        <ul id="languages-list" className="divide-y divide-slate-100">
          {sorted.map((lang) => (
            <li
              key={lang.id}
              id={`language-item-${lang.id}`}
              className="py-3 text-base sm:text-lg text-slate-800"
            >
              <span className="font-semibold text-slate-900">{lang.name}</span>
              <span className="text-slate-400 mx-2">—</span>
              <span className="text-slate-600 font-normal">{lang.level}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
