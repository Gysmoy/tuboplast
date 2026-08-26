import { createRoot } from 'react-dom/client'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Base from './Components/Tailwind/Base'
import AboutNav from './Components/Tailwind/AboutNav'
import EditableHeroBanner from './Components/Tailwind/EditableHeroBanner'
import CreateReactScript from './Utils/CreateReactScript'

gsap.registerPlugin(useGSAP, ScrollTrigger)

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
  timeline_sort_direction: 'asc',
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

const timelineMilestones = [
  {
    year: '2020',
    title: 'Compromiso con el desarrollo del Perú',
    text: 'TUBOPLAST seguirá contribuyendo, al igual que a lo largo de estos 55 años, de forma activa y permanente en el crecimiento del sector constructor en el Perú y el desarrollo de la sociedad peruana.',
    image: '/assets/img/about/timeline/2020.jpg',
  },
  {
    year: '2012',
    title: 'Actualización de norma técnica',
    text: 'TUBOPLAST participó de forma activa en la Actualización de la Nueva Norma Técnica Peruana (NTP) ISO 1452 para redes de agua que reemplazó a la NTP ISO 4422.',
    image: '/assets/img/about/timeline/2012.jpg',
  },
  {
    year: '2008',
    title: 'Certificación ISO 14001',
    text: 'TUBOPLAST obtuvo la Certificación Internacional a la Gestión Ambiental ISO 14001.',
    image: '/assets/img/about/timeline/2008.png',
    imageFit: 'contain',
  },
  {
    year: '2007',
    title: 'Certificación ISO 9001',
    text: 'TUBOPLAST obtuvo la Certificación Internacional a la Gestión de la Calidad ISO 9001.',
    image: '/assets/img/about/timeline/2007.png',
    imageFit: 'contain',
  },
  {
    year: '2003',
    title: 'Sello de Calidad SEDAPAL',
    text: 'SEDAPAL otorgó a TUBOPLAST su "Sello de Calidad" - Categoría "A" por la Calidad de sus productos, la Calidad de su Organización y Atención al Cliente.',
    image: '/assets/img/about/timeline/2003.jpg',
  },
  {
    year: '1994',
    title: 'Creación de normas técnicas peruanas',
    text: 'TUBOPLAST participó de forma activa en la creación de la nueva Norma Técnica Peruana (NTP) ISO 4435 para redes de alcantarillado y la NTP ISO 4422 para redes de agua, junto con el Comité Técnico Peruano de Normalización ante Indecopi.',
    image: '/assets/img/about/timeline/1994.jpg',
  },
  {
    year: '1993',
    title: 'Impulso al saneamiento',
    text: 'TUBOPLAST reemplaza las tuberías de alcantarillado de concreto simple normalizado por tuberías de PVC y contribuye de esta manera al desarrollo y crecimiento del sector saneamiento en el Perú.',
    image: '/assets/img/about/timeline/1993.jpg',
  },
  {
    year: '1987',
    title: 'Redes de agua potable en PVC',
    text: 'TUBOPLAST sustituye las redes de impulsión, conducción y aducción de asbesto cemento por tuberías de PVC para agua potable (tuberías de 12" a 24").',
    image: '/assets/img/about/timeline/1987.jpg',
  },
  {
    year: '1984',
    title: 'PVC en redes de distribución',
    text: 'TUBOPLAST presenta por primera vez en el Perú la alternativa de uso de tuberías PVC en redes de distribución que conforman las urbanizaciones (tuberías de 6" a 10").',
    image: '/assets/img/about/timeline/1984.jpg',
  },
  {
    year: '1966',
    title: 'Fundación de Tuboplast',
    text: 'TUBOPLAST, fundada el 18 de octubre de 1966, es una empresa pionera en la introducción de las tuberías de PVC en el Perú que sustituyeron las "cañerías" de fierro galvanizado, que se utilizaban en las viviendas.',
    image: '/assets/img/about/timeline/1966.jpg',
  },
]

const getTimelineImageSrc = (item) => {
  if (item.image_url) return item.image_url
  if (item.image_path) return `/about/media/${item.image_path}`
  if (item.image?.startsWith('/')) return item.image
  if (item.image) return `/${item.image}`
  return ''
}

const sortTimelineByYear = (items, direction = 'asc') => {
  const sorted = [...items].sort((a, b) => Number(a.year) - Number(b.year))
  return direction === 'desc' ? sorted.reverse() : sorted
}

