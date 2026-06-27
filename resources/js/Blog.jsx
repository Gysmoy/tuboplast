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
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!base) {
    return `post-${index + 1}`;
  }

  return base.endsWith(`-${index + 1}`) ? base : `${base}-${index + 1}`;
};

const postUrl = (post, absoluteIndex) => post.detail_url || `/blog/${post.slug || slugify(post.title, absoluteIndex)}`;
const postImage = (post) => post.image_url || post.image_fallback || post.image;
const postMeta = (post) => [post.author, post.published, post.read_time].filter(Boolean).join(' · ');

const CategoryBadge = ({ children, light = false }) => (
  <span className={`inline-flex w-max items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${light ? 'bg-white/90 text-primary' : 'bg-secondary text-primary'}`}>
    {children || 'Artículo'}
  </span>
);

const PostCard = ({ post, absoluteIndex }) => {
  const meta = postMeta(post);

  return (
    <a
      href={postUrl(post, absoluteIndex)}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_18px_rgba(15,23,42,0.10)] ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative overflow-hidden">
        <img
          src={postImage(post)}
          alt={post.title}
          className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105 sm:aspect-[4/3]"
        />
        <span className="absolute left-3 top-3">
          <CategoryBadge>{post.category}</CategoryBadge>
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-title text-lg font-medium leading-snug text-primary sm:text-xl">{post.title}</h3>
        <p className="text-sm leading-relaxed text-muted line-clamp-2">{post.description}</p>
        {meta && <p className="text-[11px] uppercase tracking-[0.08em] text-muted">{meta}</p>}
        <span className="mt-auto inline-flex items-center gap-2 pt-1 text-sm font-semibold text-primary transition group-hover:gap-3">
          Leer artículo
          <i className="mdi mdi-arrow-right text-base"></i>
        </span>
      </div>
    </a>
  );
};

const FeaturedCard = ({ post, absoluteIndex }) => {
  const meta = postMeta(post);

  return (
    <a
      href={postUrl(post, absoluteIndex)}
      className="group grid overflow-hidden rounded-3xl bg-white shadow-[0_10px_30px_rgba(15,23,42,0.12)] ring-1 ring-black/5 transition hover:shadow-xl lg:grid-cols-2"
    >
      <div className="relative overflow-hidden">
        <img
          src={postImage(post)}
          alt={post.title}
          className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105 lg:h-full"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          <i className="mdi mdi-star text-secondary"></i> Destacado
        </span>
      </div>
      <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 lg:p-10">
        <CategoryBadge>{post.category}</CategoryBadge>
        <h3 className="font-title text-2xl font-medium leading-tight text-primary sm:text-3xl">{post.title}</h3>
        <p className="text-base leading-relaxed text-darkmuted line-clamp-3">{post.description}</p>
        {meta && <p className="text-xs uppercase tracking-[0.08em] text-muted">{meta}</p>}
        <span className="inline-flex items-center gap-2 text-sm font-bold text-primary transition group-hover:gap-3">
          Leer artículo completo
          <i className="mdi mdi-arrow-right text-base"></i>
        </span>
      </div>
    </a>
  );
};

