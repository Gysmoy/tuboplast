import { createRoot } from 'react-dom/client';
import Base from './Components/Tailwind/Base';
import AboutNav from './Components/Tailwind/AboutNav';
import CreateReactScript from './Utils/CreateReactScript';

const policyBullets = [
  'Fomentar y ejecutar acciones para garantizar que las operaciones se realicen aplicando estandares de seguridad apropiados, para el control y mitigacion de los riesgos.',
  'Controlar y mitigar nuestros aspectos ambientales significativos.',
  'Mejorar continuamente nuestros procesos, desempeño ambiental y nuestro sistema de gestion integrado.',
  'Sensibilizar, capacitar y entrenar a nuestros colaboradores, a fin de desarrollar una cultura preventiva y promover el cumplimiento de las normas, reglamentos y procedimientos.',
  'Prevenir la contaminacion ambiental.',
  'Cumplir con la legislacion vigente y otros requisitos relacionados a la fabricacion de tuberias y accesorios de PVC, respecto a la seguridad, salud ocupacional y ambiental.',
];

const certifications = [
  {
    title: 'ISO 9001',
    description: 'Gestion de calidad y mejora continua en procesos industriales.',
  },
  {
    title: 'ISO 14001',
    description: 'Compromiso con la gestion ambiental y el uso responsable de recursos.',
  },
  {
    title: 'ISO 45001',
    description: 'Seguridad y salud en el trabajo como prioridad operacional.',
  },
];

const AboutPoliticaScreen = () => {
  return (
    <main className="bg-white">
      <AboutNav />

      <section className="relative overflow-hidden">
        <img
          src="/assets/img/landing/bg-main.png"
          alt="Planta industrial Tuboplast"
          className="absolute inset-0 h-full w-full object-cover object-center grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/30" />

        <div className="relative mx-auto w-full max-w-site px-4 py-20 sm:py-24 lg:py-28">
          <div className="max-w-3xl space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Excelencia Industrial</p>
            <h1 className="max-w-3xl font-title text-5xl leading-[0.95] tracking-tight text-primary sm:text-6xl lg:text-[4.4rem]">
              Política del Sistema de
              <br />
              Gestión Integrado
            </h1>
            <div className="flex items-center gap-4 text-sm text-darkmuted">
              <span className="h-1 w-10 bg-secondary" />
              <p>Lideres en soluciones para edificaciones, infraestructura, mineria, agricultura y mas.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-site px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <img
            src="/assets/img/landing/club-expert.png"
            alt="Control de calidad Tuboplast"
            className="h-[420px] w-full rounded-2xl object-cover shadow-[0_22px_45px_rgba(15,23,42,0.18)] sm:h-[500px]"
          />

          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Familia e historia</p>
            <h2 className="font-title text-4xl leading-tight text-primary sm:text-5xl">Alcance</h2>
            <p className="text-sm leading-relaxed text-darkmuted">
              Fabricacion, comercializacion, capacitacion en obra, atencion al cliente, asistencia tecnica,
              almacenamiento, distribucion y despacho de tubos y conexiones de PVC-U, para instalaciones de
              canalizaciones electricas, abastecimiento de agua, fluidos a presion, desagüe y sistemas de drenaje y
              alcantarillado.
            </p>
            <p className="text-sm leading-relaxed text-darkmuted">
              Fabricacion, comercializacion, atencion al cliente, asistencia tecnica, almacenamiento, distribucion y
              despacho de tubos y conexiones de polietileno. Procesos realizados en el local industrial ubicado en
              calle Maria Curie 313 - Urbanizacion Industrial Santa Rosa, Distrito de Ate, Lima-Peru.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f1f4f7] py-12 sm:py-16">
        <div className="mx-auto grid w-full max-w-site gap-10 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-5">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Familia e historia</p>
            <h2 className="font-title text-4xl leading-tight text-primary sm:text-5xl">Nuestra política</h2>
            <p className="text-sm leading-relaxed text-darkmuted">
              En TUBOPLAST nos dedicamos a la fabricacion de tuberias, accesorios de PVC y polietileno, y estamos
              comprometidos con la satisfaccion de nuestros clientes para lo cual ponemos a su disposicion nuestros
              recursos humanos y materiales, ofrecemos un excelente trato personalizado; garantizamos y aseguramos que
              todo producto brindado cumpla con los requisitos acordados con el cliente.
            </p>
          </div>

          <ul className="space-y-4 text-sm leading-relaxed text-darkmuted">
            {policyBullets.map((bullet) => (
              <li key={bullet} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-secondary" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto w-full max-w-site px-4 py-12 sm:py-16">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Archivos</p>
          <h2 className="mt-3 font-title text-4xl leading-tight text-primary sm:text-5xl">
            Certificaciones de los Sistemas de Gestión
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {certifications.map((cert) => (
            <article key={cert.title} className="overflow-hidden rounded-2xl bg-light p-4 shadow-sm ring-1 ring-black/5">
              <div className="flex h-52 items-center justify-center rounded-xl bg-white">
                <div className="h-36 w-28 rounded-lg border border-slate-200 bg-white shadow-sm rotate-[-8deg]" />
              </div>
              <div className="space-y-3 p-3 pb-2">
                <h3 className="font-title text-2xl text-primary">{cert.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{cert.description}</p>
              </div>
              <div className="px-3 pb-2">
                <button
                  type="button"
                  className="w-full rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-[#003b7a]"
                >
                  Descargar certificado
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

CreateReactScript((el) => {
  createRoot(el).render(
    <Base title="Nosotros - Política">
      <AboutPoliticaScreen />
    </Base>,
  );
});
