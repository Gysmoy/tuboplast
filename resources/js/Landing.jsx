import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Code2,
  LayoutTemplate,
  Mail,
  Megaphone,
  Workflow,
} from 'lucide-react';
import CreateReactScript from './Utils/CreateReactScript';

const services = [
  {
    title: 'Meta Ads & Google Ads',
    copy: 'Atraemos prospectos listos para comprar con segmentacion precisa, anuncios potentes y optimizacion diaria.',
    icon: Megaphone,
  },
  {
    title: 'SMS y Email Marketing',
    copy: 'Convertimos contactos frios en clientes activos con mensajes estrategicos en el momento exacto.',
    icon: Mail,
  },
  {
    title: 'Flujos Automatizados',
    copy: 'Automatiza seguimiento, ventas y postventa para crecer mas sin aumentar la carga operativa.',
    icon: Workflow,
  },
  {
    title: 'Chatbots con IA',
    copy: 'Responde en segundos, filtra leads y agenda reuniones 24/7 mientras tu equipo se enfoca en cerrar.',
    icon: Bot,
  },
  {
    title: 'Desarrollo Web',
    copy: 'Creamos webs rapidas, elegantes y enfocadas en conversion para que cada visita tenga valor.',
    icon: Code2,
  },
  {
    title: 'Landing Pages',
    copy: 'Paginas de alto impacto para tus campanas: mas clics, mas confianza, mas conversion.',
    icon: LayoutTemplate,
  },
];

const workSlides = [
  {
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1400&q=80',
    title: 'Campana de turismo con crecimiento sostenido',
  },
  {
    image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80',
    title: 'Ecommerce optimizado para vender desde el primer scroll',
  },
  {
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1400&q=80',
    title: 'Lanzamiento digital con estrategia full funnel',
  },
  {
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1400&q=80',
    title: 'Portal corporativo para posicionar y convertir',
  },
];

const statsSlides = [
  {
    value: '85%',
    text: 'de las interacciones con clientes sera automatizada. Quien optimiza hoy, lidera manana.',
  },
  {
    value: '73%',
    text: 'de usuarios decide en segundos si confia en una marca por su presencia digital.',
  },
  {
    value: '62%',
    text: 'de mejora en conversion se logra al alinear anuncios, web y seguimiento comercial.',
  },
];

const impact = [
  {
    title: 'Web Portafolio',
    accent: 'Portafolio',
    text: 'Presenta tu propuesta con claridad y eleva la percepcion de valor de tu marca.',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Web Perdidas',
    accent: 'Perdidas',
    text: 'Cada segundo de carga lenta o mensaje confuso son oportunidades que no regresan.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Crecimiento Digital',
    accent: 'Crecimiento',
    text: 'Integramos creatividad, data y automatizacion para escalar con resultados medibles.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
  },
];

