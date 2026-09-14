import React, { useState } from 'react';
import { Project } from '../../types';
import { portfolioService } from '../../lib/portfolioService';
import { Dialog } from '../ui/Dialog';
import { ImageUploader } from './ImageUploader';
import { Plus, Pencil, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface AdminProjectsProps {
  projects: Project[];
  onProjectsUpdated: (projects: Project[]) => void;
}

export function AdminProjects({ projects, onProjectsUpdated }: AdminProjectsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    sort_order: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      sort_order: projects.length + 1,
    });
    setIsDialogOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      description: proj.description || '',
      image_url: proj.image_url || '',
      link_url: proj.link_url || '',
      sort_order: proj.sort_order || 1,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus project "${title}"?`)) {
      try {
        await portfolioService.deleteProject(id);
        onProjectsUpdated(projects.filter((p) => p.id !== id));
      } catch (err: any) {
        alert('Gagal menghapus: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingProject) {
        const updated = await portfolioService.updateProject(editingProject.id, formData);
        onProjectsUpdated(
          projects.map((p) => (p.id === editingProject.id ? updated : p))
        );
      } else {
        const created = await portfolioService.addProject(formData);
        onProjectsUpdated([...projects, created]);
      }
      setIsDialogOpen(false);
    } catch (err: any) {
      alert('Gagal menyimpan project: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Kelola Projects / Portfolio</h2>
            <p className="text-sm text-slate-500 mt-1">
              Tambahkan karya, portofolio desain, artikel, atau hasil kerja Anda.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Project</span>
          </button>
        </div>

        {/* Responsive Table (overflow-x-auto per PRD 6.4) */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-4">Gambar</th>
                <th className="py-3 px-4">Judul & Deskripsi</th>
                <th className="py-3 px-4">Link Project</th>
                <th className="py-3 px-4 text-center">Urutan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Belum ada project. Klik "Tambah Project" untuk mulai menambahkan.
                  </td>
                </tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 w-20">
                      <div className="w-16 h-10 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        {proj.image_url ? (
                          <img
                            src={proj.image_url}
                            alt={proj.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-sm">
                      <div className="font-semibold text-slate-900 line-clamp-1">
                        {proj.title}
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                        {proj.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {proj.link_url ? (
                        <a
                          href={proj.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline inline-flex items-center gap-1 max-w-[150px] truncate"
                        >
                          <span className="truncate">{proj.link_url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs font-mono text-slate-600">
                      {proj.sort_order || 1}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(proj)}
                          className="p-1.5 rounded-md text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(proj.id, proj.title)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus"
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

      {/* Add / Edit Project Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingProject ? 'Edit Project' : 'Tambah Project Baru'}
        description="Lengkapi detail project portofolio Anda di bawah ini."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUploader
            label="Gambar Project (16:9 Ratio)"
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            bucket="projects"
          />

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1">
              Judul Project *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Nusantara Heritage Brand Identity"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1">
              Deskripsi Singkat *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Jelaskan ruang lingkup, peran, atau hasil dari project ini..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1">
              Link Project (Google Drive / Website / Demo)
            </label>
            <input
              type="url"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              placeholder="https://drive.google.com/... atau https://behance.net/..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1">
              Urutan Tampil
            </label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) =>
                setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
              }
              className="w-24 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
