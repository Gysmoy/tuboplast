import { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Base from './Components/Tailwind/Base';
import ThankYouModal from './Components/Tailwind/ThankYouModal';
import CreateReactScript from './Utils/CreateReactScript';
import { fetchUbigeoRows, getDepartments, getDistricts, getProvinces } from './Utils/ubigeo';

const specialtyOptions = [
  'Gasfitero',
  'Ingeniero',
  'Instalador sanitario',
  'Maestro de obra',
  'Técnico electricista',
  'Otro',
];

const benefits = [
  {
    icon: 'mdi-school-outline',
    title: 'Capacitaciones certificadas',
    description: 'Acceso gratuito a seminarios técnicos y certificaciones con validez oficial para potenciar tu CV.',
  },
  {
    icon: 'mdi-gift-outline',
    title: 'Sorteos exclusivos',
    description: 'Participa mensualmente por kits de herramientas profesionales, vales de consumo y grandes premios.',
  },
  {
    icon: 'mdi-headset',
    title: 'Asesoría técnica VIP',
    description: 'Línea directa con nuestros ingenieros para resolver dudas complejas en tus proyectos de obra.',
  },
];

const testimonials = [
  {
    name: 'Jorge Rivas',
    role: 'Gasfitero experto - Lima',
    quote: 'Gracias a las capacitaciones del Club Experto, ahora puedo ofrecer instalaciones de termofusión con total seguridad a mis clientes. El respaldo de Tuboplast me da más trabajo.',
  },
  {
    name: 'Carlos Mendoza',
    role: 'Maestro de obra - Arequipa',
    quote: 'Los talleres técnicos me ayudaron a elegir mejores soluciones para cada proyecto. Mis clientes valoran que pueda orientarlos con más precisión.',
  },
  {
    name: 'Luis Salazar',
    role: 'Instalador sanitario - Trujillo',
    quote: 'Ser parte del club me mantiene actualizado y me conecta con especialistas cuando aparece una instalación exigente. Ese soporte marca la diferencia.',
  },
];

const Field = ({ label, ...inputProps }) => (
  <label className="block">
    <span className="block text-xs font-bold uppercase tracking-[0.08em] text-primary">{label}</span>
    <input
      {...inputProps}
      className="mt-2 w-full border-b border-slate-300 bg-transparent px-3 py-2.5 text-sm text-dark outline-none transition placeholder:text-muted focus:border-primary sm:text-base"
    />
  </label>
);

const Dropdown = ({ disabled = false, id, label, onChange, options, placeholder, value }) => {
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
      <span className="block text-xs font-bold uppercase tracking-[0.08em] text-primary">{label}</span>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        className="mt-2 flex w-full items-center justify-between gap-3 border-b border-slate-300 bg-transparent px-3 py-2.5 text-left text-sm text-dark outline-none transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
      >
        <span className={value ? '' : 'text-muted'}>{value || placeholder}</span>
        <i className={`mdi mdi-chevron-down text-lg text-primary transition ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      {isOpen && (
        <div
          role="listbox"
          aria-labelledby={id}
          className="absolute left-0 right-0 top-full z-20 mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === value}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition hover:bg-silver ${
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

const RegistrationForm = () => {
  const [form, setForm] = useState({
    accepted: false,
    department: '',
    district: '',
    dni: '',
    email: '',
    name: '',
    province: '',
    specialty: '',
    ubigeo: '',
  });
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [ubigeoRows, setUbigeoRows] = useState([]);

  const departments = useMemo(() => getDepartments(ubigeoRows), [ubigeoRows]);
  const provinces = useMemo(
    () => getProvinces(ubigeoRows, form.department),
    [form.department, ubigeoRows],
  );
  const districts = useMemo(
    () => getDistricts(ubigeoRows, form.department, form.province),
    [form.department, form.province, ubigeoRows],
  );

  useEffect(() => {
    let cancelled = false;

    fetchUbigeoRows()
      .then((rows) => {
        if (!cancelled) setUbigeoRows(rows);
      })
      .catch(() => {
        if (!cancelled) setFeedback({ type: 'error', message: 'No pudimos cargar las ubicaciones. Inténtalo nuevamente.' });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = (event) => {
    const { checked, name, type, value } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    if (isSending) return;

    if (!form.specialty || !form.ubigeo) {
      setFeedback({ type: 'error', message: 'Selecciona tu especialidad, departamento, provincia y distrito.' });
      return;
    }

    setFeedback({ type: '', message: '' });
    setIsSending(true);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      const response = await fetch('/landing/club', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'No pudimos registrar tu solicitud. Revisa los datos e inténtalo nuevamente.');
      }

      setForm({
        accepted: false,
        department: '',
        district: '',
        dni: '',
        email: '',
        name: '',
        province: '',
        specialty: '',
        ubigeo: '',
      });
      setFeedback({ type: '', message: '' });
      setIsThankYouOpen(true);
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <section id="registro-club" className="mx-auto w-full max-w-site px-4 py-10 sm:py-14 lg:py-16">
      <div className="rounded-2xl bg-[#f7f7f7] shadow-sm ring-1 ring-slate-200/70 lg:grid lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="flex flex-col bg-primary p-6 text-white sm:p-8 rounded-l-2xl">
          <h2 className="font-title text-2xl font-medium">Regístrate hoy</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            Completa tus datos y empieza a disfrutar los beneficios de ser un Experto Tuboplast.
          </p>

          <ul className="mt-7 space-y-4 text-sm">
            {['Carnet de socio digital', 'Acceso a zona de descarga', 'Invitaciones a eventos'].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <i className="mdi mdi-check-circle-outline text-xl text-secondary"></i>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-lg bg-white/10 p-4 lg:mt-auto">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">Próxima capacitación</p>
            <p className="mt-2 text-xs leading-relaxed">Instalación de sistemas de presión - Próximamente</p>
          </div>
        </aside>

        <form onSubmit={submitForm} className="p-5 sm:p-8 lg:p-10">
          <div className="grid gap-x-7 gap-y-6 md:grid-cols-2">
            <Field
              label="Nombre completo"
              name="name"
              placeholder="Nombre y apellido"
              value={form.name}
              onChange={updateField}
              required
            />
            <Field
              label="DNI / CE"
              name="dni"
              inputMode="numeric"
              minLength={8}
              maxLength={12}
              placeholder="8 dígitos"
              value={form.dni}
              onChange={updateField}
              required
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
            <Dropdown
              id="specialty-dropdown"
              label="Especialidad"
              placeholder="Selecciona una especialidad"
              value={form.specialty}
              options={specialtyOptions}
              onChange={(specialty) => setForm((current) => ({ ...current, specialty }))}
            />
            <Dropdown
              id="department-dropdown"
              label="Departamento"
              placeholder="Selecciona un departamento"
              value={form.department}
              options={departments}
              onChange={(department) => setForm((current) => ({
                ...current,
                department,
                district: '',
                province: '',
                ubigeo: '',
              }))}
            />
            <Dropdown
              disabled={!form.department}
              id="province-dropdown"
              label="Provincia"
              placeholder="Selecciona una provincia"
              value={form.province}
              options={provinces}
              onChange={(province) => setForm((current) => ({
                ...current,
                district: '',
                province,
                ubigeo: '',
              }))}
            />
            <Dropdown
              disabled={!form.province}
              id="district-dropdown"
              label="Distrito"
              placeholder="Selecciona un distrito"
              value={form.district}
              options={districts.map((item) => item.district)}
              onChange={(district) => {
                const selectedDistrict = districts.find((item) => item.district === district);
                setForm((current) => ({
                  ...current,
                  district,
                  ubigeo: selectedDistrict?.ubigeo || '',
                }));
              }}
            />
          </div>

          <label className="mt-6 flex items-start gap-3 text-xs leading-relaxed text-muted">
            <input
              name="accepted"
              type="checkbox"
              checked={form.accepted}
              onChange={updateField}
              required
              className="mt-0.5 h-4 w-4 accent-primary"
            />
            <span>
              Acepto los términos y condiciones y el tratamiento de mis datos personales para gestionar mi solicitud de inscripción.
            </span>
          </label>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p
              role="status"
              className={`text-sm ${feedback.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}
            >
              {feedback.message}
            </p>
            <button
              type="submit"
              disabled={isSending}
              className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-secondary px-8 py-3.5 text-sm font-bold text-primary shadow-md transition hover:bg-[#ffe900] disabled:cursor-wait disabled:opacity-60"
            >
              {isSending ? 'Enviando...' : 'Inscribirme'}
              <i className="mdi mdi-arrow-right text-lg"></i>
            </button>
          </div>
        </form>
      </div>
      </section>
      <ThankYouModal
        description="Recibimos tu solicitud de inscripción. Nuestro equipo revisará tus datos y se comunicará contigo para darte la bienvenida."
        eyebrow="Club Experto Tuboplast"
        isOpen={isThankYouOpen}
        onClose={() => setIsThankYouOpen(false)}
        title="Gracias por registrarte"
      />
    </>
  );
};

const ClubScreen = () => {
  const scrollToRegistration = () => {
    document.getElementById('registro-club')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main>
      <section className="relative min-h-[430px] overflow-hidden bg-white">
        <img
          src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1800&q=85"
          alt="Profesional de construcción en una planta industrial"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/15" />
        <div className="relative mx-auto flex min-h-[430px] w-full max-w-site items-center px-4 py-12 sm:py-16">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
              Comunidad profesional
            </span>
            <h1 className="mt-7 font-title text-4xl font-medium leading-tight text-primary sm:text-5xl lg:text-6xl">
              Únete al club de los que construyen con calidad
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-darkmuted sm:text-lg">
              El programa exclusivo para los maestros que exigen lo mejor en cada obra. Accede a beneficios premium y haz crecer tu prestigio.
            </p>
            <button
              type="button"
              onClick={scrollToRegistration}
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#003b7a]"
            >
              Inscríbete ahora
              <i className="mdi mdi-arrow-right text-lg"></i>
            </button>
          </div>
        </div>
      </section>

      <RegistrationForm />

      <section className="mx-auto w-full max-w-site px-4 py-10 sm:py-14">
        <h2 className="font-title text-3xl font-medium text-primary sm:text-4xl">Beneficios de ser un experto</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-darkmuted sm:text-base">
          Formar parte de nuestro club te da herramientas para ser el mejor en tu rubro con el respaldo de una marca líder en tuberías.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <article
              key={benefit.title}
              className={`rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md ${
                index === 1 ? 'border-l-4 border-secondary' : ''
              }`}
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-silver text-2xl text-primary">
                <i className={`mdi ${benefit.icon}`}></i>
              </span>
              <h3 className="mt-5 font-title text-xl font-bold text-primary">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-darkmuted">{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-site px-4 py-10 sm:py-14">
        <div className="relative overflow-hidden rounded-2xl bg-secondary px-6 py-8 text-primary shadow-sm sm:px-10 sm:py-10 lg:min-h-[360px] lg:px-16 lg:py-14">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[34px] border-white/20" />
          <div className="relative z-10 max-w-2xl lg:max-w-[56%]">
            <span className="block h-1 w-16 bg-primary" />
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em]">Exclusivo para maestros</p>
            <h2 className="mt-5 font-title text-4xl font-medium leading-tight sm:text-5xl lg:text-6xl">
              Club Experto Tuboplast
            </h2>
            <p className="mt-5 text-base leading-relaxed sm:text-lg">
              Únete a nuestra comunidad y accede a capacitaciones certificadas, descuentos exclusivos y soporte prioritario.
            </p>
            <button
              type="button"
              onClick={scrollToRegistration}
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#003b7a]"
            >
              Registrarme ahora
              <i className="mdi mdi-arrow-right text-lg"></i>
            </button>
          </div>
          <img
            src="/assets/img/landing/club-expert.png"
            alt="Maestro del Club Experto Tuboplast"
            className="relative -mb-8 ml-auto mt-8 max-h-[300px] w-auto object-contain sm:-mb-10 lg:absolute lg:bottom-0 lg:right-8 lg:mt-0 lg:max-h-[390px]"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-site px-4 py-10 sm:py-14 lg:pb-20">
        <h2 className="font-title text-3xl font-medium text-primary sm:text-4xl">Voces de la experiencia</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-darkmuted sm:text-base">
          Conoce cómo otros profesionales fortalecen su trabajo con el respaldo y la comunidad de Tuboplast.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article key={testimonial.name} className="rounded-xl bg-silver p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <img
                  src={`https://images.unsplash.com/photo-${[
                    '1506794778202-cad84cf45f1d',
                    '1500648767791-00dcc994a43e',
                    '1507003211169-0a1dd7228f2d',
                  ][index]}?auto=format&fit=crop&w=120&q=80`}
                  alt=""
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-primary">{testimonial.name}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#897f00]">{testimonial.role}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-darkmuted">“{testimonial.quote}”</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

CreateReactScript((el) => {
  createRoot(el).render(
    <Base title="Club experto">
      <ClubScreen />
    </Base>,
  );
});
