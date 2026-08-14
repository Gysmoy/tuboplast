import { createRoot } from 'react-dom/client'
import Base from './Components/Tailwind/Base'
import AboutNav from './Components/Tailwind/AboutNav'
import CreateReactScript from './Utils/CreateReactScript'

const defaultAbout = {
  policy_eyebrow: 'Excelencia Industrial',
  policy_title: 'Política del Sistema de Gestión Integrado',
  policy_scope_eyebrow: 'Familia e historia',
  policy_scope_title: 'Alcance',
  policy_scope_paragraph_1:
    'Fabricación, comercialización, capacitación en obra, atención al cliente, asistencia técnica, almacenamiento, distribución y despacho de tubos y conexiones de PVC-U (policloruro de vinilo no plastificado) para instalaciones de canalizaciones eléctricas, abastecimiento de agua, fluidos a presión, desagüe y sistemas de drenaje y alcantarillado.',
  policy_scope_paragraph_2:
    'Fabricación, comercialización, atención al cliente, asistencia técnica, almacenamiento, distribución y despacho de tubos y conexiones de polietileno. Procesos realizados en el local industrial ubicado en calle María Curie 313 - Urbanización Industrial Santa Rosa, Distrito de Ate. Lima-Perú.',
  policy_commitment_text: 'Compromiso con calidad, seguridad, medio ambiente y mejora continua.',
  policy_description:
    'En TUBOPLAST nos dedicamos a la fabricación de tuberías, accesorios de PVC y polietileno, y estamos comprometidos con la satisfacción de nuestros clientes para lo cual ponemos a su disposición nuestros recursos humanos y materiales, ofrecemos un excelente trato personalizado; garantizamos y aseguramos que todo producto brindado cumplirá con los requisitos acordados con el cliente.',
  policy_bullets: [
    'Fomentar y ejecutar acciones para garantizar que sus operaciones se realicen aplicando estándares de seguridad apropiados, para el control y mitigación de los riesgos.',
    'Controlar y mitigar nuestros aspectos ambientales significativos.',
    'Mejorar continuamente nuestros procesos, desempeño ambiental y nuestro sistema de gestión integrado.',
    'Sensibilizar, capacitar y entrenar a nuestros colaboradores, a fin de desarrollar una cultura preventiva y promover el cumplimiento de las normas, reglamentos y procedimientos.',
    'Prevenir la contaminación ambiental.',
    'Cumplir con la legislación vigente y otros requisitos relacionados a la fabricación de tuberías y accesorios de PVC, respecto a la seguridad, salud ocupacional y ambiental.',
  ],
  policy_certifications_title: 'Certificaciones de los Sistemas de Gestión',
  certifications: [
    {
      title: 'ISO 9001',
      description: 'Gestión de calidad y mejora continua en procesos industriales.',
      image_fallback: '/assets/img/about/certificates/iso-9001.svg',
    },
    {
      title: 'ISO 14001',
      description: 'Compromiso con la gestión ambiental y el uso responsable de recursos.',
      image_fallback: '/assets/img/about/certificates/iso-14001.svg',
    },
    {
      title: 'ISO 45001',
      description: 'Seguridad y salud en el trabajo como prioridad operacional.',
      image_fallback: '/assets/img/about/certificates/iso-45001.svg',
    },
  ],
}

