import { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  ChevronRight,
  Factory,
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
    icon: Factory,
    title: 'Manufactura de Precision',
    description: 'Procesos certificados que garantizan consistencia en cada lote y entrega.',
  },
  {
    icon: ShieldCheck,
    title: 'Durabilidad Extrema',
    description: 'Materiales de alto rendimiento para instalaciones residenciales e industriales.',
    featured: true,
  },
  {
    icon: Wrench,
    title: 'Soporte en Obra',
    description: 'Asesoria tecnica especializada para instalacion segura y eficiente.',
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

  useGSAP(
    () => {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      heroTl
        .from('[data-hero-line]', { y: 24, opacity: 0, duration: 0.45 })
        .from('[data-hero-title]', { y: 28, opacity: 0, duration: 0.65 }, '-=0.2')
        .from('[data-hero-copy]', { y: 20, opacity: 0, duration: 0.55 }, '-=0.3')
        .from('[data-hero-cta]', { y: 20, opacity: 0, duration: 0.45, stagger: 0.12 }, '-=0.3')
        .from('[data-hero-stat]', { y: 20, opacity: 0, duration: 0.45, stagger: 0.12 }, '-=0.25')
        .from('[data-hero-card]', { x: 36, opacity: 0, duration: 0.65 }, '-=0.45');

      gsap.to('[data-float-card]', {
        y: -10,
        duration: 2.6,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });

      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 34,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 84%',
            once: true,
          },
        });
      });
    },
    { scope: pageRef }
  );

  const containerClass = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8';

  return (
    <Base>
      <main ref={pageRef} className="mx-auto w-full max-w-7xl overflow-hidden bg-[#ECEFF3]">
        <section id="inicio" className="relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?auto=format&fit=crop&w=1900&q=80"
            alt="Planta Tuboplast"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/82 to-white/70" />

          <div className={`${containerClass} relative grid gap-10 pb-24 pt-16 lg:grid-cols-[1fr_390px] lg:items-center lg:pb-32 lg:pt-20`}>
            <div className="max-w-2xl">
              <span data-hero-line className="block h-1 w-10 bg-[#F7DD00]" />
              <h1
                data-hero-title
                className="mt-6 text-4xl font-semibold leading-[1.03] tracking-tight text-[#003B7A] sm:text-5xl lg:text-[62px]"
              >
                Expertos en Tuberias y Conexiones de PVC
              </h1>
              <p data-hero-copy className="mt-5 max-w-lg text-sm text-[#1D3E63]/75 sm:text-base">
                Soluciones en PVC para construccion, agua, desague e instalaciones electricas en todo el Peru.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  data-hero-cta
                  type="button"
                  className="rounded-full bg-[#003B7A] px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5"
                >
                  Ver catalogo <ArrowRight size={14} className="ml-1 inline" />
                </button>
                <button
                  data-hero-cta
                  type="button"
                  className="rounded-full bg-[#F7DD00] px-7 py-3 text-sm font-semibold text-[#003B7A] shadow-md transition hover:-translate-y-0.5"
                >
                  Solicitar cotizacion
                </button>
              </div>

              <div className="mt-10 flex gap-10 text-[#003B7A]">
                <div data-hero-stat>
                  <p className="text-3xl font-black">30+</p>
                  <p className="text-xs text-[#1D3E63]/70">Anos de experiencia</p>
                </div>
                <div data-hero-stat>
                  <p className="text-3xl font-black">ISO</p>
                  <p className="text-xs text-[#1D3E63]/70">Calidad certificada</p>
                </div>
              </div>
            </div>

            <article
              data-hero-card
              data-float-card
              className="rounded-2xl border border-[#003B7A]/10 bg-white p-5 shadow-xl lg:ml-auto"
            >
              <span className="inline-block rounded-full bg-[#F7DD00] px-3 py-1 text-[10px] font-bold uppercase text-[#003B7A]">
                destacado
              </span>
              <h3 className="mt-3 text-lg font-bold text-[#003B7A]">Tuberia de Alta Presion Clase 15</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Uso industrial y civil en conduccion de agua con alta resistencia al impacto y presion.
              </p>
              <div className="mt-4 space-y-1 text-xs text-slate-600">
                <p>Medidas: 1/2 - 4 pulgadas</p>
                <p>Norma: NTP ISO 1452</p>
              </div>
              <button
                type="button"
                className="mt-5 w-full rounded-full border border-[#003B7A]/20 px-4 py-2 text-xs font-semibold text-[#003B7A]"
              >
                Especificaciones Tecnicas
              </button>
            </article>
          </div>
        </section>

        <section className="relative -mt-12 pb-14">
          <div className={`${containerClass} grid gap-4 md:grid-cols-3`}>
            {strengths.map((strength) => {
              const Icon = strength.icon;
              return (
                <article
                  key={strength.title}
                  data-reveal
                  className={`rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 ${
                    strength.featured ? 'border-l-4 border-[#F7DD00]' : ''
                  }`}
                >
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#EAF0F8] text-[#003B7A]">
                    <Icon size={16} />
                  </div>
                  <p className="mt-4 text-base font-semibold text-[#003B7A]">{strength.title}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{strength.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="pb-16">
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

        <section id="categorias" className="pb-16">
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

        <section className="pb-16">
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

      <a
        href="https://wa.me/51999999999"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-xl"
        aria-label="WhatsApp"
      >
        <MessageCircle size={22} />
      </a>
    </Base>
  );
};

CreateReactScript((el) => {
  createRoot(el).render(<HomeScreen />);
});