const BlogScreen = ({ blog = {} }) => {
  const posts = Array.isArray(blog.posts) && blog.posts.length ? blog.posts : defaultPosts;
  // Los 3 más leídos se derivan de los artículos (sin configuración manual).
  const mostRead = posts.slice(0, 3).map((post, index) => ({
    number: String(index + 1).padStart(2, '0'),
    title: post.title,
    category: post.category,
    detail_url: postUrl(post, index),
  }));
  const heroImage = blog.hero_image_url || (blog.hero_image ? `/storage/${blog.hero_image}` : '/assets/img/sliders/main-slider.png');
  const heroBadge = blog.hero_badge || 'Blog Tuboplast';
  const heroTitle = blog.hero_title || 'Construyendo el futuro';
  const heroDescription = blog.hero_description || 'Explora las ultimas innovaciones tecnicas, proyectos emblematicos y consejos de ingenieria para el mercado peruano.';
  const sectionTitle = blog.section_title || 'Ultimas actualizaciones';
  const newsletter = {
    eyebrow: blog.newsletter_eyebrow || 'Newsletter',
    title: blog.newsletter_title || 'SE EL PRIMERO EN SABER',
    description: blog.newsletter_description || 'Tips de instalacion, nuevos productos y actualizaciones exclusivas para profesionales.',
    placeholder: blog.newsletter_placeholder || 'Correo electronico',
    buttonLabel: blog.newsletter_button_label || 'Suscribirme ahora',
  };
  const postsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage));

  const readPageFromUrl = () => {
    if (typeof window === 'undefined') return 1;
    const params = new URLSearchParams(window.location.search);
    const raw = Number.parseInt(params.get('page') || '1', 10);
    if (!Number.isFinite(raw) || raw < 1) return 1;
    return Math.min(raw, totalPages);
  };

  const [currentPage, setCurrentPage] = useState(readPageFromUrl);

  useEffect(() => {
    setCurrentPage(readPageFromUrl());
  }, [totalPages]);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return posts.slice(start, start + postsPerPage);
  }, [currentPage, posts]);

  const goToPage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (nextPage === 1) {
        url.searchParams.delete('page');
      } else {
        url.searchParams.set('page', String(nextPage));
      }
      window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const pageOffset = (currentPage - 1) * postsPerPage;
  const featured = currentPage === 1 && paginatedPosts.length > 3 ? paginatedPosts[0] : null;
  const gridPosts = featured ? paginatedPosts.slice(1) : paginatedPosts;

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

        <div className="relative mx-auto flex min-h-[340px] w-full max-w-site items-center px-4 py-12 sm:min-h-[420px] sm:py-16 lg:min-h-[500px]">
          <div className="max-w-xl space-y-5">
            <span className="block h-1 w-12 bg-secondary" />
            <div className="space-y-4">
              <h1 className="font-title text-4xl font-medium leading-[1.05] tracking-tight text-primary sm:text-5xl lg:text-6xl">
                {heroBadge}:
                <br />
                {heroTitle}
              </h1>
              <p className="max-w-md text-base leading-relaxed text-darkmuted">
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

        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_300px] md:items-start">
          <div className="space-y-6">
            {featured && <FeaturedCard post={featured} absoluteIndex={pageOffset} />}

            {gridPosts.length ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {gridPosts.map((post, index) => {
                  const absoluteIndex = pageOffset + (featured ? index + 1 : index);
                  return <PostCard key={`${post.title}-${absoluteIndex}`} post={post} absoluteIndex={absoluteIndex} />;
                })}
              </div>
            ) : (
              !featured && (
                <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 px-6 py-20 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-silver text-primary">
                    <i className="mdi mdi-newspaper-variant-outline text-3xl"></i>
                  </span>
                  <h3 className="mt-5 font-title text-xl font-bold text-primary">Aún no hay artículos publicados</h3>
                  <p className="mt-2 max-w-sm text-sm text-muted">Vuelve pronto: estamos preparando contenido técnico para ti.</p>
                </div>
              )
            )}

            {totalPages > 1 ? (
              <div className="flex items-center justify-center gap-2 pt-4 text-sm text-primary">
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
                      currentPage === page ? 'border-b-2 border-primary text-primary' : 'text-muted hover:text-primary'
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
          </div>

          <aside className="space-y-8 md:pl-2">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-0.5 w-6 bg-secondary" />
                <p className="font-title text-sm font-bold uppercase tracking-[0.12em] text-primary">Más leídos</p>
              </div>

              <div className="divide-y divide-slate-200 rounded-2xl bg-white px-2 sm:px-0">
                {mostRead.map((item) => (
                  <a key={item.number} href={item.detail_url} className="group flex gap-4 py-4 transition first:pt-0 last:pb-0">
                    <span className="min-w-10 font-title text-3xl font-medium leading-none text-[#d9e2ee] transition group-hover:text-secondary sm:text-4xl">
                      {item.number}
                    </span>
                    <div className="space-y-1 pr-2">
                      <h4 className="text-sm font-semibold leading-snug text-primary transition group-hover:text-[#003b7a] sm:text-base">{item.title}</h4>
                      <p className="text-[11px] uppercase tracking-[0.12em] text-muted">{item.category}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <article className="overflow-hidden rounded-2xl bg-primary text-white shadow-[0_10px_30px_rgba(0,59,122,0.22)]">
              <div className="bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_34%),linear-gradient(135deg,rgba(0,59,122,1),rgba(0,78,155,1))] px-5 py-6 sm:px-6 sm:py-7">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">{newsletter.eyebrow}</p>
                <h3 className="max-w-[14ch] font-title text-xl font-medium leading-tight sm:text-2xl">
                  {newsletter.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
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
