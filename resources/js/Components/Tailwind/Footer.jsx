import { Send } from 'lucide-react';
import Global from '../../Utils/Global';

const Footer = () => {
  return (
    <footer id="contacto" className="bg-light">
      <div className="mx-auto w-full max-w-site px-4 py-16 gap-16 grid grid-cols-4">
        <div className="col-span-1 space-y-4">
          <img src="/assets/img/logo.svg" alt={Global.APP_NAME} className='h-10' />
          <p className="text-xs text-muted">
            Líderes en la fabricación de sistemas de tuberías de PVC para el sector construcción, minería y saneamiento.
          </p>
        </div>
        <div className='col-span-3 flex justify-between gap-16'>
          <div className='space-y-3'>
            <p className="text-sm font-bold text-primary">Categorías</p>
            <div className="space-y-3 text-xs text-muted">
              <p>Edificaciones</p>
              <p>Infraestructura</p>
              <p>Minería e industria</p>
              <p>Agrícola</p>
            </div>
          </div>
          <div className='space-y-3'>
            <p className="text-sm font-bold text-primary">Empresa</p>
            <div className="space-y-3 text-xs text-muted">
              <p>Nosotros</p>
              <p>Distribuidores</p>
              <p>Club experto</p>
              <p>Blog</p>
            </div>
          </div>
          <div className='space-y-3'>
            <p className="text-sm font-bold text-primary">Contacto</p>
            <div className="space-y-3 text-xs text-muted">
              <p>
                <i className='mdi mdi-phone me-1 text-secondary'></i>
                +51 1 234 5678
              </p>
              <p>
                <i className='mdi mdi-email me-1 text-secondary'></i>
                ventas@tuboplast.pe
              </p>
              <p>
                <i className='mdi mdi-map-marker me-1 text-secondary'></i>
                Av. Industrial 456, Lima, Perú
              </p>
            </div>
          </div>
          <div className='space-y-3'>
            <p className="text-sm font-bold text-primary">Suscripciones</p>
            <p className='text-xs text-muted'>Recibe nuestro catálogo actualizado y novedades técnicas.</p>
            <div className="flex overflow-hidden rounded-full border border-silver">
              <input
                className="border-none bg-white py-4 px-6 text-xs flex-1 outline-none"
                placeholder="Tu correo"
                type="email"
              />
              <button type="button" className="grid px-4 place-items-center bg-primary text-white">
                <i className="mdi mdi-send-outline text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className='mx-auto w-full max-w-site px-4 py-4 flex justify-between items-center'>
          <p className='text-xs text-muted'>{new Date().getFullYear()} Tuboplast. Todos los derechos reservados. </p>
          <ul className='flex gap-1.5'>
            <li>
              <a href="#" className='w-6 h-6 bg-primary text-white flex items-center justify-center rounded-full' target="_blank" rel="noopener noreferrer">
                <i className="mdi mdi-facebook"></i>
              </a>
            </li>
            <li>
              <a href="#" className='w-6 h-6 bg-primary text-white flex items-center justify-center rounded-full' target="_blank" rel="noopener noreferrer">
                <i className="mdi mdi-youtube"></i>
              </a>
            </li>
            <li>
              <a href="#" className='w-6 h-6 bg-primary text-white flex items-center justify-center rounded-full' target="_blank" rel="noopener noreferrer">
                <i className="mdi mdi-instagram"></i>
              </a>
            </li>
            <li>
              <a href="#" className='w-6 h-6 bg-primary text-white flex items-center justify-center rounded-full' target="_blank" rel="noopener noreferrer">
                <i className="mdi mdi-twitter"></i>
              </a>
            </li>
            <li>
              <a href="#" className='w-6 h-6 bg-primary text-white flex items-center justify-center rounded-full' target="_blank" rel="noopener noreferrer">
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
