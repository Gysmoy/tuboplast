import { createRoot } from 'react-dom/client'
import Base from './Components/Tailwind/Base'
import AboutNav from './Components/Tailwind/AboutNav'
import EditableHeroBanner from './Components/Tailwind/EditableHeroBanner'
import CreateReactScript from './Utils/CreateReactScript'

const defaultAbout = {
  family_eyebrow: 'Familia e historia',
  family_title: 'Somos Tuboplast',
  family_lead: 'La primera fábrica 100% peruana con más de 60 años en la industria de la construcción, fabricando tuberías y conexiones de PVC y HDPE con todas las líneas completas desde 1/2" hasta 24".',
  family_paragraph_1: 'No solo fabricamos tuberías; diseñamos la infraestructura del mañana con ingeniería de precisión y materiales de vanguardia.',
  family_paragraph_2: 'Nuestra presencia en el mercado se sostiene en la confianza, la cercanía y la capacidad de acompañamiento técnico en cada proyecto.',
  family_metric_value: '60+',
  family_metric_label: 'AÑOS CONSTRUYENDO EL PERÚ',
  family_aside_1_title: 'Infraestructura',
  family_aside_1_text: 'Capacidad de producción optimizada para megaproyectos.',
  family_aside_2_title: 'I+D+i',
  family_aside_2_text: 'Laboratorio de pruebas mecánicas de última generación.',
  mission_title: 'Misión',
  mission_text: 'Ofrecer los mejores productos y servicios con altos estándares de calidad, con el objetivo de generar valor a nuestros clientes a través del compromiso de nuestros colaboradores.',
  vision_title: 'Visión',
  vision_text: 'Ser una empresa de nivel mundial, contribuyendo a mejorar la calidad de vida de las personas y fortaleciendo los 51 años de experiencia ganados en el mercado de soluciones conductivas para los servicios básicos.',
  family_values: ['Integridad', 'Respeto', 'Responsabilidad', 'Puntualidad', 'Compromiso', 'Confianza', 'Perseverancia'],
  milestones: [
    {
      year: '1966',
      title: 'Inicio de la historia',
      text: 'Tuboplast inicia su trayectoria industrial como una empresa peruana enfocada en soluciones confiables para la construcción.',
    },
    {
      year: 'Hoy',
      title: 'Cobertura nacional',
      text: 'Acompañamos proyectos de edificaciones, infraestructura, minería, agricultura e industria en todo el Perú.',
    },
    {
      year: 'Futuro',
      title: 'Innovación continua',
      text: 'Seguimos fortaleciendo procesos, calidad y soporte técnico para responder a nuevas exigencias del mercado.',
    },
  ],
}

const displayModes = {
  imageOnly: 'image_only',
  imageWithText: 'image_with_text',
}