const TimelineSection = ({ milestones = [], sortDirection = 'asc' }) => {
  const timelineRef = useRef(null)
  const normalizedMilestones = Array.isArray(milestones) && milestones.length > 3 ? milestones : timelineMilestones
  const timelineItems = sortTimelineByYear(normalizedMilestones, sortDirection)

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) return

    gsap.from('.timeline-line', {
      scaleY: 0,
      transformOrigin: 'top center',
      ease: 'none',
      scrollTrigger: {
        trigger: '.timeline-track',
        start: 'top 78%',
        end: 'bottom 70%',
        scrub: true,
      },
    })

    gsap.from('.timeline-item', {
      autoAlpha: 0,
      y: 34,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: '.timeline-track',
        start: 'top 76%',
        once: true,
      },
    })

    gsap.from('.timeline-dot', {
      autoAlpha: 0,
      scale: 0,
      duration: 0.42,
      ease: 'back.out(1.8)',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.timeline-track',
        start: 'top 76%',
        once: true,
      },
    })

  }, { scope: timelineRef })

  return (
    <section ref={timelineRef} className='mx-auto w-full max-w-site px-4 pb-12 sm:pb-16 lg:pb-20'>
      <div className='mx-auto max-w-6xl border-t border-slate-200 pt-12 sm:pt-14'>
        <div className='mb-10 text-center'>
          <p className='text-xs font-bold uppercase tracking-[0.24em] text-primary'>Historia de Tuboplast</p>
          <h2 className='mt-3 font-title text-3xl font-medium leading-tight text-primary sm:text-4xl'>
            Línea de tiempo
          </h2>
        </div>

        <div className='timeline-track relative mx-auto max-w-6xl'>
          <div className='timeline-line absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-primary/35' />

          <div className='space-y-6 sm:space-y-8'>
            {timelineItems.map((item, index) => {
              const isLeft = index % 2 === 0

              return (
                <article
                  key={`${item.year}-${item.title}-${index}`}
                  className={`timeline-item relative grid min-w-0 grid-cols-2 gap-5 sm:gap-10 lg:gap-14 ${isLeft ? '' : '[&_.timeline-content]:col-start-2'}`}
                >
                  <div className='timeline-dot absolute left-1/2 top-1.5 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-primary ring-8 ring-white' />

                  <div className={`timeline-content group min-w-0 rounded-xl px-0 py-1 transition duration-500 hover:-translate-y-0.5 ${isLeft ? 'sm:text-right' : ''}`}>
                    <p className='font-title text-2xl font-medium leading-none text-primary transition duration-500 group-hover:scale-[1.03] group-hover:text-[#003b7a] sm:text-3xl'>{item.year}</p>
                    <h3 className='mt-3 text-base font-bold text-dark transition duration-500 group-hover:text-primary sm:text-lg'>{item.title}</h3>
                    <p className='mt-2 text-sm leading-relaxed text-darkmuted transition duration-500 group-hover:text-slate-700 sm:text-base'>{item.text}</p>
                    {(item.image || item.image_path || item.image_url) ? (
                      <img
                        src={getTimelineImageSrc(item)}
                        alt={item.title}
                        className={`mt-4 h-auto w-full max-w-[22rem] object-contain drop-shadow-[0_14px_22px_rgba(15,23,42,0.16)] transition duration-500 hover:-translate-y-1 hover:scale-[1.02] hover:drop-shadow-[0_18px_28px_rgba(15,23,42,0.2)] sm:max-w-[24rem] ${isLeft ? 'ml-auto' : ''}`}
                      />
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

const AboutFamiliaScreen = ({ about = defaultAbout, banners = {} }) => {
  const heroBanner = banners.about_family || {}
  const familyValues = Array.isArray(about.family_values) && about.family_values.length ? about.family_values : defaultAbout.family_values
  const milestones = Array.isArray(about.milestones) && about.milestones.length > 3 ? about.milestones : timelineMilestones
  const familyImage = about.family_image_url || (about.family_image ? `/about/media/${about.family_image}` : '/assets/img/landing/club-expert.webp')
  const familyHeroImage = heroBanner.image_url || '/assets/img/about/red-distribucion-banner.png'
  const familyHeroTitle = heroBanner.title || 'Estamos presentes desde 1966'
  const familyHeroDescription = heroBanner.description || 'Líderes en soluciones para edificaciones, infraestructura, minería, agricultura y más.'
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

      <section className='mx-auto w-full max-w-site px-4 pb-12 pt-5 sm:py-16 lg:py-20'>
        <div className='grid min-w-0 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-center xl:gap-14'>
          <div className='relative mx-auto w-full max-w-[28rem] min-w-0 lg:max-w-none'>
            <div className='absolute -top-6 left-4 z-10 hidden rounded-2xl bg-secondary px-7 py-5 text-primary shadow-xl sm:block lg:-top-10 lg:left-6 lg:px-8 lg:py-7 xl:-left-10'>
              <p className='font-title text-4xl font-black leading-none sm:text-5xl'>{about.family_metric_value || defaultAbout.family_metric_value}</p>
              <p className='mt-2 max-w-[9rem] text-xs font-bold uppercase tracking-[0.18em]'>{about.family_metric_label || defaultAbout.family_metric_label}</p>
            </div>
            <img
              src={familyImage}
              alt='Tuboplast en producción'
              className='h-[360px] w-full rounded-2xl object-cover shadow-[0_22px_45px_rgba(15,23,42,0.18)] sm:h-[500px] lg:h-[440px] xl:h-[500px]'
            />
          </div>

          <div className='min-w-0 space-y-8'>
            <div className='w-fit rounded-2xl bg-secondary px-6 py-5 text-primary shadow-xl sm:hidden'>
              <p className='font-title text-4xl font-black leading-none'>{about.family_metric_value || defaultAbout.family_metric_value}</p>
              <p className='mt-2 max-w-[9rem] text-xs font-bold uppercase tracking-[0.18em]'>{about.family_metric_label || defaultAbout.family_metric_label}</p>
            </div>
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

      <TimelineSection milestones={milestones} sortDirection={about.timeline_sort_direction || defaultAbout.timeline_sort_direction} />

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
