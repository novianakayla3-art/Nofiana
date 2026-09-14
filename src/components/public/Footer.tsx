import { Lock } from 'lucide-react';

interface FooterProps {
  name: string;
  onNavigateAdmin?: () => void;
}

export function Footer({ name, onNavigateAdmin }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="public-footer" className="py-8 bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p className="text-xs sm:text-sm text-slate-500">
          © {currentYear} <span className="font-medium text-slate-700">{name || 'Portofolio'}</span>. Seluruh hak cipta dilindungi.
        </p>
        
        <div className="flex items-center gap-2">
          <a
            href="/admin/login"
            id="footer-admin-login-link"
            onClick={(e) => {
              if (onNavigateAdmin) {
                e.preventDefault();
                onNavigateAdmin();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 transition-colors py-1.5 px-3 rounded-md hover:bg-slate-100 border border-transparent hover:border-slate-200"
            title="Kelola Konten Portofolio"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Login</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
