import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Base from './Components/Tailwind/Base';
import CreateReactScript from './Utils/CreateReactScript';
import Global from './Utils/Global';
import { loadGoogleMapsApi } from './Utils/googleMaps';

const CONTACT_LOCATION = {
  lat: -12.0631222,
  lng: -76.9746798,
};

const serviceOptions = [
  'Cotización de proyecto',
  'Asesoría técnica',
  'Distribución y ferreterías',
  'Certificaciones y calidad',
  'Otro',
];

const contactChannels = [
  {
    icon: 'mdi-map-marker-radius-outline',
    label: 'Sede central',
    value: 'Calle María Curie 313, Ate, Lima',
    href: `https://www.google.com/maps/dir/?api=1&destination=${CONTACT_LOCATION.lat},${CONTACT_LOCATION.lng}`,
  },
  {
    icon: 'mdi-phone-outline',
    label: 'Central telefónica',
    value: '(01) 326-1146',
    href: 'tel:+5113261146',
  },
  {
    icon: 'mdi-whatsapp',
    label: 'WhatsApp corporativo',
    value: '+51 947 389 121',
    href: 'https://wa.me/51947389121',
  },
];

const socialLinks = [
  { icon: 'mdi-facebook', label: 'Facebook', href: 'https://www.facebook.com/Tuboplastsa/' },
  { icon: 'mdi-youtube', label: 'YouTube', href: 'https://www.youtube.com/channel/UC7d_iyo3bTd9M6h1Il6gfuw' },
  { icon: 'mdi-instagram', label: 'Instagram', href: 'https://www.instagram.com/tuboplast.peru/' },
  { icon: 'mdi-linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/tuboplast-sa/' },
];

const Field = ({ className = '', label, ...inputProps }) => (
  <label className={`block ${className}`}>
    <span className="block text-xs font-bold uppercase tracking-[0.08em] text-primary">
      {label}
    </span>
    <input
      {...inputProps}
      className="mt-2 w-full border-b border-slate-300 bg-transparent px-3 py-2 text-dark outline-none transition placeholder:text-muted focus:border-primary sm:text-base"
    />
  </label>
);

