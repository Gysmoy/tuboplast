import { createRoot } from 'react-dom/client';
import Base from './Components/Tailwind/Base';
import AboutNav from './Components/Tailwind/AboutNav';
import CreateReactScript from './Utils/CreateReactScript';

const milestones = [
  {
    year: '1960s',
    title: 'Origen industrial',
    text: 'Nacimos como una apuesta peruana por fabricar soluciones confiables para agua y saneamiento.',
  },
  {
    year: 'Hoy',
    title: 'Cobertura nacional',
    text: 'Acompañamos proyectos de edificaciones, infraestructura, mineria e industria en todo el Peru.',
  },
  {
    year: 'Futuro',
    title: 'Innovacion continua',
    text: 'Seguimos fortaleciendo procesos, calidad y soporte tecnico para responder a nuevas exigencias.',
  },
];

const values = [
  {
    title: 'Experiencia',
    text: 'Mas de seis decadas desarrollando soluciones de conduccion para diferentes sectores.',
  },
  {
    title: 'Calidad',
    text: 'Procesos y materiales pensados para resistir, durar y rendir en obra.',
  },
  {
    title: 'Soporte',
    text: 'Asesoria tecnica cercana para especificacion, instalacion y seguimiento.',
  },
  {
    title: 'Cobertura',
    text: 'Red de atencion para proyectos en distintas regiones del pais.',
  },
];

const AboutScreen = () => {
  return (
    <main className="bg-white">
      <AboutNav />

      <section className="relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,221,0,0.18),transparent_34%),linear-gradient(135deg,rgba(0,36,74,0.95),rgba(0,59,122,0.92))]" />
        <div className="relative mx-auto grid w-full max-w-site gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-secondary">
              Nosotros
            </span>
            <h1 className="font-title text-4xl leading-tight sm:text-5xl lg:text-7xl">
              Construimos infraestructura confiable para el futuro
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              Tuboplast es una empresa peruana especializada en tuberias y conexiones de PVC y HDPE, con foco en
              calidad, respaldo tecnico y soluciones duraderas.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/catalog"
                className="rounded-full bg-secondary px-6 py-3 text-sm font-bold text-primary transition hover:bg-[#f0d200]"
              >
                Ver catalogo
              </a>
              <a
                href="/contact"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Hablemos de tu proyecto
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Trayectoria</p>
              <p className="mt-3 font-title text-4xl font-bold">60+</p>
              <p className="mt-2 text-sm text-white/75">Anios de experiencia respaldando proyectos en el pais.</p>
            </article>
            <article className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Cobertura</p>
              <p className="mt-3 font-title text-4xl font-bold">Nacional</p>
              <p className="mt-2 text-sm text-white/75">Soporte para obras en distintas regiones y sectores.</p>
            </article>
            <article className="sm:col-span-2 rounded-3xl bg-white/10 p-6 ring-1 ring-white/10 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Especialidad</p>
              <p className="mt-3 font-title text-3xl font-bold">PVC-U y HDPE</p>
              <p className="mt-2 text-sm text-white/75">
                Soluciones para edificaciones, infraestructura, mineria e industria con respaldo tecnico.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-site px-4 py-12 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {milestones.map((milestone) => (
            <article key={milestone.title} className="rounded-2xl bg-light p-6 shadow-sm ring-1 ring-black/5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">{milestone.year}</p>
              <h2 className="mt-3 font-title text-2xl text-primary">{milestone.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{milestone.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-light py-12 sm:py-16">
        <div className="mx-auto w-full max-w-site px-4">
          <div className="mb-8">
            <p className="font-title text-3xl font-medium text-primary sm:text-4xl">Lo que nos define</p>
            <span className="mt-2 block h-1 w-12 bg-secondary" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => (
              <article key={value.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <div className="grid h-14 w-14 place-items-center rounded-xl bg-silver text-primary">
                  <i className="mdi mdi-check-decagram text-3xl"></i>
                </div>
                <h3 className="mt-4 font-title text-2xl text-primary">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-site px-4 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Compromiso</p>
            <h2 className="font-title text-3xl leading-tight text-primary sm:text-4xl">
              Acompanamos cada etapa de la obra con respaldo tecnico
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              Nuestra prioridad es entregar productos consistentes y una experiencia de atencion que ayude a tomar
              mejores decisiones en proyecto, compra e instalacion.
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1400&q=80"
            alt="Planta industrial Tuboplast"
            className="h-[320px] w-full rounded-[28px] object-cover shadow-lg"
          />
        </div>
      </section>
    </main>
  );
};

CreateReactScript((el) => {
  createRoot(el).render(
    <Base title="Nosotros">
      <AboutScreen />
    </Base>,
  );
});
