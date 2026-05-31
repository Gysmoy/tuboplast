import Global from '../../Utils/Global';

const Footer = () => {
  return (
    <footer id="contacto" className="bg-light">
      <div className="mx-auto grid w-full max-w-site gap-10 px-4 py-12 md:gap-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-16">
        <div className="max-w-md space-y-4">
          <img src="/assets/img/logo.svg" alt={Global.APP_NAME} className="h-10" />
          <p className="text-xs leading-relaxed text-muted">
            Líderes en la fabricación de sistemas de tuberías de PVC para el sector construcción, minería y saneamiento.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 md:grid-cols-4 lg:gap-x-12">
          <div className="space-y-3">
            <p className="text-sm font-bold text-primary">Categorías</p>
            <div className="space-y-3 text-xs text-muted">
              <p>Edificaciones</p>
              <p>Infraestructura</p>
              <p>Minería e industria</p>
              <p>Agrícola</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-bold text-primary">Empresa</p>
            <div className="space-y-3 text-xs text-muted">
              <p>Nosotros</p>
              <p>Distribuidores</p>
              <p>Club experto</p>
              <p>Blog</p>
            </div>
          </div>

          <div className="col-span-2 space-y-3 md:col-span-1">
            <p className="text-sm font-bold text-primary">Contacto</p>
            <div className="space-y-3 text-xs leading-relaxed text-muted">
              <p className="flex items-start gap-1.5">
                <i className="mdi mdi-phone shrink-0 text-secondary"></i>
                +51 1 234 5678
              </p>
              <p className="flex items-start gap-1.5">
                <i className="mdi mdi-email shrink-0 text-secondary"></i>
                ventas@tuboplast.pe
              </p>
              <p className="flex items-start gap-1.5">
                <i className="mdi mdi-map-marker shrink-0 text-secondary"></i>
                Av. Industrial 456, Lima, Perú
              </p>
            </div>
          </div>

          <div className="col-span-2 max-w-md space-y-3 md:col-span-1">
            <p className="text-sm font-bold text-primary">Suscripciones</p>
            <p className="text-xs leading-relaxed text-muted">Recibe nuestro catálogo actualizado y novedades técnicas.</p>
            <div className="flex overflow-hidden rounded-full border border-silver">
              <input
                className="min-w-0 flex-1 border-none bg-white px-5 py-3.5 text-xs outline-none"
                placeholder="Tu correo"
                type="email"
                aria-label="Correo para suscribirse"
              />
              <button
                type="button"
                aria-label="Suscribirse"
                className="grid shrink-0 place-items-center bg-primary px-4 text-white transition hover:bg-[#003b7a]"
              >
                <i className="mdi mdi-send-outline text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex w-full max-w-site flex-col items-center justify-between gap-3 px-4 py-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted">{new Date().getFullYear()} Tuboplast. Todos los derechos reservados. </p>
          <ul className="flex gap-1.5">
            <li>
              <a href="#" aria-label="Facebook" className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white transition hover:bg-[#003b7a]" target="_blank" rel="noopener noreferrer">
                <i className="mdi mdi-facebook"></i>
              </a>
            </li>
            <li>
              <a href="#" aria-label="YouTube" className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white transition hover:bg-[#003b7a]" target="_blank" rel="noopener noreferrer">
                <i className="mdi mdi-youtube"></i>
              </a>
            </li>
            <li>
              <a href="#" aria-label="Instagram" className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white transition hover:bg-[#003b7a]" target="_blank" rel="noopener noreferrer">
                <i className="mdi mdi-instagram"></i>
              </a>
            </li>
            <li>
              <a href="#" aria-label="Twitter" className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white transition hover:bg-[#003b7a]" target="_blank" rel="noopener noreferrer">
                <i className="mdi mdi-twitter"></i>
              </a>
            </li>
            <li>
              <a href="#" aria-label="LinkedIn" className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white transition hover:bg-[#003b7a]" target="_blank" rel="noopener noreferrer">
                <i className="mdi mdi-linkedin"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