const AboutPoliticaScreen = ({ about = defaultAbout }) => {
  const policyEyebrow = about.policy_eyebrow || defaultAbout.policy_eyebrow
  const policyTitle = about.policy_title || defaultAbout.policy_title
  const policyBullets = Array.isArray(about.policy_bullets) && about.policy_bullets.length
    ? about.policy_bullets
    : defaultAbout.policy_bullets
  const certificationsSource = Array.isArray(about.certifications) && about.certifications.length ? about.certifications : defaultAbout.certifications
  const certifications = defaultAbout.certifications.map((fallback, index) => {
    const current = certificationsSource[index] || {}

    return {
      ...current,
      title: current.title || fallback.title,
      description: current.description || fallback.description,
      image_fallback: fallback.image_fallback,
    }
  })
  const policyImage = about.policy_image_url || (about.policy_image ? `/about/media/${about.policy_image}` : '/assets/img/about/control-calidad-sgi.png')
  const policyScopeEyebrow = about.policy_scope_eyebrow || defaultAbout.policy_scope_eyebrow
  const policyScopeTitle = about.policy_scope_title || defaultAbout.policy_scope_title
  const policyScopeParagraph1 = about.policy_scope_paragraph_1 || defaultAbout.policy_scope_paragraph_1
  const policyScopeParagraph2 = about.policy_scope_paragraph_2 || defaultAbout.policy_scope_paragraph_2
  const policyCommitmentText = about.policy_commitment_text || defaultAbout.policy_commitment_text
  const policyStatement = about.policy_description || defaultAbout.policy_description
  const policyCertificationsTitle = about.policy_certifications_title || defaultAbout.policy_certifications_title

  return (
    <main className='bg-white'>
      <section className='relative overflow-hidden'>
        <img
          src='/assets/img/landing/bg-main.webp'
          alt='Planta industrial Tuboplast'
          decoding='async'
          className='absolute inset-0 h-full w-full object-cover object-center grayscale'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/30' />

        <div className='relative mx-auto w-full max-w-site px-4 py-14 sm:py-20 lg:py-28'>
          <AboutNav variant='overlay' />

          <div className='mt-8 max-w-3xl space-y-5 sm:mt-10 lg:mt-12'>
            <p className='text-xs font-bold uppercase tracking-[0.28em] text-primary sm:text-sm'>
              {policyEyebrow}
            </p>
            <h1 className='max-w-3xl font-title text-4xl font-medium leading-[1.05] tracking-tight text-primary sm:text-5xl lg:text-6xl'>
              {policyTitle}
            </h1>
            <div className='flex items-center gap-4 text-sm leading-relaxed text-darkmuted sm:text-base'>
              <span className='h-1 w-10 shrink-0 bg-secondary' />
              <p>{policyCommitmentText}</p>
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
              {policyScopeEyebrow}
            </p>
            <h2 className='font-title text-3xl font-medium leading-tight text-primary sm:text-4xl'>{policyScopeTitle}</h2>
            <div className='space-y-4 text-sm leading-relaxed text-darkmuted'>
              <p>{policyScopeParagraph1}</p>
              <p>{policyScopeParagraph2}</p>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-[#f1f4f7] py-12 sm:py-16'>
        <div className='mx-auto grid w-full max-w-site gap-10 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-start'>
          <div className='space-y-5'>
            <p className='text-xs font-bold uppercase tracking-[0.24em] text-primary'>
              {policyScopeEyebrow}
            </p>
            <h2 className='font-title text-3xl font-medium leading-tight text-primary sm:text-4xl'>Nuestra política</h2>
            <p className='text-sm leading-relaxed text-darkmuted'>
              {policyStatement}
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
          <h2 className='mt-3 font-title text-3xl font-medium leading-tight text-primary sm:text-4xl'>
            {policyCertificationsTitle}
          </h2>
        </div>

        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {certifications.map((cert, index) => (
            <article key={`${cert.title}-${index}`} className='overflow-hidden rounded-2xl bg-light p-4 shadow-sm ring-1 ring-black/5'>
              <div className='flex h-52 items-center justify-center rounded-xl bg-white p-4'>
                {cert.image_url || cert.image_path || cert.image_fallback ? (
                  <img
                    src={cert.image_url || (cert.image_path ? `/about/media/${cert.image_path}` : cert.image_fallback)}
                    alt={cert.title}
                    className='h-full w-full rounded-lg object-contain'
                  />
                ) : (
                  <div className='h-36 w-28 rounded-lg border border-slate-200 bg-white shadow-sm rotate-[-8deg]' />
                )}
              </div>
              <div className='space-y-3 p-3 pb-2'>
                <h3 className='font-title text-xl font-medium text-primary'>{cert.title}</h3>
                {cert.description ? (
                  <p className='text-sm leading-relaxed text-muted'>{cert.description}</p>
                ) : null}
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
    <Base title='Nosotros - Política'>
      <AboutPoliticaScreen about={properties.about} />
    </Base>,
  )
})
