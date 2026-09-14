import React, { useState } from 'react';
import { Experience } from '../../types';
import { portfolioService } from '../../lib/portfolioService';
import { Dialog } from '../ui/Dialog';
import { Plus, Pencil, Trash2, Calendar, MapPin } from 'lucide-react';

interface AdminExperienceProps {
  experiences: Experience[];
  onExperiencesUpdated: (experiences: Experience[]) => void;
}

export function AdminExperience({
  experiences,
  onExperiencesUpdated,
}: AdminExperienceProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [formData, setFormData] = useState({
    institution: '',
    role: '',
    year_start: '',
    year_end: '',
    location: '',
    description: '',
    sort_order: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAdd = () => {
    setEditingExp(null);
    setFormData({
      institution: '',
      role: '',
      year_start: new Date().getFullYear().toString(),
      year_end: 'Sekarang',
      location: '',
      description: '',
      sort_order: experiences.length + 1,
    });
    setIsDialogOpen(true);
  };

  const openEdit = (exp: Experience) => {
    setEditingExp(exp);
    setFormData({
      institution: exp.institution,
      role: exp.role || '',
      year_start: exp.year_start,
      year_end: exp.year_end || '',
      location: exp.location || '',
      description: exp.description || '',
      sort_order: exp.sort_order || 1,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, institution: string) => {
    if (confirm(`Hapus pengalaman di "${institution}"?`)) {
      try {
        await portfolioService.deleteExperience(id);
        onExperiencesUpdated(experiences.filter((e) => e.id !== id));
      } catch (err: any) {
        alert('Gagal menghapus: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingExp) {
        const updated = await portfolioService.updateExperience(editingExp.id, formData);
        onExperiencesUpdated(
          experiences.map((e) => (e.id === editingExp.id ? updated : e))
        );
      } else {
        const created = await portfolioService.addExperience(formData);
        onExperiencesUpdated([...experiences, created]);
      }
      setIsDialogOpen(false);
    } catch (err: any) {
      alert('Gagal menyimpan: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Kelola Pengalaman Kerja</h2>
            <p className="text-sm text-slate-500 mt-1">
              Daftar rekam jejak karier, institusi tempat bekerja, dan peran yang dijalani.
            </p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pengalaman</span>
          </button>
        </div>

        {/* Table responsive */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-4">Instansi & Peran</th>
                <th className="py-3 px-4">Periode</th>
                <th className="py-3 px-4">Lokasi</th>
                <th className="py-3 px-4">Deskripsi</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {experiences.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Belum ada data pengalaman kerja.
                  </td>
                </tr>
              ) : (
                experiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-medium">
                      <div className="font-semibold text-slate-900">{exp.institution}</div>
                      <div className="text-xs text-blue-600">{exp.role || '-'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                      {exp.year_start} {exp.year_end ? `— ${exp.year_end}` : ''}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {exp.location || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">
                      {exp.description || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(exp)}
                          className="p-1.5 rounded-md text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id, exp.institution)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingExp ? 'Edit Pengalaman' : 'Tambah Pengalaman Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1">
              Nama Instansi / Perusahaan *
            </label>
            <input
              type="text"
              required
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="Contoh: Studio Kreatif Nusantara"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1">
              Peran / Jabatan
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="Contoh: Lead Brand Designer"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1">
                Tahun Mulai *
              </label>
              <input
                type="text"
                required
                value={formData.year_start}
                onChange={(e) => setFormData({ ...formData, year_start: e.target.value })}
                placeholder="2022"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1">
                Tahun Selesai
              </label>
              <input
                type="text"
                value={formData.year_end}
                onChange={(e) => setFormData({ ...formData, year_end: e.target.value })}
                placeholder="Sekarang / 2024"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1">
              Lokasi
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Contoh: Jakarta, Indonesia / Remote"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1">
              Deskripsi Singkat Peran / Tanggung Jawab
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Jelaskan peran utama dan pencapaian Anda..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
