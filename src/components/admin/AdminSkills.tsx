import React, { useState } from 'react';
import { Skill } from '../../types';
import { portfolioService } from '../../lib/portfolioService';
import { Plus, Pencil, Trash2, Layers } from 'lucide-react';
import { Dialog } from '../ui/Dialog';

interface AdminSkillsProps {
  skills: Skill[];
  onSkillsUpdated: (skills: Skill[]) => void;
}

export function AdminSkills({ skills, onSkillsUpdated }: AdminSkillsProps) {
  const [newSkillName, setNewSkillName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editName, setEditName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setIsAdding(true);
    try {
      const added = await portfolioService.addSkill(newSkillName.trim());
      onSkillsUpdated([...skills, added]);
      setNewSkillName('');
    } catch (err: any) {
      alert('Gagal menambah skill: ' + err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setEditName(skill.name);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editName.trim()) return;

    setIsUpdating(true);
    try {
      const updated = await portfolioService.updateSkill(editingSkill.id, editName.trim());
      onSkillsUpdated(skills.map((s) => (s.id === editingSkill.id ? updated : s)));
      setEditingSkill(null);
    } catch (err: any) {
      alert('Gagal mengupdate skill: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Hapus keahlian "${name}"?`)) {
      try {
        await portfolioService.deleteSkill(id);
        onSkillsUpdated(skills.filter((s) => s.id !== id));
      } catch (err: any) {
        alert('Gagal menghapus skill: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <div className="pb-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Kelola Skills / Keahlian</h2>
          <p className="text-sm text-slate-500 mt-1">
            Sesuai PRD Bagian 4.2, keahlian ditampilkan sebagai badge sederhana nama skill tanpa indikator level.
          </p>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleAdd} className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="Ketik nama skill (contoh: Canva, Figma, Copywriting)..."
            className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isAdding || !newSkillName.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdding ? 'Menambahkan...' : 'Tambah Skill'}</span>
          </button>
        </form>

        {/* Skills list table/tags */}
        <div className="mt-8">
          <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-3">
            Daftar Skill Saat Ini ({skills.length})
          </h3>

          {skills.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">
              Belum ada keahlian yang terdaftar. Tambahkan sekarang di atas.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Layers className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-sm font-medium text-slate-900 truncate">
                      {skill.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      onClick={() => handleOpenEdit(skill)}
                      className="p-1 text-slate-500 hover:text-blue-600 rounded hover:bg-white"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id, skill.name)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-white"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Skill Dialog */}
      <Dialog
        isOpen={Boolean(editingSkill)}
        onClose={() => setEditingSkill(null)}
        title="Edit Nama Keahlian"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1">
              Nama Skill
            </label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditingSkill(null)}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
            >
              {isUpdating ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
