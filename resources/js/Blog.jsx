import { createRoot } from 'react-dom/client';
import { useEffect, useMemo, useState } from 'react';
import Base from './Components/Tailwind/Base';
import CreateReactScript from './Utils/CreateReactScript';

const defaultPosts = [
  {
    slug: 'tuberia-pvc-u-vs-hdpe-cual-elegir-segun-el-tipo-de-proyecto-1',
    category: 'Productos',
    title: 'Tuberia PVC-U vs HDPE: cual elegir segun el tipo de proyecto?',
    description:
      'Comparamos resistencia, costo y aplicacion para que tomes la mejor decision tecnica en cada obra.',
    image: '/assets/img/categories/category-1.png',
  },
  {
    slug: 'como-instalar-tuberias-cpvc-en-proyectos-de-agua-caliente-sin-errores-2',
    category: 'Etiqueta',
    title: 'Como instalar tuberias CPVC en proyectos de agua caliente sin errores',
    description:
      'Guia paso a paso para una instalacion segura, duradera y certificada. Todo lo que el maestro necesita saber.',
    image: '/assets/img/categories/category-2.png',
  },
  {
    slug: 'infraestructura-hidrica-en-el-peru-los-retos-del-sector-construccion-en-2025-3',
    category: 'Industria',
    title: 'Infraestructura hidrica en el Peru: los retos del sector construccion en 2025',
    description:
      'Analizamos el panorama actual del sector, las normativas vigentes y como Tuboplast responde a la demanda.',
    image: '/assets/img/categories/category-3.png',
  },
  {
    slug: 'tuberia-pvc-u-vs-hdpe-cual-elegir-segun-el-tipo-de-proyecto-4',
    category: 'Productos',
    title: 'Tuberia PVC-U vs HDPE: cual elegir segun el tipo de proyecto?',
    description:
      'Comparamos resistencia, costo y aplicacion para que tomes la mejor decision tecnica en cada obra.',
    image: '/assets/img/categories/category-1.png',
  },
  {
    slug: 'como-instalar-tuberias-cpvc-en-proyectos-de-agua-caliente-sin-errores-5',
    category: 'Etiqueta',
    title: 'Como instalar tuberias CPVC en proyectos de agua caliente sin errores',
    description:
      'Guia paso a paso para una instalacion segura, duradera y certificada. Todo lo que el maestro necesita saber.',
    image: '/assets/img/categories/category-2.png',
  },
  {
    slug: 'infraestructura-hidrica-en-el-peru-los-retos-del-sector-construccion-en-2025-6',
    category: 'Industria',
    title: 'Infraestructura hidrica en el Peru: los retos del sector construccion en 2025',
    description:
      'Analizamos el panorama actual del sector, las normativas vigentes y como Tuboplast responde a la demanda.',
    image: '/assets/img/categories/category-3.png',
  },
];

const slugify = (value, index) => {
  const base = String(value || 'post')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!base) {
    return `post-${index + 1}`;
  }

  return base.endsWith(`-${index + 1}`) ? base : `${base}-${index + 1}`;
};

