import { useEffect, useState } from 'react';
import Global from '../../Utils/Global';

const navItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/catalog' },
  { label: 'Distribuidores', href: '/distributors' },
  { label: 'Nosotros', href: '/about' },
  { label: 'Club experto', href: '/club' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contacto', href: '/contact' },
];

const SearchInput = ({ className = '' }) => (
  <label className={`relative block ${className}`}>
    <span className="sr-only">Buscar un producto o categoría</span>
    <input
      type="search"
      placeholder="Busca el producto o categoría"
      className="h-11 w-full rounded-xl bg-silver px-4 py-3 pr-12 text-sm text-dark outline-none transition placeholder:text-muted focus:ring-2 focus:ring-primary/25"
    />
    <i className="mdi mdi-magnify pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-primary"></i>
  </label>
);

const HeaderAction = ({ children, href, icon, onClick }) => {
  const Component = href ? 'a' : 'button';

  return (
    <Component
      {...(href ? { href } : { type: 'button', onClick })}
      className="group flex items-center gap-2 text-sm font-medium text-primary transition hover:text-[#003b7a]"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-silver text-primary transition group-hover:bg-slate-200">
        <i className={`mdi ${icon} text-xl`}></i>
      </span>
      <span className="hidden text-left leading-tight xl:block">{children}</span>
    </Component>
  );
};

const Header = ({ title }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const quoteItemCount = 0;
  const currentPath =
    typeof window === 'undefined' ? '/' : window.location.pathname.replace(/\/$/, '') || '/';

  const isActivePath = (href) => {
    if (href === '/') return currentPath === '/';
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };

  const openQuote = () => {
    setIsMenuOpen(false);
    setIsQuoteOpen(true);
  };

  useEffect(() => {
    document.title = `${title} | ${Global.APP_NAME}`;
  }, [title]);

  useEffect(() => {
    if (!isMenuOpen && !isQuoteOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsQuoteOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen, isQuoteOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-site px-4 py-4 lg:space-y-4">
          <div className="flex items-center gap-3 md:gap-6">
            <a className="shrink-0" href="/" aria-label={`Ir al inicio de ${Global.APP_NAME}`}>
              <img src="/assets/img/logo.svg" alt={Global.APP_NAME} className="h-9 md:h-10" />
            </a>

            <SearchInput className="hidden flex-1 md:block" />

            <div className="ml-auto flex items-center gap-2 text-primary sm:gap-3 lg:gap-5">
              <div className="hidden sm:block">
                <HeaderAction href="/contact" icon="mdi-headset">
                  Atención
                  <br />
                  al cliente
                </HeaderAction>
              </div>

              <div className="hidden lg:block">
                <HeaderAction href="/login" icon="mdi-account">
                  Entre o
                  <br />
                  regístrese
                </HeaderAction>
              </div>

              <button
                type="button"
                onClick={openQuote}
                aria-label={`Abrir mi cotización. ${quoteItemCount} productos agregados`}
                aria-controls="quote-offcanvas"
                aria-expanded={isQuoteOpen}
                className="group flex items-center gap-2 text-sm font-medium text-primary transition hover:text-[#003b7a]"
              >
                <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-silver text-primary transition group-hover:bg-slate-200">
                  <i className="mdi mdi-cart-outline text-xl"></i>
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-secondary px-1 text-[10px] font-bold text-primary">
                    {quoteItemCount}
                  </span>
                </span>
                <span className="hidden text-left leading-tight xl:block">
                  Mi
                  <br />
                  cotización
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsMenuOpen((current) => !current)}
                aria-label={isMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
                aria-controls="mobile-navigation"
                aria-expanded={isMenuOpen}
                className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-white transition hover:bg-[#003b7a] lg:hidden"
              >
                <i className={`mdi ${isMenuOpen ? 'mdi-close' : 'mdi-menu'} text-2xl`}></i>
              </button>
            </div>
          </div>

          <SearchInput className="mt-4 md:hidden" />

          <nav className="hidden items-center justify-between gap-6 lg:flex" aria-label="Navegación principal">
            <ul className="flex items-center gap-5 text-sm font-medium text-dark">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={`block whitespace-nowrap border-b-[3px] pb-1 transition hover:border-secondary ${
                      isActivePath(item.href) ? 'border-secondary text-primary' : 'border-transparent'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={openQuote}
              className="shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition hover:bg-[#003b7a]"
            >
              Cotizar aquí
            </button>
          </nav>
        </div>

        <div
          id="mobile-navigation"
          className={`border-t border-slate-200 bg-white lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        >
          <nav className="mx-auto max-w-site px-4 py-5" aria-label="Navegación móvil">
            <ul className="grid grid-cols-2 gap-x-5 gap-y-1 text-sm font-medium text-dark">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={`block border-b py-3 transition ${
                      isActivePath(item.href)
                        ? 'border-secondary font-bold text-primary'
                        : 'border-slate-100 hover:border-secondary hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a
                href="/login"
                className="flex items-center justify-center gap-2 rounded-full border border-primary px-5 py-3 text-sm font-bold text-primary transition hover:bg-silver"
              >
                <i className="mdi mdi-account-outline text-lg"></i>
                Entre o regístrese
              </a>
              <button
                type="button"
                onClick={openQuote}
                className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-[#003b7a]"
              >
                <i className="mdi mdi-cart-outline text-lg"></i>
                Ver mi cotización
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 transition-[visibility] duration-300 ${
          isQuoteOpen ? 'visible' : 'invisible delay-300'
        }`}
        aria-hidden={!isQuoteOpen}
      >
        <button
          type="button"
          aria-label="Cerrar cotización"
          onClick={() => setIsQuoteOpen(false)}
          className={`absolute inset-0 bg-slate-950/45 transition-opacity duration-300 ${
            isQuoteOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <aside
          id="quote-offcanvas"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quote-offcanvas-title"
          className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            isQuoteOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                  Resumen de productos
                </p>
                <h2 id="quote-offcanvas-title" className="mt-1 font-title text-2xl font-bold text-primary">
                  Mi cotización
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsQuoteOpen(false)}
                aria-label="Cerrar panel de cotización"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-silver text-primary transition hover:bg-slate-200"
              >
                <i className="mdi mdi-close text-xl"></i>
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-silver px-4 py-3 text-xs">
              <span className="font-medium text-darkmuted">Productos agregados</span>
              <span className="rounded-full bg-secondary px-3 py-1 font-bold text-primary">
                {quoteItemCount}
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center px-7 py-10 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-silver text-primary">
              <i className="mdi mdi-cart-outline text-4xl"></i>
            </span>
            <h3 className="mt-6 font-title text-xl font-bold text-primary">
              Tu cotización está vacía
            </h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Agrega los productos que necesita tu proyecto y envíanos la solicitud para recibir asesoría personalizada.
            </p>
            <a
              href="/catalog"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:text-[#003b7a]"
            >
              Explorar productos
              <i className="mdi mdi-arrow-right"></i>
            </a>
          </div>

          <div className="border-t border-slate-200 bg-white px-5 py-5 sm:px-6">
            <p className="mb-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
              <i className="mdi mdi-information-outline mt-0.5 text-base text-primary"></i>
              Agrega al menos un producto para habilitar el envío de tu solicitud.
            </p>
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white opacity-45"
            >
              Generar cotización
            </button>
            <a
              href="/contact"
              className="mt-4 block text-center text-xs font-bold text-primary transition hover:text-[#003b7a]"
            >
              ¿Necesitas ayuda? Habla con un asesor
            </a>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Header;
