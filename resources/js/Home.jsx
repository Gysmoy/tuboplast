import { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Base from './Components/Tailwind/Base';
import ItemCard from './Components/Items/ItemCard';
import CreateReactScript from './Utils/CreateReactScript';
import Emphasis from './Utils/em';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const strengths = [
  {
    title: 'Línea Completa',
    description: 'Contamos con tuberías de ½ "hasta 24" ofreciendo una vida útil estimada de más de 50 años.',
  },
  {
    title: 'Durabilidad Extrema',
    description: 'Formulación química avanzada para resistir la corrosión y condiciones climáticas severas en todo el territorio nacional.',
  },
  {
    title: 'Soporte en Obra',
    description: 'Asesoría técnica especializada para el diseño e instalación de sistemas complejos.',
  },
];

const categories = [
  {
    title: 'Edificaciones',
    image:
      '/assets/img/categories/category-1.png',
  },
  {
    title: 'Infraestructura',
    image:
      '/assets/img/categories/category-2.png',
  },
  {
    title: 'Minería e Industria',
    image:
      '/assets/img/categories/category-3.png',
  },
  {
    title: 'Agrícola',
    image:
      '/assets/img/categories/category-4.png',
  },
];

const recommendations = [
  {
    category: 'Tubería PVC-U',
    title: 'Tubería Agua SP Clase 15 NTP 399.002 3/4" x 5m',
    image: '/assets/img/items/item-1.png',
    price: 'S/ 28.30',
    pressure: '150 PSI',
    diameter: '33mm',
  },
  {
    category: 'Tubería PVC-U',
    title: 'Tubería Agua SP Clase 15 NTP 399.002 3/4" x 5m',
    image: '/assets/img/items/item-2.png',
    price: 'S/ 28.30',
    pressure: '150 PSI',
    diameter: '33mm',
  },
  {
    category: 'Tubería PVC-U',
    title: 'Tubería Agua SP Clase 15 MTP 398.002 3/4 x 5m',
    image: '/assets/img/items/item-3.png',
    price: 'S/ 28.30',
    pressure: '150 PSI',
    diameter: '33mm',
  },
  {
    category: 'Tubería PVC-U',
    title: 'Tubería Agua SP Clase 15 MTP 980.002 3/4 x 5m',
    image: '/assets/img/items/item-4.png',
    price: 'S/ 28.30',
    pressure: '150 PSI',
    diameter: '33mm',
  },
];

const blogPosts = [
  {
    category: 'Etiqueta',
    title: 'Cómo instalar tuberías CPVC en proyectos de agua caliente sin errores',
    description: 'Guía paso a paso para una instalación segura, duradera y certificada. Todo lo que el maestro profesional necesita saber...',
    image:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1000&q=80',
  },
  {
    category: 'Productos',
    title: 'Tubería PVC-U vs HDPE: ¿cuál elegir según el tipo de proyecto?',
    description: 'Comparamos resistencia, costo y aplicación para que tomes la mejor decisión técnica en cada obra...',
    image:
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80',
  },
  {
    category: 'Industria',
    title: 'Infraestructura hídrica en el Perú: los retos del sector construcción en 2025',
    description: 'Analizamos el panorama actual del sector, las normativas vigentes y cómo Tuboplast lidera la respuesta...',
    image:
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80',
  },
];

const HomeScreen = () => {
  const pageRef = useRef(null);

  return (
    <main ref={pageRef} className="min-h-screen">
      <section className="relative overflow-hidden">
        <img
          src="/assets/img/sliders/main-slider.png"
          alt="Planta Tuboplast"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/82 to-white/70" />

        <div className="relative mx-auto grid w-full max-w-site gap-8 px-4 pb-12 pt-10 sm:gap-10 sm:pb-16 sm:pt-14 lg:grid-cols-[1fr_390px] lg:items-center lg:pb-32 lg:pt-20">
          <div className="max-w-2xl space-y-5 sm:space-y-7 lg:space-y-8">
            <span data-hero-line className="block h-1 w-16 bg-secondary" />
            <h1
              data-hero-title
              className="font-title text-4xl leading-none tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Expertos en Tuberias y Conexiones de PVC
            </h1>
            <p data-hero-copy className="max-w-lg text-base leading-relaxed text-darkmuted sm:text-lg lg:text-xl lg:leading-tight">
              Más de 60 años fabricando sistemas de conducción confiables para los sectores de Edificaciones, Infraestructura, Minería e Industria y Agricola en todo el Perú.
            </p>

            <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center">
              <a
                href="/catalog"
                data-hero-cta
                className="rounded-full bg-primary px-6 py-3.5 text-center text-sm font-semibold text-white shadow-md transition sm:px-10 sm:py-4"
              >
                Ver catalogo <i className="mdi mdi-arrow-right ml-1 align-middle text-sm"></i>
              </a>
              <button
                data-hero-cta
                type="button"
                className="rounded-full bg-[#F7DD00] px-6 py-3.5 text-sm font-semibold text-primary shadow-md transition sm:px-10 sm:py-4"
              >
                Solicitar cotizacion
              </button>
            </div>

            <div className="flex gap-8 sm:gap-10">
              <div data-hero-stat>
                <p className="text-3xl font-title font-light text-primary">60+</p>
                <p className="text-xs text-muted uppercase">Anos de trayectoria</p>
              </div>
              <div data-hero-stat>
                <p className="text-3xl font-title font-light text-primary">ISO</p>
                <p className="text-xs text-muted uppercase">Calidad certificada</p>
              </div>
            </div>
          </div>

          <article
            data-hero-card
            data-float-card
            className="space-y-6 rounded-3xl bg-white p-5 shadow-xl sm:max-w-xl sm:p-8 lg:ml-auto lg:max-w-none"
          >
            <span className="inline-block bg-[#F7DD00] px-2 py-1 text-[10px] font-bold uppercase text-primary">
              destacado
            </span>
            <div className='space-y-2'>
              <h3 className="text-2xl font-medium font-title text-primary">Tuberia de Alta Presion Clase 15</h3>
              <p className="text-sm text-darkmuted">
                Uso industrial y civil en conduccion de agua con alta resistencia al impacto y presion.
              </p>
            </div>
            <div className="mt-4 space-y-3 text-xs uppercase">
              <div className='flex justify-between'>
                <span className='text-muted'>Material</span>
                <span className='text-darkmuted'>PVC-U Virgen</span>
              </div>
              <hr className='bg-muted' />
              <div className='flex justify-between'>
                <span className='text-muted'>Normativa</span>
                <span className='text-darkmuted'>NTP 399.002</span>
              </div>
            </div>
            <button
              type="button"
              className="w-full rounded-full border border-silver hover:bg-silver transition-colors p-4 font-bold font-title text-primary"
            >
              Especificaciones Tecnicas
            </button>
          </article>
        </div>
      </section>

      <section className="relative py-8 sm:py-10">
        <div className="mx-auto grid w-full max-w-site gap-4 px-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:gap-14">
          {strengths.map((strength) => {
            return (
              <article
                key={strength.title}
                data-reveal
                className={`rounded-2xl bg-white p-5 hover:shadow-lg border-l-4 border-transparent hover:border-secondary transition-colors space-y-4`}
              >
                <div className="grid h-16 w-16 place-items-center rounded-xl bg-silver text-primary">
                  <i className='mdi mdi-check-decagram mdi-36px'></i>
                </div>
                <p className="text-xl font-semibold text-primary">{strength.title}</p>
                <p className="text-slate-500">{strength.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="nosotros" className="mx-auto my-12 w-full max-w-site px-4 sm:my-16 lg:my-20">
        <div data-reveal className="relative lg:min-h-[760px]">
          <article className="relative flex w-full flex-col rounded-[22px] bg-primary p-6 text-white sm:p-8 lg:w-3/5 lg:p-14 lg:pr-32">
            <div className="space-y-6 sm:space-y-8">
              <span className="text-xs uppercase text-secondary border-b-2 border-white/20 pb-2">
                Legado & Futuro
              </span>

              <h2 className="font-title text-4xl sm:text-5xl lg:text-7xl">
                Seis <br />
                décadas de <br />
                <span className="text-secondary">Excelencia</span> <br />
                Industrial.
              </h2>

              <div className="grid gap-8 lg:grid-cols-2">
                <p className="text-sm text-white/75">
                  Tuboplast es el referente peruano. Tuboplast es la primera fábrica 100% peruana especializada en la fabricación de tuberías y conexiones de PVC y HDPE. No solo fabricamos tuberías; diseñamos la infraestructura del mañana con ingeniería de precisión y materiales de vanguardia.
                </p>

                <ul className="space-y-9 text-sm">
                  <li className="grid grid-cols-5 gap-6">
                    <span className="mt-2 h-1 w-full bg-secondary" />
                    <div className="col-span-4">
                      <b className="block uppercase text-white">Experiencia</b>
                      <span className="block text-white/75">Más de 60 años liderando el mercado nacional.</span>
                    </div>
                  </li>
                  <li className="grid grid-cols-5 gap-6">
                    <span className="mt-2 h-1 w-full bg-white/25" />
                    <div className="col-span-4">
                      <b className="block uppercase text-white">Tecnología</b>
                      <span className="block text-white/75">Moderno laboratorio de Control de Calidad</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8 lg:mt-auto lg:pt-14">
              <button type="button" className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-3 font-title text-sm font-medium text-primary shadow-sm sm:gap-4 sm:text-base">
                Especificaciones Técnicas
                <i className="mdi mdi-arrow-right text-xl leading-none"></i>
              </button>
              <p className="text-sm uppercase text-white/45">
                Partner Estratégico de <br /> Confianza
              </p>
            </div>
          </article>

          <div className="relative z-[1] mt-6 aspect-[4/3] w-full rounded-[20px] shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:aspect-video lg:absolute lg:right-0 lg:-top-10 lg:mt-0 lg:h-[75%] lg:w-[calc(40%+80px)] lg:aspect-auto">
            <img
              src="https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=80"
              alt="Planta industrial"
              className="h-full w-full object-cover rounded-2xl"
            />
            <div className="absolute bottom-4 left-4 rounded-lg bg-secondary px-5 py-4 text-primary shadow-[0_24px_60px_rgba(0,0,0,0.18)] sm:bottom-6 sm:left-6 sm:px-8 sm:py-6 lg:-bottom-40 lg:left-10 lg:px-10 lg:py-10">
              <p className="font-title text-4xl font-black sm:text-5xl lg:text-6xl">30+</p>
              <p className="text-sm font-medium uppercase">Años forjando <br /> el Perú</p>
            </div>
          </div>

        </div>
      </section>

      <section id="catalog" className="bg-light py-12 sm:py-16">
        <div className={'mx-auto w-full max-w-site px-4'}>
          <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
            <div>
              <p className="font-title text-3xl font-medium text-primary sm:text-4xl">Expertos en</p>
              <span className="mt-2 block h-1 w-12 bg-secondary" />
            </div>
            <a className="font-medium text-primary" href="#">
              Ver todo <i className="mdi mdi-arrow-right align-middle text-sm ms-1"></i>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {categories.map((category) => (
              <article
                key={category.title}
                data-reveal
                className="group relative overflow-hidden rounded-xl shadow-md ring-1 ring-black/5"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105 lg:aspect-[3/4]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/35 to-transparent" />
                <p className="absolute bottom-5 left-4 right-4 font-title text-xl font-medium leading-tight text-white sm:bottom-7 sm:left-6 sm:right-6 sm:text-2xl lg:bottom-10 lg:left-8 lg:right-8 lg:text-3xl">{category.title}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="productos" className="py-12 sm:py-16">
        <div className={'mx-auto w-full max-w-site px-4'}>
          <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
            <div>
              <p className="font-title text-3xl font-medium leading-tight text-primary sm:text-4xl">Nuestras Recomendaciones</p>
              <span className="mt-2 block h-1 w-12 bg-secondary" />
            </div>
            <a className="font-medium text-primary" href="#">
              Ver todo <i className="mdi mdi-arrow-right align-middle text-sm ms-1"></i>
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.map((product, index) => (
              <ItemCard key={`${product.title}-${index}`} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="novedades" className="px-4 py-8 sm:py-10 lg:px-0">
        <div
          data-reveal
          className="mx-auto w-full max-w-site rounded-2xl bg-[#F7DD00] md:grid md:grid-cols-2 md:items-end"
        >
          <div className="space-y-5 p-6 pb-2 sm:p-10 sm:pb-4 md:p-12 md:pb-10 lg:p-16 lg:pb-10">
            <span className="block h-1 w-16 bg-primary"></span>
            <p className="text-xs uppercase text-primary">Exclusivo para maestros</p>
            <h3 className="font-title text-4xl leading-tight text-primary sm:text-5xl lg:text-7xl lg:leading-normal">Club Experto Tuboplast</h3>
            <p className="text-base text-primary sm:text-lg lg:text-xl">
              Únete a nuestra comunidad y accede a capacitaciones certificadas, descuentos exclusivos y soporte prioritario.
            </p>
            <button type="button" className="rounded-full bg-primary px-8 py-3.5 font-title font-medium text-white">
              Registrarme ahora <i className="mdi mdi-arrow-right ms-2"></i>
            </button>
          </div>
          <div className="relative flex items-end justify-center">
            <img
              src="/assets/img/landing/club-expert.png"
              alt="Club Experto"
              className="mx-auto -mt-2 h-auto max-h-[360px] w-auto object-contain sm:max-h-[440px] md:-mt-10 md:h-full md:max-h-none"
            />
          </div>
        </div>
      </section>

      <section id="blog" className="py-12 sm:py-16">
        <div className={'mx-auto w-full max-w-site px-4'}>
          <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
            <div>
              <p className="font-title text-3xl font-medium text-primary sm:text-4xl">Nuestro blog</p>
              <span className="mt-2 block h-1 w-12 bg-secondary" />
            </div>
            <a className="font-medium text-primary" href="#">
              Ver todo <i className="mdi mdi-arrow-right align-middle text-sm ms-1"></i>
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {blogPosts.map((post) => (
              <article key={post.title} data-reveal className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                <img src={post.image} alt={post.title} className="aspect-[5/4] w-full object-cover" />
                <div className="px-4 py-6">
                  <span className='block uppercase bg-[#F7DD00] w-max rounded-full py-0.5 px-2 font-bold text-[10px] text-primary mb-4'>{post.category}</span>
                  <p className="font-title text-xl text-primary font-medium leading-tight mb-2">{post.title}</p>
                  <p className="text-sm text-muted line-clamp-2">{post.description}</p>
                </div>
              </article>
            ))}

            <article data-reveal className="rounded-xl bg-primary p-5 text-white shadow-sm flex flex-col justify-center space-y-5">
              <div className='space-y-4'>
                <p className="text-2xl font-bold font-title">SÉ EL PRIMERO EN SABER</p>
                <p className="text-sm">
                  Tips de instalación, nuevos productos y actualizaciones exclusivas para profesionales.
                </p>
              </div>
              <div className='space-y-4'>
                <input
                  className=" w-full rounded-full border border-white/20 bg-white/10 py-4 px-6 text-xs outline-none"
                  placeholder="Correo electronico"
                  type="email"
                />
                <button type="button" className="mt-4 w-full rounded-full bg-[#F7DD00] p-4 text-xs font-bold font-title text-primary">
                  Quiero suscribirme
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
};

CreateReactScript((el) => {
  createRoot(el).render(<Base title="Inicio">
    <HomeScreen />
  </Base>);
});
