import React, { useState } from 'react';
import { Profile } from '../../types';
import { portfolioService } from '../../lib/portfolioService';
import { ImageUploader } from './ImageUploader';
import { Save, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface AdminProfileProps {
  profile: Profile;
  onProfileUpdated: (updated: Profile) => void;
}

export function AdminProfile({ profile, onProfileUpdated }: AdminProfileProps) {
  const [formData, setFormData] = useState<Profile>({ ...profile });
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const updated = await portfolioService.updateProfile(formData);
      onProfileUpdated(updated);
      setStatusMessage({
        type: 'success',
        text: 'Data profil berhasil diperbarui! Perubahan langsung aktif di homepage.',
      });
      // Dynamic title update in document
      document.title = `${updated.name} | Personal Portfolio Website`;
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: 'Gagal memperbarui profil: ' + (err.message || 'Terjadi kesalahan'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <div className="mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Kelola Data Profil</h2>
          <p className="text-sm text-slate-500 mt-1">
            Data ini ditampilkan pada bagian utama (Hero Section) website portofolio publik.
          </p>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-lg mb-6 flex items-start gap-3 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{statusMessage.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Foto Profil */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <ImageUploader
              label="Foto Profil (1:1 Ratio)"
              value={formData.avatar_url}
              onChange={(url) => setFormData({ ...formData, avatar_url: url })}
              bucket="avatars"
            />
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1.5">
              Nama Lengkap *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Rania Maharani"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <p className="text-2xs text-slate-500 mt-1">
              Kata pertama otomatis diwarnai biru pada hero section sesuai standar desain PRD.
            </p>
          </div>

          {/* Tagline / Jabatan */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1.5">
              Tagline / Jabatan *
            </label>
            <input
              type="text"
              required
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Contoh: Graphic Designer & Visual Storyteller"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1.5">
              Status Ketersediaan
            </label>
            <input
              type="text"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              placeholder="Contoh: Terbuka untuk Kolaborasi"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <p className="text-2xs text-slate-500 mt-1">
              Ditampilkan dengan indikator dot hijau di bawah foto profil pada hero section.
            </p>
          </div>

          {/* Deskripsi Singkat */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1.5">
              Deskripsi Singkat (2-3 Kalimat) *
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Jelaskan secara ringkas siapa Anda dan nilai yang Anda tawarkan..."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* Link Resume (Kondisional) */}
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200/60">
            <div className="flex items-start gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <label className="block text-xs font-semibold uppercase text-blue-900 tracking-wider">
                  Link Resume (Google Drive / Dokumen) — Opsional
                </label>
                <p className="text-2xs text-slate-600 mt-0.5">
                  Aturan PRD: Jika field ini diisi, tombol "Resume" akan muncul di hero section homepage. Jika dikosongkan, tombol tersebut tidak akan dirender di DOM.
                </p>
              </div>
            </div>
            <input
              type="url"
              value={formData.resume_url || ''}
              onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* Tombol Simpan */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