const LandingScreen = () => {
  const [workIndex, setWorkIndex] = useState(0);
  const [statIndex, setStatIndex] = useState(0);

  const nextWork = () => setWorkIndex((prev) => (prev + 1) % workSlides.length);
  const prevWork = () => setWorkIndex((prev) => (prev - 1 + workSlides.length) % workSlides.length);

  const nextStat = () => setStatIndex((prev) => (prev + 1) % statsSlides.length);
  const prevStat = () => setStatIndex((prev) => (prev - 1 + statsSlides.length) % statsSlides.length);

  useEffect(() => {
    const previous = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = previous;
    };
  }, []);

  useEffect(() => {
    const workTimer = window.setInterval(nextWork, 5000);
    return () => window.clearInterval(workTimer);
  }, []);

  useEffect(() => {
    const statTimer = window.setInterval(nextStat, 6000);
    return () => window.clearInterval(statTimer);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="pointer-events-none absolute -left-16 top-20 h-72 w-72 rounded-full bg-[#ff0a78]/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#ff0a78]/10 blur-3xl" />

      <div className="mx-auto max-w-6xl px-5 pb-12 pt-7 md:px-8">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-3xl font-extrabold tracking-widest md:text-4xl">
            x<span className="text-[#ff0a78]">Plain</span>
          </div>
          <nav className="flex w-full items-center justify-center gap-6 rounded-xl border border-white/15 bg-slate-900/70 px-5 py-3 text-sm md:w-auto">
            <a className="font-semibold text-white transition-colors hover:text-[#ff0a78]" href="#home">Inicio</a>
            <a className="text-slate-300 transition-colors hover:text-white" href="#about">Nosotros</a>
            <a className="text-slate-300 transition-colors hover:text-white" href="#how">Como trabajamos</a>
            <a className="text-slate-300 transition-colors hover:text-white" href="#services">Servicios</a>
          </nav>
        </header>

        <section id="home" className="mx-auto max-w-4xl py-8 text-center md:py-14">
          <h1 className="text-5xl font-extrabold leading-[0.95] md:text-7xl">
            Convierte visitas en clientes <br /> con una marca que impacta
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 md:text-xl">
            En xPlain construimos experiencias digitales que atraen, convencen y venden. Tu crecimiento deja de ser suerte y se vuelve sistema.
          </p>
          <button type="button" className="mt-8 rounded-lg bg-[#ff0a78] px-8 py-3 text-lg font-bold transition-transform hover:scale-105 hover:bg-[#ff2d8f]">
            Quiero una estrategia ganadora
          </button>
        </section>

        <section id="how" className="mt-8 md:mt-14">
          <h2 className="text-3xl font-extrabold md:text-5xl">Asi creamos conexiones que venden</h2>
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="group rounded-xl border border-white/15 bg-white/[0.03] p-5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#ff0a78]/50 hover:bg-white/[0.05]">
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
            <button type="button" className="rounded-lg bg-[#ff0a78] px-8 py-3 text-lg font-bold transition-transform hover:scale-105 hover:bg-[#ff2d8f]">
              Agenda una llamada hoy
            </button>
          </div>
        </section>

        <section id="services" className="mt-14">
          <h2 className="text-4xl font-extrabold md:text-5xl">
            Resultados reales, <span className="text-[#ff0a78]">proyectos reales</span>
          </h2>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={prevWork}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-slate-300 transition hover:border-[#ff0a78] hover:text-white"
            >
              <ArrowLeft size={16} />
            </button>

            <div className="relative w-full overflow-hidden rounded-2xl border border-white/15">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${workIndex * 100}%)` }}
              >
                {workSlides.map((slide) => (
                  <article key={slide.image} className="w-full shrink-0 bg-slate-800/70 p-2">
                    <div className="relative overflow-hidden rounded-xl">
                      <img className="h-72 w-full object-cover md:h-96" src={slide.image} alt={slide.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <p className="absolute bottom-4 left-4 text-lg font-bold md:text-xl">{slide.title}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={nextWork}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-slate-300 transition hover:border-[#ff0a78] hover:text-white"
            >
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {workSlides.map((_, index) => (
              <button
                key={`work-dot-${index}`}
                type="button"
                onClick={() => setWorkIndex(index)}
                className={`h-2 rounded-full transition-all ${workIndex === index ? 'w-8 bg-[#ff0a78]' : 'w-2 bg-white/35'}`}
              />
            ))}
          </div>
        </section>

        <section id="about" className="mt-14">
          <h2 className="text-4xl font-extrabold md:text-5xl">
            Dato clave para <span className="text-[#ff0a78]">escalar</span>
          </h2>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={prevStat}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-slate-300 transition hover:border-[#ff0a78] hover:text-white"
            >
              <ArrowLeft size={16} />
            </button>

            <div className="w-full overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03]">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${statIndex * 100}%)` }}
              >
                {statsSlides.map((slide) => (
                  <article key={slide.value + slide.text} className="grid w-full shrink-0 grid-cols-1 gap-5 p-6 md:grid-cols-[1fr_1.2fr]">
                    <div className="text-7xl font-black leading-none md:text-9xl">
                      {slide.value.replace('%', '')}<span className="text-[#ff0a78]">%</span>
                    </div>
                    <p className="self-center text-lg text-slate-200 md:text-3xl">{slide.text}</p>
                  </article>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={nextStat}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-slate-300 transition hover:border-[#ff0a78] hover:text-white"
            >
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {statsSlides.map((_, index) => (
              <button
                key={`stat-dot-${index}`}
                type="button"
                onClick={() => setStatIndex(index)}
                className={`h-2 rounded-full transition-all ${statIndex === index ? 'w-8 bg-[#ff0a78]' : 'w-2 bg-white/35'}`}
              />
            ))}
          </div>

          <div className="mt-6 text-center">
            <button type="button" className="rounded-lg bg-[#ff0a78] px-8 py-3 text-lg font-bold transition-transform hover:scale-105 hover:bg-[#ff2d8f]">
              Quiero acelerar mis resultados
            </button>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-4xl font-extrabold md:text-5xl">
            <span className="text-[#ff0a78]">Potencia</span> el impacto de tu marca
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            {impact.map((card) => (
              <article key={card.title} className="overflow-hidden rounded-xl border border-white/15 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-[#ff0a78]/50">
                <img className="h-32 w-full object-cover" src={card.image} alt={card.title} />
                <div className="p-4">
                  <h3 className="text-3xl font-extrabold leading-none">
                    {card.title.split(' ')[0]} <span className="text-[#ff0a78]">{card.accent}</span>
                  </h3>
                  <p className="mt-3 text-sm text-slate-300">{card.text}</p>
                  <button type="button" className="mt-4 rounded-md bg-[#ff0a78] px-4 py-2 text-xs font-bold transition hover:bg-[#ff2d8f]">
                    Ver caso
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
            <h2 className="text-6xl font-extrabold leading-[0.9] md:text-7xl">
              Hablemos y llevemos <br /> tu marca al <span className="text-[#ff0a78]">siguiente nivel</span>
            </h2>
            <form className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-slate-300" htmlFor="email">correo</label>
                <input id="email" className="w-full rounded-lg border border-white/20 bg-slate-950/70 px-3 py-2 text-sm outline-none ring-[#ff0a78] focus:ring-2" type="email" placeholder="ejemplo@gmail.com" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-300" htmlFor="name">nombre</label>
                <input id="name" className="w-full rounded-lg border border-white/20 bg-slate-950/70 px-3 py-2 text-sm outline-none ring-[#ff0a78] focus:ring-2" type="text" placeholder="nombre completo" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-300" htmlFor="message">mensaje</label>
                <textarea id="message" className="h-36 w-full rounded-lg border border-white/20 bg-slate-950/70 px-3 py-2 text-sm outline-none ring-[#ff0a78] focus:ring-2" placeholder="cuentanos tu objetivo comercial..." />
              </div>
              <button type="button" className="w-full rounded-lg bg-[#ff0a78] py-3 text-lg font-bold transition hover:bg-[#ff2d8f]">
                Quiero mi propuesta
              </button>
            </form>
          </div>
        </section>

        <footer className="mt-14 grid grid-cols-1 gap-7 border-t border-white/15 pt-8 text-slate-300 md:grid-cols-3">
          <div>
            <p className="text-4xl font-extrabold tracking-widest text-white">
              x<span className="text-[#ff0a78]">Plain</span>
            </p>
            <p className="mt-2 text-sm">Marketing, automatizacion y conversion en un solo equipo.</p>
          </div>
          <div>
            <p className="font-bold text-white">Enlaces rapidos</p>
            <p className="mt-2 text-sm">Desarrollo web</p>
            <p className="text-sm">Gestion de redes sociales</p>
            <p className="text-sm">Publicidad digital</p>
            <p className="text-sm">Chatbots con IA</p>
          </div>
          <div>
            <p className="font-bold text-white">Hablemos</p>
            <p className="mt-2 text-sm">+51 923 567 890</p>
            <p className="text-sm">+1 713 912 3456</p>
            <p className="text-sm">hello@xplain.pe</p>
          </div>
        </footer>
      </div>
    </main>
  );
};

CreateReactScript((el) => {
  createRoot(el).render(<LandingScreen />);
});