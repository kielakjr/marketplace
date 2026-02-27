const Footer = () => {
  return (
    <footer className="border-t border-brand-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} <span className="font-medium text-brand-800">Marketplace</span>. Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-500 transition-colors hover:text-brand-800">Regulamin</a>
            <a href="#" className="text-sm text-gray-500 transition-colors hover:text-brand-800">Polityka prywatności</a>
            <a href="#" className="text-sm text-gray-500 transition-colors hover:text-brand-800">Kontakt</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
