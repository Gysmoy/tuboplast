import { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Base from './Components/Tailwind/Base';
import ItemCard from './Components/Items/ItemCard';
import CreateReactScript from './Utils/CreateReactScript';
import Emphasis from './Utils/em';

// Carrusel: 2 visibles, avanza de uno en uno, autoplay + drag con mouse.
const carouselProps = (lgPerView) => ({
  modules: [Autoplay],
  spaceBetween: 12,
  slidesPerView: 2,
  slidesPerGroup: 1,
  grabCursor: true,
  loop: true,
  autoplay: { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true },
  breakpoints: {
    640: { slidesPerView: 2, spaceBetween: 16 },
    1024: { slidesPerView: lgPerView, spaceBetween: 24 },
  },
});
// Duplica el arreglo hasta tener al menos `min` slides para que el loop
// funcione aunque vengan pocos elementos (4 -> 8).
const loopSafe = (arr, min) => {
  if (!arr.length || arr.length >= min) return arr;
  const times = Math.ceil(min / arr.length);
  return Array.from({ length: times }, () => arr).flat();
};

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
      '/assets/img/categories/category-1.webp',
  },
  {
    title: 'Infraestructura',
    image:
      '/assets/img/categories/category-2.webp',
  },
  {
    title: 'Minería e Industria',
    image:
      '/assets/img/categories/category-3.webp',
  },
  {
    title: 'Agrícola',
    image:
      '/assets/img/categories/category-4.webp',
  },
];

const defaultExpertCategories = [
  {
    title: 'Edificación',
    image: '/assets/img/categories/category-1.webp',
    href: '/catalog?segment%5B%5D=Edificaciones',
  },
  {
    title: 'Saneamiento',
    image: '/assets/img/categories/category-2.webp',
    href: '/catalog?segment%5B%5D=Saneamiento',
  },
  {
    title: 'Minería',
    image: '/assets/img/categories/category-3.webp',
    href: '/catalog?segment%5B%5D=Mineria',
  },
  {
    title: 'Agricultura',
    image: '/assets/img/categories/category-4.webp',
    href: '/catalog?segment%5B%5D=Agricultura',
  },
];

const recommendations = [
  {
    category: 'Tubería PVC-U',
    title: 'Tubería Agua SP Clase 15 NTP 399.002 3/4" x 5m',
    image: '/assets/img/items/item-1.webp',
    price: 'S/ 28.30',
    currency: 'PEN',
    use: 'AGUA FRIA',
    diameter: '3/4"',
  },
  {
    category: 'Tubería PVC-U',
    title: 'Tubería Agua SP Clase 15 NTP 399.002 3/4" x 5m',
    image: '/assets/img/items/item-2.webp',
    price: 'S/ 28.30',
    currency: 'PEN',
    use: 'AGUA FRIA',
    diameter: '3/4"',
  },
  {
    category: 'Tubería PVC-U',
    title: 'Tubería Agua SP Clase 15 MTP 398.002 3/4 x 5m',
    image: '/assets/img/items/item-3.webp',
    price: 'S/ 28.30',
    currency: 'PEN',
    use: 'AGUA FRIA',
    diameter: '3/4"',
  },
  {
    category: 'Tubería PVC-U',
    title: 'Tubería Agua SP Clase 15 MTP 980.002 3/4 x 5m',
    image: '/assets/img/items/item-4.webp',
    price: 'S/ 28.30',
    currency: 'PEN',
    use: 'AGUA FRIA',
    diameter: '3/4"',
  },
];

