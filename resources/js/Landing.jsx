import { createRoot } from 'react-dom/client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Bot, Code2, Facebook, Instagram, LayoutTemplate, Mail, Phone, Workflow } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CreateReactScript from './Utils/CreateReactScript';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const services = [
  {
    title: 'Software a Medida',
    copy: 'Desarrollamos plataformas alineadas a tus procesos para resolver cuellos de botella y escalar operaciones.',
    icon: Code2,
  },
  {
    title: 'Aplicaciones Web',
    copy: 'Construimos aplicaciones web seguras, rapidas y con excelente experiencia de usuario.',
    icon: LayoutTemplate,
  },
  {
    title: 'Automatizacion de Procesos',
    copy: 'Conectamos tus herramientas y automatizamos tareas repetitivas para liberar tiempo de tu equipo.',
    icon: Workflow,
  },
  {
    title: 'Integraciones con IA',
    copy: 'Integramos asistentes inteligentes y analitica para acelerar soporte, ventas y decisiones.',
    icon: Bot,
  },
  {
    title: 'Landing Pages de Conversion',
    copy: 'Creamos landings enfocadas en resultados, optimizadas para captar leads y cerrar oportunidades.',
    icon: Code2,
  },
  {
    title: 'Mantenimiento Evolutivo',
    copy: 'Acompanamos tu producto con mejoras continuas, estabilidad y nuevas funcionalidades.',
    icon: LayoutTemplate,
  },
];

const fallbackWorkSlides = [
  {
    image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1600&q=80',
    title: 'Sistema de gestion para energia renovable',
    description: 'Plataforma para monitoreo y gestion operativa del sector energetico.',
    link: null,
  },
  {
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
    title: 'Ecommerce de productos premium',
    description: 'Canal digital para ventas con enfoque en conversion y experiencia de usuario.',
    link: null,
  },
  {
    image: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1600&q=80',
    title: 'Portal de servicios con area privada',
    description: 'Portal web con panel privado para clientes y gestion documental.',
    link: null,
  },
];

const statsSlides = [
  {
    value: '85%',
    text: 'de las interacciones con clientes seran gestionadas sin intervencion humana.',
    strong: 'Listo para liderar tu industria?',
  },
  {
    value: '73%',
    text: 'de los usuarios define su confianza en una empresa por la experiencia digital inicial.',
    strong: 'La primera impresion digital decide conversiones.',
  },
  {
    value: '64%',
    text: 'de mejora operativa se obtiene al digitalizar procesos criticos del negocio.',
    strong: 'Automatizar hoy es competir mejor manana.',
  },
];

const impact = [
  {
    title: 'Portafolio',
    accent: 'Web',
    text: 'Muestra tus proyectos con una imagen profesional, comunica confianza y destaca tu propuesta de valor.',
    image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Perdidas',
    accent: 'Web',
    text: 'Tu sitio podria estar perdiendo oportunidades. Optimizamos estructura, velocidad y mensajes para convertir mejor.',
    image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Crecimiento',
    accent: 'Digital',
    text: 'Impulsamos resultados con tecnologia a medida, procesos optimizados y una estrategia digital sostenible.',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=900&q=80',
  },
];