const AboutFamiliaScreen = ({ about = defaultAbout, banners = {} }) => {
  const heroBanner = banners.about_family || {}
  const familyValues = Array.isArray(about.family_values) && about.family_values.length ? about.family_values : defaultAbout.family_values
  const familyImage = about.family_image_url || (about.family_image ? `/about/media/${about.family_image}` : '/assets/img/landing/club-expert.webp')
  const familyHeroImage = heroBanner.image_url || '/assets/img/about/red-distribucion-banner.png'
  const familyHeroTitle = heroBanner.title || 'Estamos presentes desde 1966'
  const familyHeroDescription = heroBanner.description || 'Lideres en soluciones para edificaciones, infraestructura, mineria, agricultura y mas.'
  const heroDisplayMode = heroBanner.display_mode || about.family_hero_display_mode || displayModes.imageWithText
  const isHeroImageOnly = heroDisplayMode === displayModes.imageOnly

  return (
    <main className='overflow-x-hidden bg-white'>
      <EditableHeroBanner
        image={familyHeroImage}
        title={familyHeroTitle}
        description={familyHeroDescription}
        eyebrow='Trayectoria & Experiencia'
        imageOnly={isHeroImageOnly}
        overlayOpacity={heroBanner.overlay_opacity}
        className='[&_.editable-hero-inner]:pt-4 [&_.editable-hero-inner]:pb-8 [&_.editable-hero-inner]:sm:pt-5 [&_.editable-hero-inner]:sm:pb-10 [&_.editable-hero-inner]:lg:pt-6 [&_.editable-hero-inner]:lg:pb-12'
        imageClassName='object-[70%_center]'
        topSlot={<AboutNav variant='overlay' />}
      >
        <div className='mt-4 max-w-xl space-y-3 sm:mt-5 sm:max-w-3xl lg:mt-6'>
            <p className='text-xs font-bold uppercase tracking-[0.28em] text-primary sm:text-sm'>
              Trayectoria & Experiencia
            </p>
            <h1 className='max-w-2xl font-title text-4xl font-medium leading-[1.05] tracking-tight text-primary sm:text-5xl lg:text-6xl'>
              {familyHeroTitle}
            </h1>
            <div className='flex items-center gap-4 text-sm leading-relaxed text-darkmuted sm:text-base'>
              <span className='h-1 w-10 shrink-0 bg-secondary' />
              <p className='max-w-xl'>{familyHeroDescription}</p>
            </div>
        </div>
      </EditableHeroBanner>

      <section className='mx-auto w-full max-w-site px-4 py-12 sm:py-16 lg:py-20'>
        <div className='grid min-w-0 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-center xl:gap-14'>
          <div className='relative mx-auto w-full max-w-[28rem] min-w-0 lg:max-w-none'>
            <img
              src={familyImage}
              alt='Tuboplast en produccion'
              className='h-[360px] w-full rounded-2xl object-cover shadow-[0_22px_45px_rgba(15,23,42,0.18)] sm:h-[500px] lg:h-[440px] xl:h-[500px]'
            />
            <div className='absolute -top-6 left-4 z-10 rounded-2xl bg-secondary px-7 py-5 text-primary shadow-xl lg:-top-10 lg:left-6 lg:px-8 lg:py-7 xl:-left-10'>
              <p className='font-title text-4xl font-black leading-none sm:text-5xl'>{about.family_metric_value || defaultAbout.family_metric_value}</p>
              <p className='mt-2 max-w-[9rem] text-xs font-bold uppercase tracking-[0.18em]'>{about.family_metric_label || defaultAbout.family_metric_label}</p>
            </div>
          </div>

          <div className='min-w-0 space-y-8'>
            <div className='space-y-4'>
              <p className='text-xs font-bold uppercase tracking-[0.24em] text-primary'>{about.family_eyebrow || defaultAbout.family_eyebrow}</p>
              <h2 className='font-title text-3xl font-medium leading-tight text-primary sm:text-4xl'>
                {about.family_title || defaultAbout.family_title}
              </h2>
              <p className='max-w-prose text-base leading-relaxed text-darkmuted'>
                {about.family_lead || defaultAbout.family_lead}
              </p>
              <p className='max-w-prose text-base leading-relaxed text-darkmuted'>
                {about.family_paragraph_1 || defaultAbout.family_paragraph_1}
              </p>
              {about.family_paragraph_2 ? (
                <p className='max-w-prose text-base leading-relaxed text-darkmuted'>
                  {about.family_paragraph_2}
                </p>
              ) : null}
            </div>

            <div className='grid gap-6 border-t border-slate-200 pt-6 sm:grid-cols-2'>
              <article className='space-y-3'>
                <p className='text-xs font-bold uppercase tracking-[0.24em] text-primary'>{about.family_aside_1_title || defaultAbout.family_aside_1_title}</p>
                <p className='text-sm leading-relaxed text-darkmuted sm:text-base'>
                  {about.family_aside_1_text || defaultAbout.family_aside_1_text}
                </p>
              </article>
              <article className='space-y-3'>
                <p className='text-xs font-bold uppercase tracking-[0.24em] text-primary'>{about.family_aside_2_title || defaultAbout.family_aside_2_title}</p>
                <p className='text-sm leading-relaxed text-darkmuted sm:text-base'>
                  {about.family_aside_2_text || defaultAbout.family_aside_2_text}
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-[#f6f7f9] py-12 sm:py-16'>
        <div className='mx-auto w-full max-w-site px-4'>
          <div className='grid gap-4 lg:grid-cols-3'>
            <article className='rounded-2xl border-l-4 border-transparent bg-white p-6 shadow-sm ring-1 ring-black/5 transition-[border-color,box-shadow] hover:border-secondary hover:shadow-lg sm:p-7'>
              <div className='grid h-12 w-12 place-items-center rounded-xl bg-silver text-primary'>
                <i className='mdi mdi-bullseye-arrow text-2xl'></i>
              </div>
              <h3 className='mt-4 font-title text-xl font-medium text-primary'>{about.mission_title || defaultAbout.mission_title}</h3>
              <p className='mt-4 text-sm leading-relaxed text-darkmuted'>{about.mission_text || defaultAbout.mission_text}</p>
            </article>

            <article className='rounded-2xl border-l-4 border-transparent bg-white p-6 shadow-sm ring-1 ring-black/5 transition-[border-color,box-shadow] hover:border-secondary hover:shadow-lg sm:p-7'>
              <div className='grid h-12 w-12 place-items-center rounded-xl bg-silver text-primary'>
                <i className='mdi mdi-eye-outline text-2xl'></i>
              </div>
              <h3 className='mt-4 font-title text-xl font-medium text-primary'>{about.vision_title || defaultAbout.vision_title}</h3>
              <p className='mt-4 text-sm leading-relaxed text-darkmuted'>{about.vision_text || defaultAbout.vision_text}</p>
            </article>

            <article className='rounded-2xl border-l-4 border-transparent bg-white p-6 shadow-sm ring-1 ring-black/5 transition-[border-color,box-shadow] hover:border-secondary hover:shadow-lg sm:p-7'>
              <div className='grid h-12 w-12 place-items-center rounded-xl bg-silver text-primary'>
                <i className='mdi mdi-account-group text-2xl'></i>
              </div>
              <h3 className='mt-4 font-title text-xl font-medium text-primary'>Valores</h3>
              <ul className='mt-4 space-y-2 text-sm leading-relaxed text-darkmuted'>
                {familyValues.map((item) => (
                  <li key={item} className='flex items-start gap-2'>
                    <span className='mt-1.5 h-2 w-2 rounded-full bg-secondary' />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Base title='Nosotros - Familia'>
      <AboutFamiliaScreen about={properties.about} banners={properties.banners} />
    </Base>,
  )
})