const defaultBlogPosts = [
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

const defaultHeroItem = {
  categoryLabel: 'destacado',
  title: 'Tuberia de Alta Presion Clase 15',
  description: 'Uso industrial y civil en conduccion de agua con alta resistencia al impacto y presion.',
  image: '/assets/img/items/item-1.webp',
  detailUrl: '/catalog',
  specOneLabel: 'Material',
  specOneValue: 'PVC-U Virgen',
  specTwoLabel: 'Normativa',
  specTwoValue: 'NTP 399.002',
};

const defaultHeroSlides = [
  {
    id: 'default-home-hero',
    title: 'Tuboplast',
    description: 'Expertos en tuberias y conexiones de PVC para proyectos profesionales.',
    image_url: '/assets/img/sliders/hero-home.webp',
    display_mode: 'image_with_text',
    primary_button_text: 'Ver catalogo',
    primary_button_link: '/catalog',
    secondary_button_text: 'Contactar',
    secondary_button_link: '/contact',
    metrics: [],
    item: defaultHeroItem,
  },
];

const heroMetrics = (slide) => {
  const metrics = Array.isArray(slide.metrics)
    ? slide.metrics
    : [
      { value: slide.metric_one_value, label: slide.metric_one_label },
      { value: slide.metric_two_value, label: slide.metric_two_label },
    ];

  return metrics.filter((metric) => metric?.value || metric?.label).slice(0, 2);
};

const heroButtons = (slide) => [
  {
    text: slide.primary_button_text,
    link: slide.primary_button_link,
    className: 'bg-primary text-white shadow-md',
  },
  {
    text: slide.secondary_button_text,
    link: slide.secondary_button_link,
    className: 'bg-[#F7DD00] text-primary shadow-md',
  },
].filter((button) => button.text);

const HeroProductCard = ({ item }) => {
  const product = item || defaultHeroItem;

  return (
    <article
      data-hero-card
      data-float-card
      className="space-y-5 rounded-3xl bg-white p-5 shadow-xl sm:max-w-xl sm:p-8 lg:ml-auto lg:max-w-none"
    >
      <span className="inline-block bg-[#F7DD00] px-2 py-1 text-[10px] font-bold uppercase text-primary">
        {product.categoryLabel || product.category || 'destacado'}
      </span>
      <div className='space-y-2'>
        <h3 className="text-2xl font-medium font-title text-primary">{product.title}</h3>
        <p className="text-sm text-darkmuted line-clamp-3">
          {product.description || defaultHeroItem.description}
        </p>
      </div>
      <div className="mt-4 space-y-3 text-xs uppercase">
        <div className='flex justify-between gap-4'>
          <span className='text-muted'>{product.specOneLabel || 'Material'}</span>
          <span className='text-right text-darkmuted'>{product.specOneValue || product.material || '-'}</span>
        </div>
        <hr className='bg-muted' />
        <div className='flex justify-between gap-4'>
          <span className='text-muted'>{product.specTwoLabel || 'Normativa'}</span>
          <span className='text-right text-darkmuted'>{product.specTwoValue || product.pressure || product.use || '-'}</span>
        </div>
      </div>
      <a
        href={product.detailUrl || product.detail_url || '/catalog'}
        className="block w-full rounded-full border border-silver p-4 font-bold font-title text-primary transition-colors hover:bg-silver"
      >
        Especificaciones Tecnicas
      </a>
    </article>
  );
};

const HeroSlide = ({ slide, priority = false }) => {
  const metrics = heroMetrics(slide);
  const buttons = heroButtons(slide);
  const isImageOnly = slide.display_mode === 'image_only';
  const usesBakedOverlay = (slide.image_path || slide.image_url || '').includes('hero-obras-alto-rendimiento');

  if (isImageOnly) {
    return (
      <div className="overflow-hidden bg-white">
        <img
          src={slide.image_url || '/assets/img/sliders/hero-home.webp'}
          alt={slide.title || 'Tuboplast'}
          width={1672}
          height={941}
          fetchPriority={priority ? 'high' : 'auto'}
          loading={priority ? undefined : 'lazy'}
          decoding="async"
          className="block h-auto w-full"
        />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <img
        src={slide.image_url || '/assets/img/sliders/hero-home.webp'}
        alt={slide.title || 'Tuboplast'}
        width={1672}
        height={941}
        fetchPriority={priority ? 'high' : 'auto'}
        loading={priority ? undefined : 'lazy'}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className={`absolute inset-0 ${
        usesBakedOverlay
          ? 'bg-gradient-to-r from-white/35 via-white/20 to-white/10'
          : 'bg-gradient-to-r from-white/90 via-white/82 to-white/70'
      }`} />

      <div className="relative mx-auto grid w-full max-w-site gap-8 px-16 pb-12 pt-10 sm:gap-10 sm:px-20 sm:pb-16 sm:pt-14 lg:grid-cols-[1fr_390px] lg:items-center lg:px-24 lg:pb-32 lg:pt-20 xl:px-4">
        <div className="max-w-2xl space-y-5 sm:pl-8 sm:space-y-7 lg:space-y-8 lg:pl-12 xl:pl-20">
          <span data-hero-line className="block h-1 w-16 bg-secondary" />
          <h1
            data-hero-title
            className="font-title text-4xl leading-none tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {slide.title || defaultHeroSlides[0].title}
          </h1>
          <p data-hero-copy className="max-w-lg text-base leading-relaxed text-darkmuted sm:text-lg lg:text-xl lg:leading-tight">
            {slide.description || defaultHeroSlides[0].description}
          </p>

          {buttons.length > 0 && (
            <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center">
              {buttons.map((button, index) => (
                <a
                  key={`${button.text}-${index}`}
                  href={button.link || '#'}
                  data-hero-cta
                  className={`rounded-full px-6 py-3.5 text-center text-sm font-semibold transition sm:px-10 sm:py-4 ${button.className}`}
                >
                  {button.text} <i className="mdi mdi-arrow-right ml-1 align-middle text-sm"></i>
                </a>
              ))}
            </div>
          )}

          {metrics.length > 0 && (
            <div className="flex flex-wrap gap-8 sm:gap-10">
              {metrics.map((metric, index) => (
                <div key={`${metric.value}-${metric.label}-${index}`} data-hero-stat>
                  <p className="text-3xl font-title font-light text-primary">{metric.value}</p>
                  <p className="text-xs text-muted uppercase">{metric.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <HeroProductCard item={slide.item} />
      </div>
    </div>
  );
};

const HomeScreen = ({ blog = {}, sliders = [], expertCategories = [] }) => {
  const pageRef = useRef(null);
  const heroPrevRef = useRef(null);
  const heroNextRef = useRef(null);
  const heroPaginationRef = useRef(null);
  const blogPosts = Array.isArray(blog.posts) && blog.posts.length ? blog.posts.slice(0, 12) : defaultBlogPosts;
  const heroSlides = Array.isArray(sliders) && sliders.length ? sliders : defaultHeroSlides;
  const homeExpertCategories = Array.isArray(expertCategories) && expertCategories.length ? expertCategories : defaultExpertCategories;
  const hasHeroControls = heroSlides.length > 1;
  const heroAutoplay = hasHeroControls
    ? { delay: 4800, disableOnInteraction: false, pauseOnMouseEnter: true }
    : false;
  const newsletter = {
    eyebrow: blog.newsletter_eyebrow || 'Newsletter',
    title: blog.newsletter_title || 'SE EL PRIMERO EN SABER',
    description: blog.newsletter_description || 'Tips de instalación, nuevos productos y actualizaciones exclusivas para profesionales.',
    placeholder: blog.newsletter_placeholder || 'Correo electronico',
    buttonLabel: blog.newsletter_button_label || 'Quiero suscribirme',
  };

  return (
    <main ref={pageRef} className="min-h-screen">
      <section className="relative overflow-hidden">
        <style>{`
          .hero-slider-pagination{position:absolute;left:50%;bottom:18px;z-index:20;display:flex;transform:translateX(-50%);gap:8px;}
          .hero-dot{display:block;width:10px;height:10px;border-radius:999px;background:#00499133;border:1px solid #00499155;cursor:pointer;transition:width .2s,background .2s,border-color .2s;}
          .hero-dot.is-active{width:28px;background:#004991;border-color:#004991;}
          @media(min-width:1024px){.hero-slider-pagination{bottom:28px;}}
        `}</style>
        {hasHeroControls && (
          <>
            <button
              ref={heroPrevRef}
              type="button"
              aria-label="Slider anterior"
              className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-primary shadow-lg ring-1 ring-primary/10 transition hover:bg-white sm:left-5 sm:grid lg:left-8 lg:h-12 lg:w-12"
            >
              <i className="mdi mdi-chevron-left text-2xl"></i>
            </button>
            <button
              ref={heroNextRef}
              type="button"
              aria-label="Siguiente slider"
              className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-primary shadow-lg ring-1 ring-primary/10 transition hover:bg-white sm:right-5 sm:grid lg:right-8 lg:h-12 lg:w-12"
            >
              <i className="mdi mdi-chevron-right text-2xl"></i>
            </button>
            <div ref={heroPaginationRef} className="hero-slider-pagination"></div>
          </>
        )}
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          slidesPerView={1}
          loop={heroSlides.length > 1}
          speed={650}
          navigation={hasHeroControls ? { prevEl: heroPrevRef.current, nextEl: heroNextRef.current } : false}
          pagination={hasHeroControls ? {
            el: heroPaginationRef.current,
            clickable: true,
            bulletClass: 'hero-dot',
            bulletActiveClass: 'is-active',
            renderBullet: (_, className) => `<button type="button" class="${className}" aria-label="Cambiar slider"></button>`,
          } : false}
          autoplay={heroAutoplay}
          onBeforeInit={(swiper) => {
            if (!hasHeroControls) return;
            swiper.params.navigation.prevEl = heroPrevRef.current;
            swiper.params.navigation.nextEl = heroNextRef.current;
            swiper.params.pagination.el = heroPaginationRef.current;
          }}
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={slide.id || index}>
              <HeroSlide slide={slide} priority={index === 0} />
            </SwiperSlide>
          ))}
        </Swiper>
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

              <div className="max-w-md">
                <p className="text-sm text-white/75">
                  Tuboplast es la primera fábrica 100% peruana. No solo fabricamos tuberías; diseñamos la infraestructura del mañana con ingeniería de precisión y materiales de vanguardia.
                </p>
              </div>
            </div>
          </article>

          <div className="relative z-[1] mt-6 aspect-[4/3] w-full rounded-[20px] shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:aspect-video lg:absolute lg:right-0 lg:-top-10 lg:mt-0 lg:h-[75%] lg:w-[calc(40%+80px)] lg:aspect-auto">
            <img
              src="/assets/img/home/planta-tuberias-produccion.jpg"
              alt="Planta de producción de tuberías Tuboplast"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover rounded-2xl"
            />
            <div className="absolute bottom-4 left-4 rounded-lg bg-secondary px-5 py-4 text-primary shadow-[0_24px_60px_rgba(0,0,0,0.18)] sm:bottom-6 sm:left-6 sm:px-8 sm:py-6 lg:-bottom-40 lg:left-10 lg:px-10 lg:py-10">
              <p className="font-title text-4xl font-black sm:text-5xl lg:text-6xl">60+</p>
              <p className="text-sm font-medium uppercase">AÑOS CONSTRUYENDO <br /> EL PERÚ</p>
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
            <a className="font-medium text-primary" href="/catalog">
              Ver todo <i className="mdi mdi-arrow-right align-middle text-sm ms-1"></i>
            </a>
          </div>

          <Swiper {...carouselProps(4)} className="!pb-1">
            {loopSafe(homeExpertCategories, 8).map((category, index) => (
              <SwiperSlide key={`${category.title}-${index}`} className="!h-auto">
                <a
                  href={category.href}
                  data-reveal
                  className="group relative block h-full overflow-hidden rounded-xl shadow-md ring-1 ring-black/5"
                >
                  <img
                    src={category.image}
                    alt={category.title}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105 lg:aspect-[3/4]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/35 to-transparent" />
                  <p className="absolute bottom-5 left-4 right-4 font-title text-xl font-medium leading-tight text-white sm:bottom-7 sm:left-6 sm:right-6 sm:text-2xl lg:bottom-10 lg:left-8 lg:right-8 lg:text-3xl">{category.title}</p>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section id="productos" className="py-12 sm:py-16">
        <div className={'mx-auto w-full max-w-site px-4'}>
          <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
            <div>
              <p className="font-title text-3xl font-medium leading-tight text-primary sm:text-4xl">Nuestras Recomendaciones</p>
              <span className="mt-2 block h-1 w-12 bg-secondary" />
            </div>
            <a className="font-medium text-primary" href="/catalog">
              Ver todo <i className="mdi mdi-arrow-right align-middle text-sm ms-1"></i>
            </a>
          </div>

          <Swiper {...carouselProps(4)} className="!pb-1">
            {loopSafe(recommendations, 8).map((product, index) => (
              <SwiperSlide key={`${product.title}-${index}`} className="!h-auto">
                <ItemCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
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
            <a href="/club#registro-club" className="inline-flex rounded-full bg-primary px-8 py-3.5 font-title font-medium text-white">
              Registrarme ahora <i className="mdi mdi-arrow-right ms-2"></i>
            </a>
          </div>
          <div className="relative flex items-end justify-center">
            <img
              src="/assets/img/landing/club-expert.webp"
              alt="Club Experto"
              loading="lazy"
              decoding="async"
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
            <a className="font-medium text-primary" href="/blog">
              Ver todo <i className="mdi mdi-arrow-right align-middle text-sm ms-1"></i>
            </a>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
            <div className="min-w-0 lg:w-3/4">
              <Swiper {...carouselProps(3)} className="!pb-1">
                {loopSafe(blogPosts, 6).map((post, index) => (
                  <SwiperSlide key={`${post.title}-${index}`} className="!h-auto">
                    <article data-reveal className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                      <div className="aspect-[5/4] w-full overflow-hidden">
                        <img src={post.image_url || post.image_fallback || post.image} alt={post.title} loading="lazy" decoding="async" className="block h-full w-full object-cover" />
                      </div>
                      <div className="px-4 py-6">
                        <span className='block uppercase bg-[#F7DD00] w-max rounded-full py-0.5 px-2 font-bold text-[10px] text-primary mb-4'>{post.category}</span>
                        <p className="font-title text-base text-primary font-medium leading-tight mb-2 line-clamp-2 sm:text-xl">{post.title}</p>
                        <p className="text-sm text-muted line-clamp-2">{post.description}</p>
                      </div>
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <article data-reveal className="flex flex-col justify-center gap-5 rounded-xl bg-primary p-5 text-white shadow-sm lg:w-1/4 lg:shrink-0">
              <div className='space-y-3'>
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">{newsletter.eyebrow}</p>
                <p className="text-2xl font-bold font-title">{newsletter.title}</p>
                <p className="text-sm text-white/80">{newsletter.description}</p>
              </div>
              <div className='space-y-3'>
                <input
                  className="w-full rounded-full border border-white/20 bg-white/10 py-3 px-5 text-xs outline-none"
                  placeholder={newsletter.placeholder}
                  type="email"
                />
                <button type="button" className="w-full rounded-full bg-[#F7DD00] p-3 text-xs font-bold font-title text-primary">
                  {newsletter.buttonLabel}
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(<Base title="Inicio">
    <HomeScreen {...properties} />
  </Base>);
});
