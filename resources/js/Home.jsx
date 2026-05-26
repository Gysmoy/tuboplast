import { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  ChevronRight,
  Factory,
  Verified,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Wrench,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Base from './Components/Tailwind/Base';
import CreateReactScript from './Utils/CreateReactScript';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const strengths = [
  {
    icon: Verified,
    title: 'Línea Completa',
    description: 'Contamos con tuberías de ½ "hasta 24" ofreciendo una vida útil estimada de más de 50 años.',
  },
  {
    icon: Verified,
    title: 'Durabilidad Extrema',
    description: 'Formulación química avanzada para resistir la corrosión y condiciones climáticas severas en todo el territorio nacional.',
  },
  {
    icon: Verified,
    title: 'Soporte en Obra',
    description: 'Asesoría técnica especializada para el diseño e instalación de sistemas complejos.',
  },
];

const categories = [
  {
    title: 'Agua',
    image:
      'https://images.unsplash.com/photo-1581092786450-7ef25f140997?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Desague',
    image:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Electricidad',
    image:
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Conexiones',
    image:
      'https://images.unsplash.com/photo-1623067469448-8110f1f1f0f9?auto=format&fit=crop&w=900&q=80',
  },
];

const recommendations = [
  {
    title: 'Tuberia Agua SP Clase 15 MTP 980.002 3/4 x 5m',
    image:
      'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?auto=format&fit=crop&w=1000&q=80',
    price: 'S/ 28.30',
  },
  {
    title: 'Tuberia Agua SP Clase 15 MTP 398.002 3/4 x 5m',
    image:
      'https://images.unsplash.com/photo-1565715101849-4e4f80c12b79?auto=format&fit=crop&w=1000&q=80',
    price: 'S/ 28.30',
  },
  {
    title: 'Tuberia Agua SP Clase 15 MTP 398.002 3/4 x 5m',
    image:
      'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1000&q=80',
    price: 'S/ 28.30',
  },
  {
    title: 'Tuberia Agua SP Clase 15 MTP 980.002 3/4 x 5m',
    image:
      'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?auto=format&fit=crop&w=1000&q=80',
    price: 'S/ 28.30',
  },
];

const blogPosts = [
  {
    title: 'Como instalar tuberias CPVC en proyecto de agua caliente sin errores',
    image:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Tuberia PVC-U y HDPE: cual elegir segun el tipo de proyecto?',
    image:
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Infraestructura hidrica en el Peru: retos del sector construccion en 2026',
    image:
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80',
  },
];

const HomeScreen = () => {
  const pageRef = useRef(null);

  const containerClass = 'mx-auto w-full max-w-7xl px-4';

  return (
    <main ref={pageRef} className="min-h-screen">
      <section className="relative overflow-hidden">
        <img
          src="/assets/img/sliders/main-slider.png"
          alt="Planta Tuboplast"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/82 to-white/70" />

        <div className={`mx-auto w-full max-w-site px-4 relative grid gap-10 pb-24 pt-16 lg:grid-cols-[1fr_390px] lg:items-center lg:pb-32 lg:pt-20`}>
          <div className="max-w-2xl space-y-8">
            <span data-hero-line className="block h-1 w-16 bg-secondary" />
            <h1
              data-hero-title
              className="text-7xl font-title leading-none tracking-tight text-[#003B7A]"
            >
              Expertos en Tuberias y Conexiones de PVC
            </h1>
            <p data-hero-copy className="mt-5 max-w-lg leading-tight  text-darkmuted text-xl">
              Más de 60 años fabricando sistemas de conducción confiables para los sectores de Edificaciones, Infraestructura, Minería e Industria y Agricola en todo el Perú.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#catalog"
                data-hero-cta
                className="rounded-full bg-[#003B7A] px-10 py-4 text-sm font-semibold text-white shadow-md transition "
              >
                Ver catalogo <ArrowRight size={14} className="ml-1 inline" />
              </a>
              <button
                data-hero-cta
                type="button"
                className="rounded-full bg-[#F7DD00] px-10 py-4 text-sm font-semibold text-[#003B7A] shadow-md transition "
              >
                Solicitar cotizacion
              </button>
            </div>

            <div className="flex gap-10">
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
            className="rounded-3xl bg-white p-8 shadow-xl lg:ml-auto space-y-6"
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

      <section className="relative py-10">
        <div className={`${containerClass} grid gap-14 md:grid-cols-3`}>
          {strengths.map((strength) => {
            const Icon = strength.icon;
            return (
              <article
                key={strength.title}
                data-reveal
                className={`rounded-2xl bg-white p-5 hover:shadow-lg border-l-4 border-transparent hover:border-secondary transition-colors space-y-4`}
              >
                <div className="grid h-16 w-16 place-items-center rounded-xl bg-silver text-primary">
                  <Icon size={32} fill='currentColor' color='white' />
                </div>
                <p className="text-xl font-semibold text-[#003B7A]">{strength.title}</p>
                <p className="text-slate-500">{strength.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="nosotros" className="pb-16">
        <div
          data-reveal
          className={`${containerClass} grid overflow-hidden rounded-2xl bg-[#003B7A] px-6 py-8 sm:px-10 md:grid-cols-[1fr_1.1fr] md:items-stretch`}
        >
          <div className="pr-0 text-white md:pr-8">
            <span className="inline-block h-1 w-10 bg-[#F7DD00]" />
            <h2 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
              Tres decadas de <span className="text-[#F7DD00]">Excelencia</span> Industrial.
            </h2>
            <p className="mt-4 max-w-sm text-sm text-slate-200">
              Lideres en soluciones para proyectos de infraestructura hidraulica, saneamiento e instalaciones tecnicas.
            </p>
            <button type="button" className="mt-8 rounded-full bg-white px-5 py-2 text-xs font-semibold text-[#003B7A]">
              Experiencia Tuboplast
            </button>
          </div>
          <div className="relative mt-8 md:mt-0">
            <img
              src="https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=80"
              alt="Planta industrial"
              className="h-full min-h-[290px] w-full rounded-2xl object-cover"
            />
            <div className="absolute -bottom-4 left-4 rounded-md bg-[#F7DD00] px-5 py-4 text-[#003B7A] shadow-lg">
              <p className="text-5xl font-black leading-none">30+</p>
              <p className="text-[10px] font-semibold uppercase">anos en el pais</p>
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" className="pb-16">
        <div className={containerClass}>
          <div className="mb-7 flex items-center justify-between">
            <div>
              <p className="text-[34px] font-semibold leading-none text-[#003B7A]">Categorias Especializadas</p>
              <span className="mt-2 block h-1 w-8 bg-[#F7DD00]" />
            </div>
            <a className="text-xs font-semibold text-[#003B7A]" href="#">
              Ver todo <ChevronRight size={12} className="inline" />
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {categories.map((category) => (
              <article
                key={category.title}
                data-reveal
                className="group relative overflow-hidden rounded-xl shadow-md ring-1 ring-black/5"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003B7A]/85 via-[#003B7A]/35 to-transparent" />
                <p className="absolute bottom-4 left-3 text-xl font-medium text-white">{category.title}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="productos" className="pb-16">
        <div className={containerClass}>
          <div className="mb-7 flex items-center justify-between">
            <div>
              <p className="text-[34px] font-semibold leading-none text-[#003B7A]">Nuestras Recomendaciones</p>
              <span className="mt-2 block h-1 w-8 bg-[#F7DD00]" />
            </div>
            <a className="text-xs font-semibold text-[#003B7A]" href="#">
              Ver todo <ChevronRight size={12} className="inline" />
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.map((product, index) => (
              <article
                key={`${product.title}-${index}`}
                data-reveal
                className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img src={product.image} alt={product.title} className="h-40 w-full object-cover" />
                <div className="p-3">
                  <p className="text-xs leading-5 text-slate-600">{product.title}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xl font-bold text-[#003B7A]">{product.price}</p>
                    <button type="button" className="grid h-8 w-8 place-items-center rounded bg-[#003B7A] text-white">
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="novedades" className="pb-16">
        <div
          data-reveal
          className={`${containerClass} overflow-hidden rounded-2xl bg-[#F7DD00] px-4 sm:px-6 md:grid md:grid-cols-2 md:items-end md:px-12`}
        >
          <div className="py-10">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#003B7A]">Exclusivo para maestros</p>
            <h3 className="mt-3 text-5xl font-semibold leading-[1.05] text-[#003B7A]">Club Experto Tuboplast</h3>
            <p className="mt-3 max-w-md text-sm text-[#003B7A]/80">
              Unete a nuestra comunidad y accede a capacitaciones, ofertas y beneficios exclusivos para especialistas.
            </p>
            <button type="button" className="mt-6 rounded-full bg-[#003B7A] px-5 py-2 text-xs font-semibold text-white">
              Quiero inscribirme <ArrowRight size={12} className="inline" />
            </button>
          </div>
          <div className="relative flex items-end justify-center">
            <img
              src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80"
              alt="Club Experto"
              className="h-[300px] w-full object-contain object-bottom md:h-[330px]"
            />
          </div>
        </div>
      </section>

      <section id="blog" className="pb-16">
        <div className={containerClass}>
          <div className="mb-7 flex items-center justify-between">
            <div>
              <p className="text-[34px] font-semibold leading-none text-[#003B7A]">Nuestro blog</p>
              <span className="mt-2 block h-1 w-8 bg-[#F7DD00]" />
            </div>
            <a className="text-xs font-semibold text-[#003B7A]" href="#">
              Ver todo <ChevronRight size={12} className="inline" />
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {blogPosts.map((post) => (
              <article key={post.title} data-reveal className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                <img src={post.image} alt={post.title} className="h-36 w-full object-cover" />
                <div className="p-3">
                  <p className="text-xs leading-5 text-slate-600">{post.title}</p>
                </div>
              </article>
            ))}

            <article data-reveal className="rounded-xl bg-[#003B7A] p-5 text-white shadow-sm">
              <p className="text-xl font-semibold leading-tight">SE EL PRIMERO EN SABER</p>
              <p className="mt-2 text-xs text-slate-200">
                Recibe noticias y promociones sobre tuberias, conexiones y novedades del sector.
              </p>
              <input
                className="mt-5 h-9 w-full rounded-full border border-white/20 bg-white/10 px-3 text-xs outline-none"
                placeholder="Correo electronico"
                type="email"
              />
              <button type="button" className="mt-4 w-full rounded-full bg-[#F7DD00] py-2 text-xs font-semibold text-[#003B7A]">
                Quiero suscribirme
              </button>
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