const defaultMostRead = [
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

const BlogScreen = ({ blog = {} }) => {
  const posts = Array.isArray(blog.posts) && blog.posts.length ? blog.posts : defaultPosts
  const mostRead = Array.isArray(blog.most_read) && blog.most_read.length ? blog.most_read : defaultMostRead
  const heroImage = blog.hero_image_url || (blog.hero_image ? `/storage/${blog.hero_image}` : '/assets/img/landing/bg-main.png')
  const heroBadge = blog.hero_badge || 'Blog Tuboplast'
  const heroTitle = blog.hero_title || 'Construyendo el futuro'
  const heroDescription = blog.hero_description || 'Explora las ultimas innovaciones tecnicas, proyectos emblematicos y consejos de ingenieria para el mercado peruano.'
  const sectionTitle = blog.section_title || 'Ultimas actualizaciones'
  const newsletter = {
    eyebrow: blog.newsletter_eyebrow || 'Newsletter',
    title: blog.newsletter_title || 'SE EL PRIMERO EN SABER',
    description: blog.newsletter_description || 'Tips de instalacion, nuevos productos y actualizaciones exclusivas para profesionales.',
    placeholder: blog.newsletter_placeholder || 'Correo electronico',
    buttonLabel: blog.newsletter_button_label || 'Suscribirme ahora',
  }
  const postsPerPage = 9
  const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage))

  const readPageFromUrl = () => {
    if (typeof window === 'undefined') return 1
    const params = new URLSearchParams(window.location.search)
    const raw = Number.parseInt(params.get('page') || '1', 10)
    if (!Number.isFinite(raw) || raw < 1) return 1
    return Math.min(raw, totalPages)
  }

  const [currentPage, setCurrentPage] = useState(readPageFromUrl)

  useEffect(() => {
    const nextPage = readPageFromUrl()
    setCurrentPage(nextPage)
  }, [totalPages])

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage
    return posts.slice(start, start + postsPerPage)
  }, [currentPage, posts])

  const goToPage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages)
    setCurrentPage(nextPage)

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (nextPage === 1) {
        url.searchParams.delete('page')
      } else {
        url.searchParams.set('page', String(nextPage))
      }
      window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
    }
  }

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden">
        <img
          src={heroImage}
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
                {heroBadge}:
                <br />
                {heroTitle}
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-darkmuted sm:text-lg">
                {heroDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-site px-4 py-12 sm:py-16 lg:py-20">
        <div className="mb-8 sm:mb-10">
          <h2 className="font-title text-3xl font-medium text-primary sm:text-4xl">{sectionTitle}</h2>
          <span className="mt-3 block h-1 w-10 bg-secondary" />
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_290px] md:items-start">
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {paginatedPosts.map((post, index) => {
              const absoluteIndex = (currentPage - 1) * postsPerPage + index
              return (
              <a
                href={post.detail_url || `/blog/${post.slug || slugify(post.title, absoluteIndex)}`}
                key={`${post.title}-${absoluteIndex}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-[0_4px_18px_rgba(15,23,42,0.12)] ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img src={post.image_url || post.image_fallback || post.image} alt={post.title} className="aspect-[4/3] w-full object-cover" />
                <div className="space-y-4 p-5">
                  <span className="inline-flex rounded-full border border-[#cdddf3] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                    {post.category}
                  </span>
                  <h3 className="font-title text-2xl leading-tight text-primary">{post.title}</h3>
                  <p className="text-sm leading-relaxed text-muted line-clamp-3">{post.description}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:gap-3">
                    Leer articulo
                    <i className="mdi mdi-arrow-right text-base"></i>
                  </span>
                </div>
              </a>
            )})}
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
                  {newsletter.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/80">
                  {newsletter.description}
                </p>

                <div className="mt-6 space-y-3">
                  <input
                    className="w-full rounded-full border border-white/15 bg-white/10 px-5 py-3.5 text-sm outline-none placeholder:text-white/55"
                    placeholder={newsletter.placeholder}
                    type="email"
                  />
                  <button
                    type="button"
                    className="w-full rounded-full bg-secondary px-5 py-3.5 text-sm font-bold text-primary transition hover:bg-[#f0d200]"
                  >
                    {newsletter.buttonLabel}
                  </button>
                </div>
              </div>
            </article>
          </aside>
        </div>

        {totalPages > 1 ? (
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-primary">
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full border border-transparent transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Pagina anterior"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <i className="mdi mdi-chevron-left text-xl"></i>
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={`page-${page}`}
                type="button"
                onClick={() => goToPage(page)}
                className={`min-w-9 rounded-full px-3 py-1 font-medium transition ${
                  currentPage === page
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted hover:text-primary'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full border border-transparent transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Pagina siguiente"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <i className="mdi mdi-chevron-right text-xl"></i>
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Base title="Blog">
      <BlogScreen {...properties} />
    </Base>,
  );
});
