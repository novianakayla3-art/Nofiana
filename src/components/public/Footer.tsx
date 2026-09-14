interface FooterProps {
  name: string;
}

export function Footer({ name }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="public-footer" className="py-8 bg-slate-50 border-t border-slate-200 text-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-xs sm:text-sm text-slate-500">
          © {currentYear} <span className="font-medium text-slate-700">{name || 'Portofolio'}</span>. Seluruh hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
