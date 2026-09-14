import React, { useState } from 'react';
import { Course } from '../../types';
import { portfolioService } from '../../lib/portfolioService';
import { Dialog } from '../ui/Dialog';
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';

interface AdminCoursesProps {
  courses: Course[];
  onCoursesUpdated: (courses: Course[]) => void;
}

export function AdminCourses({ courses, onCoursesUpdated }: AdminCoursesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    organizer: '',
    year: '',
    location: '',
    description: '',
    sort_order: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAdd = () => {
    setEditingCourse(null);
    setFormData({
      name: '',
      organizer: '',
      year: new Date().getFullYear().toString(),
      location: 'Online',
      description: '',
      sort_order: courses.length + 1,
    });
    setIsDialogOpen(true);
  };

  const openEdit = (crs: Course) => {
    setEditingCourse(crs);
    setFormData({
      name: crs.name,
      organizer: crs.organizer || '',
      year: crs.year || '',
      location: crs.location || '',
      description: crs.description || '',
      sort_order: crs.sort_order || 1,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Hapus pelatihan/sertifikasi "${name}"?`)) {
      try {
        await portfolioService.deleteCourse(id);
        onCoursesUpdated(courses.filter((c) => c.id !== id));
      } catch (err: any) {
        alert('Gagal menghapus: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCourse) {
        const updated = await portfolioService.updateCourse(editingCourse.id, formData);
        onCoursesUpdated(
          courses.map((c) => (c.id === editingCourse.id ? updated : c))
        );
      } else {
        const created = await portfolioService.addCourse(formData);
        onCoursesUpdated([...courses, created]);
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
            <h2 className="text-xl font-bold text-slate-900">Kelola Course & Training</h2>
            <p className="text-sm text-slate-500 mt-1">
              Catat program pelatihan, workshop, bootcamp, atau sertifikasi yang telah diikuti.
            </p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pelatihan</span>
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-4">Nama Pelatihan</th>
                <th className="py-3 px-4">Penyelenggara</th>
                <th className="py-3 px-4">Tahun & Lokasi</th>
                <th className="py-3 px-4">Deskripsi</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Belum ada data pelatihan.
                  </td>
                </tr>
              ) : (
                courses.map((crs) => (
                  <tr key={crs.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {crs.name}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {crs.organizer || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                      {crs.year} {crs.location ? `(${crs.location})` : ''}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 max-w-xs truncate">
                      {crs.description || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(crs)}
                          className="p-1.5 rounded-md text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(crs.id, crs.name)}
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
        title={editingCourse ? 'Edit Pelatihan' : 'Tambah Pelatihan Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1">
              Nama Course / Pelatihan *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Mastering Brand Identity & Visual Systems"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1">
              Penyelenggara
            </label>
            <input
              type="text"
              value={formData.organizer}
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
              placeholder="Contoh: Creative Hub Asia / Universitas..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1">
                Tahun
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2024"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1">
                Lokasi
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Online / Jakarta"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1">
              Deskripsi Singkat Pelatihan
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Jelaskan topik yang dipelajari atau sertifikat yang didapat..."
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