const LandingScreen = ({ projects = [] }) => {
  const rootRef = useRef(null);
  const workTrackRef = useRef(null);
  const workResumeTimeoutRef = useRef(null);
  const [workIndex, setWorkIndex] = useState(0);
  const [statIndex, setStatIndex] = useState(0);
  const [stopWorkAutoplay, setStopWorkAutoplay] = useState(false);

  const workSlides = useMemo(() => {
    if (!Array.isArray(projects) || projects.length === 0) {
      return fallbackWorkSlides;
    }

    return projects.map((project) => ({
      image: project.image,
      title: project.name,
      description: project.short_description,
      link: project.link,
    }));
  }, [projects]);

  const nextWork = () => setWorkIndex((prev) => (prev + 1) % workSlides.length);
  const prevWork = () => setWorkIndex((prev) => (prev - 1 + workSlides.length) % workSlides.length);

  const nextStat = () => setStatIndex((prev) => (prev + 1) % statsSlides.length);
  const prevStat = () => setStatIndex((prev) => (prev - 1 + statsSlides.length) % statsSlides.length);
  const scrollToContact = () => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  const pauseWorkAutoplay = () => {
    setStopWorkAutoplay(true);
    if (workResumeTimeoutRef.current) {
      window.clearTimeout(workResumeTimeoutRef.current);
    }
    workResumeTimeoutRef.current = window.setTimeout(() => {
      setStopWorkAutoplay(false);
    }, 6500);
  };

  useEffect(() => {
    const previous = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = previous;
      if (workResumeTimeoutRef.current) {
        window.clearTimeout(workResumeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (stopWorkAutoplay) return;
    const workTimer = window.setInterval(nextWork, 5500);
    return () => window.clearInterval(workTimer);
  }, [workSlides.length, stopWorkAutoplay]);

  useEffect(() => {
    const statTimer = window.setInterval(nextStat, 6500);
    return () => window.clearInterval(statTimer);
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('[data-nav]', { y: -24, opacity: 0, duration: 0.7 })
        .from('[data-hero-title]', { y: 40, opacity: 0, duration: 0.8 }, '-=0.35')
        .from('[data-hero-copy]', { y: 20, opacity: 0, duration: 0.65 }, '-=0.45')
        .from('[data-hero-cta]', { scale: 0.86, opacity: 0, duration: 0.5 }, '-=0.35');

      gsap.to('[data-float-a]', {
        y: -22,
        x: 16,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('[data-float-b]', {
        y: 18,
        x: -18,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 42,
          opacity: 0,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 84%',
            toggleActions: 'play none none none',
          },
        });
      });
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      if (!workTrackRef.current) {
        return;
      }

      gsap.to(workTrackRef.current, {
        xPercent: -(workIndex * 100),
        duration: 0.8,
        ease: 'power3.inOut',
      });
    },
    { scope: rootRef, dependencies: [workIndex], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-stat-main]',
        { scale: 0.92, opacity: 0.7, y: 10 },
        { scale: 1, opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
      );

      gsap.to('[data-stat-card]', {
        duration: 0.6,
        ease: 'power2.out',
      });
    },
    { scope: rootRef, dependencies: [statIndex], revertOnUpdate: true },
  );

  return (
    <main
      ref={rootRef}
      className="relative min-h-screen overflow-hidden bg-[#040812] text-white [font-family:'Space_Grotesk','Sora','DM_Sans',sans-serif]"
    >
      <div data-float-a className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-[#ff006f]/25 blur-[120px]" />
      <div data-float-b className="pointer-events-none absolute right-0 top-20 h-[22rem] w-[22rem] rounded-full bg-[#ff3b95]/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-20 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[#7e2df4]/10 blur-[160px]" />

      <div className="mx-auto max-w-6xl px-5 pb-12 pt-7 md:px-8">
        <header data-nav className="mb-9 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <a href="#home" className="text-3xl font-black tracking-widest md:text-4xl">
            x<span className="text-[#ff0a78]">Plain</span>
          </a>
          <nav className="flex w-full items-center justify-center gap-5 rounded-xl border border-white/15 bg-[#0a1020]/80 px-5 py-3 text-sm md:w-auto">
            <a className="font-semibold text-white transition-colors hover:text-[#ff0a78]" href="#home">
              Inicio
            </a>
            <a className="text-slate-300 transition-colors hover:text-white" href="#how">
              Soluciones
            </a>
            <a className="text-slate-300 transition-colors hover:text-white" href="#services">
              Proyectos
            </a>
            <a className="text-slate-300 transition-colors hover:text-white" href="#contacto">
              Contacto
            </a>
          </nav>
        </header>

        <section id="home" className="mx-auto max-w-4xl py-8 text-center md:py-14">
          <h1 data-hero-title className="text-5xl font-black leading-[0.92] tracking-tight md:text-7xl">
            Software que impulsa
            <br />
            tu <span className="text-[#ff0a78]">crecimiento</span>
          </h1>
          <p data-hero-copy className="mx-auto mt-6 max-w-2xl text-base text-slate-300 md:text-xl">
            En xPlain creamos software a medida para empresas que quieren operar mejor, vender mas y escalar con tecnologia confiable.
          </p>
          <button
            data-hero-cta
            type="button"
            onClick={scrollToContact}
            className="mt-8 rounded-lg bg-[#ff0a78] px-8 py-3 text-lg font-bold shadow-[0_0_30px_rgba(255,10,120,0.5)] transition hover:scale-105 hover:bg-[#ff2d8f]"
          >
            Quiero mi solucion a medida
          </button>
        </section>

        <section id="how" className="mt-8 md:mt-14">
          <h2 className="text-3xl font-black md:text-5xl">Asi creamos soluciones que transforman</h2>
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article
                  data-service-card
                  key={service.title}
                  className="rounded-xl border border-white/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.14),rgba(5,9,18,0.82)_45%)] p-5 opacity-100 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[#ff0a78]/60"
                >
                  <div className="ml-auto flex h-9 w-9 items-center justify-center rounded-md border border-[#ff0a78]/50 bg-[#ff0a78]/20 text-[#ff4fa5]">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <h3 className="mt-4 text-2xl font-extrabold leading-tight">{service.title}</h3>
                  <p className="mt-3 text-sm text-slate-300">{service.copy}</p>
                </article>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={scrollToContact}
              className="rounded-lg bg-[#ff0a78] px-8 py-3 text-lg font-bold shadow-[0_0_20px_rgba(255,10,120,0.35)] transition hover:scale-105 hover:bg-[#ff2d8f]"
            >
              Hablemos de tu proyecto
            </button>
          </div>
        </section>

        <section id="services" data-reveal className="mt-14">
          <h2 className="text-3xl font-black md:text-5xl">
            Mira nuestro <span className="text-[#ff0a78]">trabajo</span>
          </h2>
          <p className="mt-2 text-sm text-slate-300 md:text-base">
            Descubre nuestros casos de exito y como ayudamos a empresas a escalar con soluciones digitales a medida.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                pauseWorkAutoplay();
                prevWork();
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-slate-300 transition hover:border-[#ff0a78] hover:text-white"
            >
              <ArrowLeft size={16} />
            </button>

            <div
              className="relative w-full overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] p-2"
              onPointerDown={pauseWorkAutoplay}
            >
              <div ref={workTrackRef} className="flex will-change-transform">
                {workSlides.map((slide) => (
                  <article key={`${slide.image}-${slide.title}`} className="w-full shrink-0">
                    <div className="relative aspect-video overflow-hidden rounded-xl">
                      <img className="h-full w-full object-cover" src={slide.image} alt={slide.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-lg font-bold md:text-xl">{slide.title}</p>
                        {slide.description && <p className="mt-1 text-xs text-slate-200 md:text-sm">{slide.description}</p>}
                        {slide.link && (
                          <a
                            href={slide.link}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-block rounded-md bg-[#ff0a78] px-5 py-2 text-sm font-bold transition hover:bg-[#ff2d8f] md:text-base"
                          >
                            Ver proyecto
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                pauseWorkAutoplay();
                nextWork();
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-slate-300 transition hover:border-[#ff0a78] hover:text-white"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <section id="about" data-reveal className="mt-14">
          <h2 className="text-3xl font-black md:text-5xl">
            Sabias este <span className="text-[#ff0a78]">dato?</span>
          </h2>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={prevStat}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-slate-300 transition hover:border-[#ff0a78] hover:text-white"
            >
              <ArrowLeft size={16} />
            </button>

            <div className="relative w-full p-4 md:p-6">
              <div className="pointer-events-none absolute left-12 top-8 h-64 w-24 rounded-full bg-[#ff0a78]/20 blur-3xl" />
              <div className="pointer-events-none absolute right-12 top-8 h-64 w-24 rounded-full bg-[#ff0a78]/20 blur-3xl" />

              <div className="relative min-h-[18rem] md:min-h-[20rem]">
                {statsSlides.map((slide, index) => {
                  const delta = (index - statIndex + statsSlides.length) % statsSlides.length;
                  const position = delta === 0 ? 'center' : delta === 1 ? 'right' : 'left';

                  const positionClass =
                    position === 'center'
                      ? 'left-1/2 top-1/2 z-20 w-[86%] -translate-x-1/2 -translate-y-1/2 opacity-100 blur-0 md:w-[64%]'
                      : position === 'left'
                        ? 'left-0 top-1/2 z-10 w-[36%] -translate-y-1/2 opacity-40 blur-[2px] md:w-[33%]'
                        : 'right-0 top-1/2 z-10 w-[36%] -translate-y-1/2 opacity-40 blur-[2px] md:w-[33%]';

                  return (
                    <article
                      data-stat-card
                      key={slide.value + slide.text}
                      className={`absolute p-4 transition-all duration-700 md:p-6 ${positionClass}`}
                    >
                      {position === 'center' ? (
                        <div data-stat-main>
                          <p className="text-7xl font-black leading-none md:text-9xl">
                            {slide.value.replace('%', '')}
                            <span className="text-[#ff0a78]">%</span>
                          </p>
                          <p className="mt-2 text-lg text-slate-100 md:text-3xl md:leading-[1.16]">{slide.text}</p>
                          <p className="mt-3 rounded-lg bg-[#ff0a78] px-5 py-2 text-center text-base font-bold md:w-fit md:text-xl">{slide.strong}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-5xl font-black text-white/80 md:text-6xl">
                            {slide.value.replace('%', '')}
                            <span className="text-[#ff0a78]">%</span>
                          </p>
                          <p className="mt-2 text-xs text-slate-300 md:text-sm">{slide.text}</p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={nextStat}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-slate-300 transition hover:border-[#ff0a78] hover:text-white"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <section id="impacto" data-reveal className="mt-14">
          <h2 className="text-3xl font-black md:text-5xl">
            <span className="text-[#ff0a78]">Potencia</span> el impacto de tu marca
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {impact.map((card) => (
              <article
                key={card.title}
                className="rounded-2xl border border-white/20 bg-[linear-gradient(150deg,rgba(255,255,255,0.12),rgba(7,12,22,0.82)_52%)] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#ff0a78]/60"
              >
                <img className="h-40 w-full rounded-lg object-cover" src={card.image} alt={card.title} />
                <div className="pt-4">
                  <h3 className="text-3xl font-extrabold leading-none md:text-4xl">
                    {card.title.split(' ')[0]}
                    <br />
                    <span className="text-[#ff0a78]">{card.accent}</span>
                  </h3>
                  <p className="mt-3 text-sm text-slate-300">{card.text}</p>
                  <button type="button" onClick={scrollToContact} className="mt-5 w-32 rounded-md bg-[#ff0a78] px-4 py-2 text-sm font-bold transition hover:bg-[#ff2d8f]">
                    Leer mas
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contacto" data-reveal className="mt-14">
          <div className="grid grid-cols-1 gap-7 md:grid-cols-[0.9fr_1.2fr] md:items-start">
            <h2 className="text-5xl font-black leading-[0.9] md:text-6xl">
              Pongamos tu
              <br />
              marca en <span className="text-[#ff0a78]">movimiento</span>
            </h2>
            <form className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-slate-300" htmlFor="email">
                  correo
                </label>
                <input
                  id="email"
                  className="w-full rounded-xl border border-white/60 bg-transparent px-4 py-3 text-sm outline-none ring-[#ff0a78] placeholder:text-white/45 focus:ring-2"
                  type="email"
                  placeholder="correo@empresa.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-300" htmlFor="name">
                  nombre
                </label>
                <input
                  id="name"
                  className="w-full rounded-xl border border-white/60 bg-transparent px-4 py-3 text-sm outline-none ring-[#ff0a78] placeholder:text-white/45 focus:ring-2"
                  type="text"
                  placeholder="nombre completo"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-300" htmlFor="message">
                  mensaje
                </label>
                <textarea
                  id="message"
                  className="h-36 w-full rounded-xl border border-white/60 bg-transparent px-4 py-3 text-sm outline-none ring-[#ff0a78] placeholder:text-white/45 focus:ring-2"
                  placeholder="cuentanos sobre tu proyecto..."
                />
              </div>
              <button
                type="button"
                onClick={scrollToContact}
                className="w-full rounded-xl bg-[#ff0a78] py-3 text-lg font-bold shadow-[0_0_20px_rgba(255,10,120,0.35)] transition hover:bg-[#ff2d8f]"
              >
                Empezar ahora
              </button>
            </form>
          </div>
        </section>

        <footer className="mt-14 grid grid-cols-1 gap-8 border-t border-white/15 pt-10 text-slate-300 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-5">
            <p className="text-4xl font-black tracking-widest text-white">
              x<span className="text-[#ff0a78]">Plain</span>
            </p>
            <p className="text-sm">Software a medida, automatizacion e integraciones para escalar empresas.</p>
            <div className="flex items-center gap-3">
              <a
                href="#contacto"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff0a78] text-white transition hover:bg-[#ff2d8f]"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#contacto"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff0a78] text-white transition hover:bg-[#ff2d8f]"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <p className="text-2xl font-bold text-[#ff0a78]">Enlaces Rapidos</p>
            <div className="mt-3 space-y-2 text-sm">
              <a href="#how" className="block transition hover:text-white">Software a Medida</a>
              <a href="#how" className="block transition hover:text-white">Aplicaciones Web</a>
              <a href="#how" className="block transition hover:text-white">Automatizacion de Procesos</a>
              <a href="#how" className="block transition hover:text-white">Integraciones con IA</a>
              <a href="#services" className="block transition hover:text-white">Proyectos Recientes</a>
              <a href="#about" className="block transition hover:text-white">Insights</a>
            </div>
            <button
              type="button"
              onClick={scrollToContact}
              className="mt-4 rounded-md bg-[#ff0a78] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#ff2d8f]"
            >
              Contactanos
            </button>
          </div>

          <div>
            <p className="text-2xl font-bold text-[#ff0a78]">Hablemos</p>
            <div className="mt-3 space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <Phone size={15} className="text-[#ff0a78]" />
                +51 923 567 890
              </p>
              <p className="flex items-center gap-2">
                <Phone size={15} className="text-[#ff0a78]" />
                +1 713 912 3456
              </p>
              <p className="flex items-center gap-2">
                <Mail size={15} className="text-[#ff0a78]" />
                hello@xplain.pe
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(<LandingScreen {...properties} />);
});
