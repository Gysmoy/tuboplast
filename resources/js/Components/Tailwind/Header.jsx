import { CircleUserRound, Search, ShoppingCart } from 'lucide-react';
import { useEffect } from 'react';
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

const Header = ({ title }) => {
  const currentPath =
    typeof window === 'undefined' ? '/' : window.location.pathname.replace(/\/$/, '') || '/';

  const isActivePath = (href) => {
    if (href === '/') return currentPath === '/';
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };

  useEffect(() => {
    document.title = `${title} | ${Global.APP_NAME}`;
  }, [title]);

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
      <div className='max-w-site mx-auto space-y-5 py-5 px-4'>
        <div className="flex  items-center gap-8 ">
          <a className="shrink-0 text-lg font-black tracking-tight text-[#003B7A]" href="#inicio">
            <img src="/assets/img/logo.svg" alt={Global.APP_NAME} className='h-10' />
          </a>

          <div className="relative hidden flex-1 md:block">
            <input
              type="text"
              placeholder="Busca el producto o categoría"
              className="h-10 w-full rounded-xl bg-silver px-4 py-3 pr-12 text-sm outline-none"
            />
            <Search size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-primary" />
          </div>

          <div className="ml-auto flex items-center gap-6 text-[#003B7A]">
            <button type="button" className="text-sm font-medium flex items-center gap-2">
              <span className='flex items-center justify-center h-10 w-10 p-2 bg-silver rounded-lg text-primary'>
                <i className="mdi mdi-headset text-xl"></i>
              </span>
              <span className='text-start leading-tight'>
                Antención<br />
                al cliente
              </span>
            </button>
            <button type="button" className="text-sm font-medium flex items-center gap-2">
              <span className='flex items-center justify-center h-10 w-10 p-2 bg-silver rounded-lg text-primary'>
                <i className="mdi mdi-account text-xl"></i>
              </span>
              <span className='text-start leading-tight'>
                Entre o<br />
                Regístrese
              </span>
            </button>
            <button type="button" className="text-sm font-medium flex items-center gap-2">
              <span className='flex items-center justify-center h-10 w-10 p-2 bg-silver rounded-lg text-primary'>
                <i className="mdi mdi-cart text-xl"></i>
              </span>
              <span className='text-start leading-tight'>
                Mi<br />
                cotización
              </span>
            </button>
          </div>
        </div>

        <div className='flex justify-between items-center'>
          <ul className="flex items-center gap-4 overflow-x-auto text-sm font-medium text-dark">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`whitespace-nowrap border-b-4 transition hover:border-b-secondary ${
                  isActivePath(item.href) ? 'border-b-secondary' : 'border-transparent'
                }`}
              >
                {item.label}
              </a>
            ))}
          </ul>
          <button className='py-1.5 px-5 bg-primary text-white rounded-full font-medium'>Cotizar aquí</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
