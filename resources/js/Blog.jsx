import { createRoot } from 'react-dom/client';
import Base from './Components/Tailwind/Base';
import CreateReactScript from './Utils/CreateReactScript';

const posts = [
  {
    category: 'Productos',
    title: 'Tuberia PVC-U vs HDPE: cual elegir segun el tipo de proyecto?',
    description:
      'Comparamos resistencia, costo y aplicacion para que tomes la mejor decision tecnica en cada obra.',
    image: '/assets/img/categories/category-1.png',
  },
  {
    category: 'Etiqueta',
    title: 'Como instalar tuberias CPVC en proyectos de agua caliente sin errores',
    description:
      'Guia paso a paso para una instalacion segura, duradera y certificada. Todo lo que el maestro necesita saber.',
    image: '/assets/img/categories/category-2.png',
  },
  {
    category: 'Industria',
    title: 'Infraestructura hidrica en el Peru: los retos del sector construccion en 2025',
    description:
      'Analizamos el panorama actual del sector, las normativas vigentes y como Tuboplast responde a la demanda.',
    image: '/assets/img/categories/category-3.png',
  },
  {
    category: 'Productos',
    title: 'Tuberia PVC-U vs HDPE: cual elegir segun el tipo de proyecto?',
    description:
      'Comparamos resistencia, costo y aplicacion para que tomes la mejor decision tecnica en cada obra.',
    image: '/assets/img/categories/category-1.png',
  },
  {
    category: 'Etiqueta',
    title: 'Como instalar tuberias CPVC en proyectos de agua caliente sin errores',
    description:
      'Guia paso a paso para una instalacion segura, duradera y certificada. Todo lo que el maestro necesita saber.',
    image: '/assets/img/categories/category-2.png',
  },
  {
    category: 'Industria',
    title: 'Infraestructura hidrica en el Peru: los retos del sector construccion en 2025',
    description:
      'Analizamos el panorama actual del sector, las normativas vigentes y como Tuboplast responde a la demanda.',
    image: '/assets/img/categories/category-3.png',
  },
];

const mostRead = [
  {
    number: '01',
    title: 'Manual de instalacion de valvulas mariposa',
    category: 'Soporte tecnico',
  },
  {
    number: '02',
    title: 'Norma tecnica peruana para PVC-U',
    category: 'Normativa',
  },
  {
    number: '03',
    title: 'Comparativo: CPVC vs PPR en edificios',
    category: 'Infraestructura',
  },
];

const BlogScreen = () => {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden">
        <img
          src="/assets/img/landing/bg-main.png"
          alt="Obra en construccion"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/50" />

        <div className="relative mx-auto flex min-h-[560px] w-full max-w-site items-end px-4 py-14 sm:min-h-[640px] sm:py-20 lg:min-h-[700px] lg:py-24">
          <div className="max-w-xl space-y-6 pb-10 sm:pb-16 lg:pb-20">
            <span className="block h-1 w-12 bg-secondary" />
            <div className="space-y-4">
              <h1 className="max-w-lg font-title text-5xl leading-[0.95] tracking-tight text-primary sm:text-6xl lg:text-[4.7rem]">
                Blog Tuboplast:
                <br />
                Construyendo el futuro
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-darkmuted sm:text-lg">
                Explora las ultimas innovaciones tecnicas, proyectos emblematicos y consejos de ingenieria para el
                mercado peruano.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-site px-4 py-12 sm:py-16 lg:py-20">
        <div className="mb-8 sm:mb-10">
          <h2 className="font-title text-3xl font-medium text-primary sm:text-4xl">Ultimas actualizaciones</h2>
          <span className="mt-3 block h-1 w-10 bg-secondary" />
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_290px] md:items-start">
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {posts.map((post, index) => (
              <article
                key={`${post.title}-${index}`}
                className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_18px_rgba(15,23,42,0.12)] ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img src={post.image} alt={post.title} className="aspect-[4/3] w-full object-cover" />
                <div className="space-y-4 p-5">
                  <span className="inline-flex rounded-full border border-[#cdddf3] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                    {post.category}
                  </span>
                  <h3 className="font-title text-2xl leading-tight text-primary">{post.title}</h3>
                  <p className="text-sm leading-relaxed text-muted line-clamp-3">{post.description}</p>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-6 md:sticky md:top-6 md:pl-2">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-0.5 w-6 bg-secondary" />
                <p className="font-title text-xl font-medium text-primary">Mas leidos</p>
              </div>

              <div className="divide-y divide-slate-200 rounded-2xl bg-white">
                {mostRead.map((item) => (
                  <article key={item.number} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <span className="min-w-12 font-title text-3xl font-medium leading-none text-[#d9e2ee]">
                      {item.number}
                    </span>
                    <div className="space-y-1 pr-2">
                      <h4 className="text-sm leading-snug font-medium text-primary">{item.title}</h4>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-muted">{item.category}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <article className="overflow-hidden rounded-2xl bg-primary text-white shadow-[0_10px_30px_rgba(0,59,122,0.22)]">
              <div className="bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_34%),linear-gradient(135deg,rgba(0,59,122,1),rgba(0,78,155,1))] px-5 py-6">
                <h3 className="max-w-[12ch] font-title text-2xl leading-tight">
                  SE EL PRIMERO EN SABER
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/80">
                  Tips de instalacion, nuevos productos y actualizaciones exclusivas para profesionales.
                </p>

                <div className="mt-6 space-y-3">
                  <input
                    className="w-full rounded-full border border-white/15 bg-white/10 px-5 py-3.5 text-sm outline-none placeholder:text-white/55"
                    placeholder="Correo electronico"
                    type="email"
                  />
                  <button
                    type="button"
                    className="w-full rounded-full bg-secondary px-5 py-3.5 text-sm font-bold text-primary transition hover:bg-[#f0d200]"
                  >
                    Suscribirme ahora
                  </button>
                </div>
              </div>
            </article>
          </aside>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-primary">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full border border-transparent transition hover:border-slate-300 hover:bg-slate-50"
            aria-label="Pagina anterior"
          >
            <i className="mdi mdi-chevron-left text-xl"></i>
          </button>
          <button
            type="button"
            className="min-w-9 rounded-full border-b-2 border-primary px-3 py-1 font-medium text-primary"
          >
            1
          </button>
          <button
            type="button"
            className="min-w-9 rounded-full px-3 py-1 text-muted transition hover:text-primary"
          >
            2
          </button>
          <button
            type="button"
            className="min-w-9 rounded-full px-3 py-1 text-muted transition hover:text-primary"
          >
            3
          </button>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full border border-transparent transition hover:border-slate-300 hover:bg-slate-50"
            aria-label="Pagina siguiente"
          >
            <i className="mdi mdi-chevron-right text-xl"></i>
          </button>
        </div>
      </section>
    </main>
  );
};

CreateReactScript((el) => {
  createRoot(el).render(
    <Base title="Blog">
      <BlogScreen />
    </Base>,
  );
});