const ServiceDropdown = ({ onChange, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeDropdown = (event) => {
      if (event.key === 'Escape' || !dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', closeDropdown);
    document.addEventListener('keydown', closeDropdown);

    return () => {
      document.removeEventListener('mousedown', closeDropdown);
      document.removeEventListener('keydown', closeDropdown);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <span className="block text-xs font-bold uppercase tracking-[0.08em] text-primary">
        Motivo de consulta
      </span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="mt-2 flex w-full items-center justify-between gap-3 border-b border-slate-300 bg-transparent px-3 py-2 text-left text-dark outline-none transition hover:border-primary sm:text-base"
      >
        <span className={value ? '' : 'text-muted'}>{value || 'Selecciona una opción'}</span>
        <i className={`mdi mdi-chevron-down text-lg text-primary transition ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
        >
          {serviceOptions.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === value}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-silver ${
                option === value ? 'font-bold text-primary' : 'text-darkmuted'
              }`}
            >
              {option}
              {option === value && <i className="mdi mdi-check-bold text-primary"></i>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const FallbackMap = () => (
  <div className="absolute inset-0 overflow-hidden bg-[#dce2df]">
    <div className="absolute inset-y-0 left-0 w-[30%] bg-[#9bcbd4]" />
    <div className="absolute -left-10 top-[45%] h-16 w-[95%] rotate-[12deg] bg-white/70 shadow-sm" />
    <div className="absolute left-[28%] top-0 h-[130%] w-8 rotate-[9deg] bg-white/75 shadow-sm" />
    <div className="absolute left-[64%] top-0 h-[130%] w-7 -rotate-[11deg] bg-white/70 shadow-sm" />
    <div className="absolute inset-0 opacity-45 [background-image:repeating-linear-gradient(0deg,transparent,transparent_31px,#94a3b8_32px,#94a3b8_33px),repeating-linear-gradient(90deg,transparent,transparent_46px,#94a3b8_47px,#94a3b8_48px)]" />
    <span className="absolute left-[42%] top-[35%] text-base font-bold uppercase tracking-[0.12em] text-slate-500/80">
      Ate
    </span>
    <span className="absolute bottom-[18%] right-[14%] text-sm font-bold uppercase tracking-[0.12em] text-slate-500/75">
      Santa Rosa
    </span>
    <span className="absolute left-[54%] top-[54%] grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-primary text-white shadow-lg">
      <i className="mdi mdi-map-marker text-lg"></i>
    </span>
  </div>
);

const ContactMap = () => {
  const mapElementRef = useRef(null);
  const [mapStatus, setMapStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    if (!Global.GMAPS_API_KEY) {
      setMapStatus('fallback');
      return undefined;
    }

    loadGoogleMapsApi(Global.GMAPS_API_KEY)
      .then((maps) => {
        if (cancelled || !mapElementRef.current) return;

        const map = new maps.Map(mapElementRef.current, {
          center: CONTACT_LOCATION,
          zoom: 16,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        new maps.Marker({
          map,
          position: CONTACT_LOCATION,
          title: 'Tuboplast - Sede central',
          icon: {
            path: maps.SymbolPath.CIRCLE,
            scale: 11,
            fillColor: '#004991',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 4,
          },
        });

        setMapStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setMapStatus('fallback');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative h-[300px] overflow-hidden rounded-2xl bg-silver shadow-sm sm:h-[360px] lg:h-[410px]">
      <FallbackMap />
      <div
        ref={mapElementRef}
        className={`absolute inset-0 transition-opacity duration-500 ${mapStatus === 'ready' ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${CONTACT_LOCATION.lat},${CONTACT_LOCATION.lng}`}
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#003b7a]"
      >
        Cómo llegar
        <i className="mdi mdi-arrow-right"></i>
      </a>
    </div>
  );
};

const ContactSidebar = () => (
  <aside className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200/70 sm:p-6">
    <div className="space-y-5">
      {contactChannels.map((channel) => (
        <a
          key={channel.label}
          href={channel.href}
          target={channel.href.startsWith('http') ? '_blank' : undefined}
          rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
          className="group flex items-start gap-3"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-silver text-xl text-primary transition group-hover:bg-slate-200">
            <i className={`mdi ${channel.icon}`}></i>
          </span>
          <span>
            <span className="block text-xs font-bold uppercase tracking-[0.1em] text-primary">
              {channel.label}
            </span>
            <span className="mt-0.5 block text-darkmuted">{channel.value}</span>
          </span>
        </a>
      ))}
    </div>

    <div className="mt-6 border-t border-slate-200 pt-6">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-primary">Síguenos en redes</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {socialLinks.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noreferrer"
            aria-label={social.label}
            className="grid h-10 w-10 place-items-center rounded-full bg-primary text-lg text-white transition hover:bg-[#003b7a]"
          >
            <i className={`mdi ${social.icon}`}></i>
          </a>
        ))}
      </div>
    </div>

    <div className="relative mt-7 overflow-hidden rounded-xl bg-primary px-4 py-4 text-white">
      <div className="absolute -bottom-8 -right-6 text-[96px] text-white/10">
        <i className="mdi mdi-hard-hat"></i>
      </div>
      <div className="relative flex items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-secondary text-xl text-primary">
          <i className="mdi mdi-check-decagram"></i>
        </span>
        <div>
          <p className="font-bold">Atención de especialistas</p>
          <p className="mt-1 text-sm leading-relaxed text-white/75">
            Nuestro equipo de ingeniería valida tus requerimientos técnicos.
          </p>
        </div>
      </div>
    </div>
  </aside>
);

const ContactForm = () => {
  const [form, setForm] = useState({
    business: '',
    email: '',
    message: '',
    name: '',
    service: '',
  });
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    if (isSending) return;

    setFeedback({ type: '', message: '' });
    setIsSending(true);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      const response = await fetch('/landing/contact', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({ ...form, source: 'contact' }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'No pudimos enviar tu consulta. Revisa los datos e inténtalo nuevamente.');
      }

      setForm({ business: '', email: '', message: '', name: '', service: '' });
      setFeedback({ type: 'success', message: result.message });
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={submitForm}
      className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200/70 sm:p-7 lg:p-8"
    >
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        <Field
          label="Nombre completo"
          name="name"
          placeholder="Nombre y apellido"
          value={form.name}
          onChange={updateField}
          required
        />
        <Field
          label="Empresa"
          name="business"
          placeholder="Nombre de su organización"
          value={form.business}
          onChange={updateField}
        />
        <Field
          label="Correo electrónico"
          name="email"
          type="email"
          placeholder="correo@ejemplo.com"
          value={form.email}
          onChange={updateField}
          required
        />
        <ServiceDropdown
          value={form.service}
          onChange={(service) => setForm((current) => ({ ...current, service }))}
        />
      </div>

      <label className="mt-5 block">
        <span className="block text-xs font-bold uppercase tracking-[0.08em] text-primary">
          Comentario
        </span>
        <textarea
          name="message"
          placeholder="Cuéntenos sobre su requerimiento..."
          value={form.message}
          onChange={updateField}
          required
          rows={6}
          className="mt-2 min-h-32 w-full resize-y border-b border-slate-300 bg-transparent px-3 py-2 text-dark outline-none transition placeholder:text-muted focus:border-primary sm:text-base"
        />
      </label>

      <div className="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p
          role="status"
          className={`text-sm ${
            feedback.type === 'success' ? 'text-emerald-700' : 'text-red-600'
          }`}
        >
          {feedback.message}
        </p>
        <button
          type="submit"
          disabled={isSending}
          className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-primary px-8 py-3.5 font-title font-bold text-white shadow-md transition hover:bg-[#003b7a] disabled:cursor-wait disabled:opacity-60"
        >
          {isSending ? 'Enviando...' : 'Enviar consulta'}
          <i className="mdi mdi-arrow-right text-lg"></i>
        </button>
      </div>
    </form>
  );
};

const ContactScreen = () => (
  <main className="bg-light">
    <section className="relative overflow-hidden bg-white">
      <img
        src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1800&q=85"
        alt="Proyecto de infraestructura en construcción"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/45" />
      <div className="relative mx-auto w-full max-w-site px-4 pb-20 pt-12 sm:pb-24 sm:pt-16 lg:pb-32 lg:pt-20">
        <span className="block h-1 w-16 bg-secondary" />
        <h1 className="mt-8 max-w-4xl font-title text-4xl font-medium leading-tight text-primary sm:text-5xl lg:text-6xl">
          Estamos para asesorarte
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-darkmuted sm:text-xl">
          Contamos con un equipo técnico especializado listo para brindar soluciones precisas a tus proyectos de infraestructura y saneamiento en todo el Perú.
        </p>
      </div>
    </section>

    <section className="relative z-10 mx-auto -mt-10 grid w-full max-w-site gap-5 px-4 sm:-mt-12 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-6">
      <ContactSidebar />
      <ContactForm />
    </section>

    <section className="mx-auto w-full max-w-site px-4 py-12 sm:py-16">
      <ContactMap />
    </section>
  </main>
);

CreateReactScript((el) => {
  createRoot(el).render(
    <Base title="Contacto">
      <ContactScreen />
    </Base>,
  );
});
