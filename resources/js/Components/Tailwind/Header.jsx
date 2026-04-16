import { CircleUserRound, Search, ShoppingCart } from 'lucide-react';

const navItems = ['Inicio', 'Nosotros', 'Productos', 'Novedades', 'Blog', 'Contacto'];

const Header = () => {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1140px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-0">
        <a className="shrink-0 text-lg font-black tracking-tight text-[#003B7A]" href="#inicio">
          TUBO<span className="text-[#F7DD00]">PLAST</span>
        </a>

        <div className="relative hidden flex-1 md:block">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre y categoria..."
            className="h-10 w-full rounded-full border border-slate-300 bg-slate-50 pl-9 pr-4 text-sm outline-none transition focus:border-[#003B7A]"
          />
        </div>

        <div className="ml-auto flex items-center gap-3 text-[#003B7A]">
          <button type="button" className="grid h-9 w-9 place-items-center rounded-full bg-slate-100">
            <CircleUserRound size={17} />
          </button>
          <button type="button" className="grid h-9 w-9 place-items-center rounded-full bg-slate-100">
            <ShoppingCart size={17} />
          </button>
          <a href="#contacto" className="rounded-full bg-[#003B7A] px-4 py-2 text-xs font-semibold text-white">
            Cotizar ahora
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1140px] items-center gap-5 overflow-x-auto px-4 py-2 text-[13px] font-medium text-slate-700 sm:px-6 lg:px-0">
        {navItems.map((item) => (
          <a key={item} href="#" className="whitespace-nowrap transition hover:text-[#003B7A]">
            {item}
          </a>
        ))}
      </div>
    </header>
  );
};

export default Header;
