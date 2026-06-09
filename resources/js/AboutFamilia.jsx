import { createRoot } from 'react-dom/client'
import Base from './Components/Tailwind/Base'
import AboutNav from './Components/Tailwind/AboutNav'
import CreateReactScript from './Utils/CreateReactScript'

const defaultAbout = {
  family_eyebrow: 'Familia e historia',
  family_title: 'Somos Tuboplast',
  family_lead: 'La primera fábrica 100% peruana con más de 60 años en la industria de la construcción, fabricando tuberías y conexiones de PVC y HDPE con todas las líneas completas desde 1/2" hasta 24".',
  family_paragraph_1: 'No solo fabricamos tuberías; diseñamos la infraestructura del mañana con ingeniería de precisión y materiales de vanguardia.',
  family_paragraph_2: 'Nuestra presencia en el mercado se sostiene en la confianza, la cercanía y la capacidad de acompañamiento técnico en cada proyecto.',
  family_metric_value: '30+',
  family_metric_label: 'AÑOS FORJANDO EL PERÚ',
  family_aside_1_title: 'Infraestructura',
  family_aside_1_text: 'Capacidad de producción optimizada para megaproyectos.',
  family_aside_2_title: 'I+D+i',
  family_aside_2_text: 'Laboratorio de pruebas mecánicas de última generación.',
  mission_eyebrow: 'Propósito',
  mission_title: 'Misión',
  mission_text: 'Ofrecer los mejores productos y servicios con altos estándares de calidad, con el objetivo de generar valor a nuestros clientes a través del compromiso de nuestros colaboradores.',
  vision_eyebrow: 'Propósito',
  vision_title: 'Visión',
  vision_text: 'Ser una empresa de nivel mundial, contribuyendo a mejorar la calidad de vida de las personas y fortaleciendo los 51 años de experiencia ganados en el mercado de soluciones conductivas para los servicios básicos.',
  family_values: ['Integridad', 'Respeto', 'Responsabilidad', 'Puntualidad', 'Compromiso', 'Confianza', 'Perseverancia'],
}

const AboutFamiliaScreen = ({ about = defaultAbout }) => {
  const familyValues = Array.isArray(about.family_values) && about.family_values.length ? about.family_values : defaultAbout.family_values
  const familyImage = about.family_image_url || (about.family_image ? `/about/media/${about.family_image}` : '/assets/img/landing/club-expert.png')

  return (
    <main className='bg-white'>
      <section className='relative overflow-hidden'>
        <img
          src='/assets/img/landing/bg-main.png'
          alt='Planta industrial Tuboplast'
          className='absolute inset-0 h-full w-full object-cover object-center grayscale'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/30' />

        <div className='relative mx-auto w-full max-w-site px-4 py-14 sm:py-20 lg:py-28'>
          <AboutNav variant='overlay' />

          <div className='mt-8 max-w-[22rem] space-y-5 sm:mt-10 sm:max-w-3xl sm:space-y-6 lg:mt-12'>
            <p className='text-[0.78rem] font-bold uppercase tracking-[0.32em] text-primary sm:text-base'>
              Trayectoria & Ingeniería
            </p>
            <h1 className='max-w-3xl font-title text-[2.9rem] leading-[0.98] tracking-tight text-primary sm:text-6xl lg:text-[4.8rem]'>
              60 años de calidad
              <br />
              e innovación industrial
            </h1>
            <div className='flex items-start gap-4 text-[1.05rem] leading-snug text-darkmuted sm:items-center sm:text-sm'>
              <span className='h-1 w-10 bg-secondary' />
              <p className='max-w-[15rem] sm:max-w-none'>Líderes en soluciones para edificaciones, infraestructura, minería, agricultura y más.</p>
            </div>
          </div>
        </div>
      </section>

      <section className='mx-auto w-full max-w-site px-4 py-12 sm:py-16 lg:py-20'>
        <div className='grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center'>
          <div className='relative mx-auto w-full max-w-[28rem] lg:max-w-none'>
            <div className='absolute left-0 top-0 h-full w-3 rounded-l-2xl bg-secondary' />
            <img
              src={familyImage}
              alt='Tuboplast en produccion'
              className='ml-2 h-[360px] w-full rounded-2xl object-cover shadow-[0_22px_45px_rgba(15,23,42,0.18)] sm:h-[500px]'
            />
            <div className='absolute -top-6 right-4 rounded-2xl bg-secondary px-7 py-5 text-primary shadow-xl lg:-bottom-6 lg:left-0 lg:right-auto lg:px-8 lg:py-7'>
              <p className='font-title text-5xl font-black leading-none lg:text-5xl'>{about.family_metric_value || defaultAbout.family_metric_value}</p>
              <p className='mt-2 max-w-[9rem] text-xs font-bold uppercase tracking-[0.18em]'>{about.family_metric_label || defaultAbout.family_metric_label}</p>
            </div>
          </div>

          <div className='space-y-8'>
            <div className='space-y-4'>
              <p className='text-xs font-bold uppercase tracking-[0.24em] text-primary'>{about.family_eyebrow || defaultAbout.family_eyebrow}</p>
              <h2 className='font-title text-[2.5rem] leading-[0.98] text-primary sm:text-5xl'>
                {about.family_title || defaultAbout.family_title}
              </h2>
              <p className='max-w-none text-[1.02rem] leading-relaxed text-darkmuted sm:max-w-2xl'>
                La primera fábrica 100% peruana con más de 60 años en la industria de la construcción, fabricando tuberías y conexiones de PVC y HDPE con todas las líneas completas desde 1/2" hasta 24".
              </p>
              <p className='max-w-none text-[1.02rem] leading-relaxed text-darkmuted sm:max-w-2xl'>
                No solo fabricamos tuberías; diseñamos la infraestructura del mañana con ingeniería de precisión y materiales de vanguardia.
              </p>
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
            <article className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-7'>
              <div className='grid h-14 w-14 place-items-center rounded-xl bg-silver text-primary'>
                <i className='mdi mdi-bullseye-arrow text-3xl'></i>
              </div>
              <h3 className='mt-4 font-title text-2xl text-primary'>{about.mission_title || defaultAbout.mission_title}</h3>
              <p className='mt-4 text-[1rem] leading-relaxed text-darkmuted sm:text-sm'>{about.mission_text || defaultAbout.mission_text}</p>
            </article>

            <article className='rounded-2xl border-l-2 border-secondary bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-7'>
              <div className='grid h-14 w-14 place-items-center rounded-xl bg-silver text-primary'>
                <i className='mdi mdi-eye-outline text-3xl'></i>
              </div>
              <h3 className='mt-4 font-title text-2xl text-primary'>{about.vision_title || defaultAbout.vision_title}</h3>
              <p className='mt-4 text-[1rem] leading-relaxed text-darkmuted sm:text-sm'>{about.vision_text || defaultAbout.vision_text}</p>
            </article>

            <article className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-7'>
              <div className='grid h-14 w-14 place-items-center rounded-xl bg-silver text-primary'>
                <i className='mdi mdi-account-group text-3xl'></i>
              </div>
              <h3 className='mt-4 font-title text-2xl text-primary'>Valores</h3>
              <ul className='mt-4 space-y-2 text-[1rem] leading-relaxed text-darkmuted sm:text-sm'>
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
      <AboutFamiliaScreen about={properties.about} />
    </Base>,
  )
})
