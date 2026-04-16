import { Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-[1140px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-5 lg:px-0">
        <div className="md:col-span-1">
          <p className="text-lg font-black text-[#003B7A]">
            TUBO<span className="text-[#F7DD00]">PLAST</span>
          </p>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Soluciones en tuberias y conexiones para industria, construccion y proyectos residenciales.
          </p>
        </div>

        <div>
          <p className="text-sm font-bold text-[#003B7A]">Productos</p>
          <div className="mt-3 space-y-2 text-xs text-slate-600">
            <p>Agua</p>
            <p>Desague</p>
            <p>Electricidad</p>
            <p>Conexiones</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-[#003B7A]">Empresa</p>
          <div className="mt-3 space-y-2 text-xs text-slate-600">
            <p>Nosotros</p>
            <p>Calidad</p>
            <p>Blog</p>
            <p>Contacto</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-[#003B7A]">Contacto</p>
          <div className="mt-3 space-y-2 text-xs text-slate-600">
            <p>+51 999 999 999</p>
            <p>ventas@tuboplast.pe</p>
            <p>Lima, Peru</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-[#003B7A]">Suscribete</p>
          <div className="mt-3 flex overflow-hidden rounded-full border border-slate-300">
            <input className="h-9 flex-1 px-3 text-xs outline-none" placeholder="Tu correo" type="email" />
            <button type="button" className="grid h-9 w-10 place-items-center bg-[#003B7A] text-white">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-3 text-center text-[11px] text-slate-500">
        2026 Tuboplast. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
