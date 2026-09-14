import React, { useState } from 'react';
import { Contact, ContactType } from '../../types';
import { portfolioService } from '../../lib/portfolioService';
import { Dialog } from '../ui/Dialog';
import { Plus, Pencil, Trash2, MessageCircle, Mail, Instagram, Linkedin, ExternalLink } from 'lucide-react';

interface AdminContactsProps {
  contacts: Contact[];
  onContactsUpdated: (contacts: Contact[]) => void;
}

export function AdminContacts({ contacts, onContactsUpdated }: AdminContactsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<{
    type: ContactType;
    value: string;
  }>({
    type: 'whatsapp',
    value: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactTypes: { id: ContactType; label: string; icon: any; placeholder: string }[] = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      placeholder: '6281234567890 (dengan kode negara tanpa +)',
    },
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      placeholder: 'nama@domain.com',
    },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      placeholder: 'username atau https://instagram.com/username',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      placeholder: 'username atau https://linkedin.com/in/username',
    },
  ];

  const openAdd = () => {
    setEditingContact(null);
    setFormData({
      type: 'whatsapp',
      value: '',
    });
    setIsDialogOpen(true);
  };

  const openEdit = (cnt: Contact) => {
    setEditingContact(cnt);
    setFormData({
      type: cnt.type,
      value: cnt.value,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, label: string) => {
    if (confirm(`Hapus kontak ${label}?`)) {
      try {
        await portfolioService.deleteContact(id);
        onContactsUpdated(contacts.filter((c) => c.id !== id));
      } catch (err: any) {
        alert('Gagal menghapus: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.value.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingContact) {
        const updated = await portfolioService.updateContact(editingContact.id, formData);
        onContactsUpdated(
          contacts.map((c) => (c.id === editingContact.id ? updated : c))
        );
      } else {
        const created = await portfolioService.addContact(formData);
        onContactsUpdated([...contacts, created]);
      }
      setIsDialogOpen(false);
    } catch (err: any) {
      alert('Gagal menyimpan kontak: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getContactIcon = (type: ContactType) => {
    switch (type) {
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4 text-emerald-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-600" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-blue-700" />;
      default:
        return <ExternalLink className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Kelola Saluran Kontak</h2>
            <p className="text-sm text-slate-500 mt-1">
              Sesuai PRD Bagian 4.7: WhatsApp, Email, Instagram, dan LinkedIn.
            </p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kontak</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-4">Tipe Saluran</th>
                <th className="py-3 px-4">Nilai / Alamat / Nomor</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400">
                    Belum ada saluran kontak. Tambahkan sekarang.
                  </td>
                </tr>
              ) : (
                contacts.map((cnt) => (
                  <tr key={cnt.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2.5 capitalize">
                      {getContactIcon(cnt.type)}
                      <span>{cnt.type}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono text-xs">
                      {cnt.value}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(cnt)}
                          className="p-1.5 rounded-md text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cnt.id, cnt.type)}
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
        title={editingContact ? 'Edit Saluran Kontak' : 'Tambah Saluran Kontak'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1">
              Tipe Saluran *
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as ContactType })
              }
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {contactTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1">
              Nilai / Nomor / Alamat *
            </label>
            <input
              type="text"
              required
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder={
                contactTypes.find((t) => t.id === formData.type)?.placeholder || 'Isi nilai kontak...'
              }
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
