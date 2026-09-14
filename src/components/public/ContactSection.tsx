import { Contact } from '../../types';
import { Mail, MessageCircle, Instagram, Linkedin, ExternalLink } from 'lucide-react';

interface ContactSectionProps {
  contacts: Contact[];
}

export function ContactSection({ contacts }: ContactSectionProps) {
  if (!contacts || contacts.length === 0) return null;

  const getContactDetails = (contact: Contact) => {
    switch (contact.type) {
      case 'whatsapp': {
        const clean = contact.value.replace(/[^0-9]/g, '');
        return {
          label: 'WhatsApp',
          display: contact.value.startsWith('+') ? contact.value : `+${contact.value}`,
          href: `https://wa.me/${clean}`,
          icon: <MessageCircle className="w-5 h-5 text-emerald-600" />,
          bg: 'hover:border-emerald-200 hover:bg-emerald-50/50',
        };
      }
      case 'email': {
        return {
          label: 'Email',
          display: contact.value,
          href: `mailto:${contact.value}`,
          icon: <Mail className="w-5 h-5 text-blue-600" />,
          bg: 'hover:border-blue-200 hover:bg-blue-50/50',
        };
      }
      case 'instagram': {
        const handle = contact.value.replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace('@', '');
        return {
          label: 'Instagram',
          display: `@${handle}`,
          href: contact.value.startsWith('http') ? contact.value : `https://instagram.com/${handle}`,
          icon: <Instagram className="w-5 h-5 text-pink-600" />,
          bg: 'hover:border-pink-200 hover:bg-pink-50/50',
        };
      }
      case 'linkedin': {
        const username = contact.value.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '');
        return {
          label: 'LinkedIn',
          display: username || 'Profil LinkedIn',
          href: contact.value.startsWith('http') ? contact.value : `https://linkedin.com/in/${username}`,
          icon: <Linkedin className="w-5 h-5 text-blue-700" />,
          bg: 'hover:border-blue-300 hover:bg-blue-50/50',
        };
      }
      default:
        return {
          label: 'Kontak',
          display: contact.value,
          href: contact.value,
          icon: <ExternalLink className="w-5 h-5 text-slate-600" />,
          bg: 'hover:border-slate-300 hover:bg-slate-50',
        };
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            Hubungi Saya
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-1">
            Mari Berkolaborasi
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Tertarik untuk berkolaborasi dalam project atau sekadar menyapa? Silakan hubungi melalui salah satu saluran berikut:
          </p>
        </div>

        {/*
          PRD Specification:
          Layout: grid/flex ikon + label, responsive (wrap ke bawah di mobile).
          WhatsApp, Email, Instagram, LinkedIn.
        */}
        <div
          id="contact-channels"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {contacts.map((contact) => {
            const detail = getContactDetails(contact);
            return (
              <a
                key={contact.id}
                id={`contact-item-${contact.id}`}
                href={detail.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 sm:p-5 rounded-xl border border-slate-200 bg-white flex items-center justify-between shadow-2xs transition-all duration-200 group ${detail.bg}`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {detail.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-slate-500 block">
                      {detail.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 truncate block group-hover:text-blue-600 transition-colors">
                      {detail.display}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 ml-2" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
