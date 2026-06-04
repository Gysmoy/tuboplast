import { createRoot } from 'react-dom/client'
import Base from './Components/Tailwind/Base'
import AboutNav from './Components/Tailwind/AboutNav'
import CreateReactScript from './Utils/CreateReactScript'

const defaultAbout = {
  policy_eyebrow: 'Excelencia Industrial',
  policy_title: 'Politica del Sistema de Gestion Integrado',
  policy_description: 'En TUBOPLAST nos dedicamos a la fabricacion de tuberias, accesorios de PVC y polietileno, y estamos comprometidos con la satisfaccion de nuestros clientes para lo cual ponemos a su disposicion nuestros recursos humanos y materiales, ofrecemos un excelente trato personalizado; garantizamos y aseguramos que todo producto brindado cumpla con los requisitos acordados con el cliente.',
  policy_bullets: [
    'Fomentar y ejecutar acciones para garantizar que las operaciones se realicen aplicando estandares de seguridad apropiados, para el control y mitigacion de los riesgos.',
    'Controlar y mitigar nuestros aspectos ambientales significativos.',
    'Mejorar continuamente nuestros procesos, desempeno ambiental y nuestro sistema de gestion integrado.',
    'Sensibilizar, capacitar y entrenar a nuestros colaboradores, a fin de desarrollar una cultura preventiva y promover el cumplimiento de las normas, reglamentos y procedimientos.',
    'Prevenir la contaminacion ambiental.',
    'Cumplir con la legislacion vigente y otros requisitos relacionados a la fabricacion de tuberias y accesorios de PVC, respecto a la seguridad, salud ocupacional y ambiental.',
  ],
  certifications: [
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
  ],
}

const AboutPoliticaScreen = ({ about = defaultAbout }) => {
  const policyBullets = Array.isArray(about.policy_bullets) && about.policy_bullets.length ? about.policy_bullets : defaultAbout.policy_bullets
  const certifications = Array.isArray(about.certifications) && about.certifications.length ? about.certifications : defaultAbout.certifications
  const policyImage = about.policy_image_url || (about.policy_image ? `/about/media/${about.policy_image}` : '/assets/img/landing/club-expert.png')

  return (
    <main className='bg-white'>
      <AboutNav />

      <section className='relative overflow-hidden'>
        <img
          src='/assets/img/landing/bg-main.png'
          alt='Planta industrial Tuboplast'
          className='absolute inset-0 h-full w-full object-cover object-center grayscale'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/30' />

        <div className='relative mx-auto w-full max-w-site px-4 py-20 sm:py-24 lg:py-28'>
          <div className='max-w-3xl space-y-6'>
            <p className='text-xs font-bold uppercase tracking-[0.28em] text-primary'>
              {about.policy_eyebrow || defaultAbout.policy_eyebrow}
            </p>
            <h1 className='max-w-3xl font-title text-5xl leading-[0.95] tracking-tight text-primary sm:text-6xl lg:text-[4.4rem]'>
              {about.policy_title || defaultAbout.policy_title}
            </h1>
            <div className='flex items-center gap-4 text-sm text-darkmuted'>
              <span className='h-1 w-10 bg-secondary' />
              <p>Compromiso con calidad, seguridad, medio ambiente y mejora continua.</p>
            </div>
          </div>
        </div>
      </section>

      <section className='mx-auto w-full max-w-site px-4 py-12 sm:py-16 lg:py-20'>
        <div className='grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center'>
          <img
            src={policyImage}
            alt='Control de calidad Tuboplast'
            className='h-[420px] w-full rounded-2xl object-cover shadow-[0_22px_45px_rgba(15,23,42,0.18)] sm:h-[500px]'
          />

          <div className='space-y-6'>
            <p className='text-xs font-bold uppercase tracking-[0.24em] text-primary'>
              {about.policy_eyebrow || defaultAbout.policy_eyebrow}
            </p>
            <h2 className='font-title text-4xl leading-tight text-primary sm:text-5xl'>Alcance</h2>
            <p className='text-sm leading-relaxed text-darkmuted'>
              {about.policy_description || defaultAbout.policy_description}
            </p>
          </div>
        </div>
      </section>

      <section className='bg-[#f1f4f7] py-12 sm:py-16'>
        <div className='mx-auto grid w-full max-w-site gap-10 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-start'>
          <div className='space-y-5'>
            <p className='text-xs font-bold uppercase tracking-[0.24em] text-primary'>
              {about.policy_eyebrow || defaultAbout.policy_eyebrow}
            </p>
            <h2 className='font-title text-4xl leading-tight text-primary sm:text-5xl'>Nuestra politica</h2>
            <p className='text-sm leading-relaxed text-darkmuted'>
              {about.policy_description || defaultAbout.policy_description}
            </p>
          </div>

          <ul className='space-y-4 text-sm leading-relaxed text-darkmuted'>
            {policyBullets.map((bullet) => (
              <li key={bullet} className='flex gap-3'>
                <span className='mt-2 h-2 w-2 shrink-0 rounded-full bg-secondary' />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className='mx-auto w-full max-w-site px-4 py-12 sm:py-16'>
        <div className='mb-8'>
          <p className='text-xs font-bold uppercase tracking-[0.24em] text-primary'>Archivos</p>
          <h2 className='mt-3 font-title text-4xl leading-tight text-primary sm:text-5xl'>
            Certificaciones de los Sistemas de Gestion
          </h2>
        </div>

        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {certifications.map((cert) => (
            <article key={cert.title} className='overflow-hidden rounded-2xl bg-light p-4 shadow-sm ring-1 ring-black/5'>
              <div className='flex h-52 items-center justify-center rounded-xl bg-white p-4'>
                {cert.image_url ? (
                  <img
                    src={cert.image_url}
                    alt={cert.title}
                    className='h-full w-full rounded-lg object-contain'
                  />
                ) : (
                  <div className='h-36 w-28 rounded-lg border border-slate-200 bg-white shadow-sm rotate-[-8deg]' />
                )}
              </div>
              <div className='space-y-3 p-3 pb-2'>
                <h3 className='font-title text-2xl text-primary'>{cert.title}</h3>
                <p className='text-sm leading-relaxed text-muted'>{cert.description}</p>
              </div>
              <div className='px-3 pb-2'>
                {cert.file_url || cert.file_path ? (
                  <a
                    href={cert.file_url || `/about/media/${cert.file_path}`}
                    target='_blank'
                    rel='noreferrer'
                    className='block w-full rounded-full bg-primary px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#003b7a]'
                  >
                    Descargar certificado
                  </a>
                ) : (
                  <div className='w-full rounded-full bg-slate-200 px-5 py-3 text-center text-sm font-bold text-slate-500'>
                    Sin archivo
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Base title='Nosotros - Politica'>
      <AboutPoliticaScreen about={properties.about} />
    </Base>,
  )
})
