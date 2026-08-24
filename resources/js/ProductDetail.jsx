import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import ItemCard from './Components/Items/ItemCard';
import Base from './Components/Tailwind/Base';
import CreateReactScript from './Utils/CreateReactScript';
import { addQuoteItem, downloadTechnicalSheet } from './Utils/quoteStorage';

gsap.registerPlugin(useGSAP);

// Carrusel: 2 visibles, avanza de uno, autoplay + drag con mouse.
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
// funcione aunque vengan pocos productos (4 -> 8).
const loopSafe = (arr, min) => {
  if (!arr.length || arr.length >= min) return arr;
  const times = Math.ceil(min / arr.length);
  return Array.from({ length: times }, () => arr).flat();
};

const ProductGallery = ({ product, selectedIndex, onSelectImage }) => {
  const selectedImage = product.gallery[selectedIndex] ?? product.image;

  return (
    <div>
      <div className="overflow-hidden rounded-xl bg-light">
        <img
          src={selectedImage}
          alt={product.title}
          className="aspect-square w-full object-cover"
        />
      </div>

      <div className="mt-5 grid grid-cols-5 gap-3">
        {product.gallery.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            aria-label={`Ver imagen ${index + 1} de ${product.title}`}
            onClick={() => onSelectImage(index)}
            className={`overflow-hidden rounded-lg border-2 bg-light transition ${
              selectedIndex === index
                ? 'border-secondary'
                : 'border-transparent hover:border-silver'
            }`}
          >
            <img src={image} alt="" className="aspect-[5/4] w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

const SummaryGrid = ({ items }) => (
  <div className="grid grid-cols-2 border border-slate-300">
    {items.map((item, index) => (
      <div
        key={item.label}
        className={`px-5 py-5 ${
          index % 2 === 0 ? 'border-r border-slate-300' : ''
        } ${index < 2 ? 'border-b border-slate-300' : ''}`}
      >
        <span className="block text-[10px] uppercase tracking-[0.12em] text-muted">
          {item.label}
        </span>
        <p className="mt-2 text-sm font-bold text-primary">{item.value}</p>
      </div>
    ))}
  </div>
);

const TechnicalSpecifications = ({ groups }) => (
  <section className="mt-20 sm:mt-24">
    <div>
      <h2 className="font-title text-3xl font-medium text-primary">
        Especificaciones técnicas
      </h2>
      <span className="mt-4 block h-1 w-12 bg-secondary" />
    </div>

    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <article
          key={group.title}
          className="rounded-xl border border-slate-200 bg-light p-5 sm:p-6"
        >
          <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-primary">
            {group.title}
          </h3>

          {group.items?.length > 0 && (
            <dl className="mt-4 divide-y divide-slate-200">
              {group.items.map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4 py-2.5">
                  <dt className="text-xs text-muted">{item.label}</dt>
                  <dd className="text-right text-sm font-semibold text-primary">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {group.badges && (
            <div className="mt-4 flex flex-wrap gap-2">
              {group.badges.map((badge) => (
                <span
                  key={badge}
                  className="grid h-8 min-w-8 place-items-center rounded-md border border-slate-300 bg-white px-2 text-[10px] font-bold text-primary"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  </section>
);

const ProductNotices = ({ notices }) => {
  if (!Array.isArray(notices) || !notices.length) {
    return null;
  }

  return (
    <section className="mt-24">
      <div>
        <h2 className="font-title text-3xl font-medium text-primary">
          Avisos y recomendaciones de uso
        </h2>
        <span className="mt-4 block h-1 w-12 bg-secondary" />
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {notices.map((notice) => (
          <article
            key={notice.label}
            className="rounded-xl border border-slate-200 bg-light p-5"
          >
            <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-primary">
              {notice.label}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-darkmuted">
              {notice.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

const ProductDetailScreen = ({ product, relatedProducts }) => {
  const pageRef = useRef(null);
  const addButtonRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quantity, setQuantity] = useState(2);
  const { contextSafe } = useGSAP(() => {}, { scope: pageRef });

  const triggerAddAnimation = contextSafe(() => {
    const sourceButton = addButtonRef.current;
    const quoteButton = document.querySelector('[data-quote-button]');
    const quoteBadge = document.querySelector('[data-quote-badge]');
    const selectedImage = product.gallery[selectedIndex] ?? product.image;

    if (!sourceButton || !quoteButton) {
      return;
    }

    const sourceRect = sourceButton.getBoundingClientRect();
    const targetRect = quoteButton.getBoundingClientRect();
    const flyingImage = document.createElement('img');
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    const sourceCenterX = sourceRect.left + sourceRect.width / 2;
    const sourceCenterY = sourceRect.top + sourceRect.height / 2;

    flyingImage.src = selectedImage;
    flyingImage.alt = product.title;

    Object.assign(flyingImage.style, {
      position: 'fixed',
      left: `${sourceRect.left + sourceRect.width / 2 - 34}px`,
      top: `${sourceRect.top + sourceRect.height / 2 - 34}px`,
      width: '68px',
      height: '68px',
      margin: '0',
      zIndex: '9999',
      pointerEvents: 'none',
      borderRadius: '1rem',
      boxShadow: '0 25px 60px rgba(4, 24, 48, 0.25)',
      transformOrigin: 'center center',
      objectFit: 'cover',
    });

    document.body.appendChild(flyingImage);

    const timeline = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        flyingImage.remove();
      },
    });

    timeline
      .set(flyingImage, { opacity: 1, scale: 0.85, rotate: 0 })
      .to(flyingImage, { duration: 0.12, scale: 1 })
      .to(
        flyingImage,
        {
          duration: 0.8,
          x: targetCenterX - sourceCenterX,
          y: targetCenterY - sourceCenterY,
          scale: 0.2,
          opacity: 0.35,
          rotate: 10,
          ease: 'power3.inOut',
        },
        '>-0.02',
      )
      .to(quoteButton, { duration: 0.18, scale: 1.08, ease: 'back.out(3)' }, '-=0.25')
      .to(quoteButton, { duration: 0.16, scale: 1, ease: 'power2.out' }, '>-0.03')
      .to(sourceButton, { duration: 0.12, scale: 0.98, ease: 'power2.out' }, '-=0.4')
      .to(sourceButton, { duration: 0.15, scale: 1, ease: 'power2.out' }, '>-0.02');

    if (quoteBadge) {
      gsap.fromTo(
        quoteBadge,
        { scale: 1 },
        { scale: 1.2, duration: 0.14, yoyo: true, repeat: 1, ease: 'power1.out' },
      );
    }
  });

  const handleAddToQuote = () => {
    addQuoteItem(product, quantity);
    triggerAddAnimation();
  };

  const handleDownloadSheet = () => {
    if (product.technicalSheetUrl) {
      window.open(product.technicalSheetUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    downloadTechnicalSheet(product, quantity);
  };

  return (
    <main ref={pageRef}>
      <section className="mx-auto w-full max-w-site px-4 pb-16 pt-8 lg:pb-20 lg:pt-10">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,732px)_minmax(0,658px)] lg:justify-between lg:gap-12">
          <ProductGallery
            product={product}
            selectedIndex={selectedIndex}
            onSelectImage={setSelectedIndex}
          />

          <article>
            <span className="inline-block rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
              {product.sku}
            </span>
            <h1 className="mt-4 font-title text-5xl font-medium leading-[1.08] text-primary">
              {product.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-darkmuted">
              {product.description}
            </p>

            <div className="my-7 flex flex-wrap gap-x-8 gap-y-3 border-y border-slate-200 py-4 text-xs text-muted">
              <p className="flex items-center gap-2">
                <i className="mdi mdi-check-decagram-outline text-base"></i>
                {product.standard}
              </p>
              <p className="flex items-center gap-2">
                <i className="mdi mdi-truck-delivery-outline text-base"></i>
                {product.stockLabel}
              </p>
            </div>

            <SummaryGrid items={product.summary} />

            <div className="mt-8">
              <span className="block text-[10px] uppercase tracking-[0.12em] text-muted">
                Cantidad
              </span>
              <div className="mt-2 flex w-40 items-center justify-between border-b border-slate-300 pb-2 text-primary">
                <button
                  type="button"
                  aria-label="Reducir cantidad"
                  onClick={() => setQuantity((current) => Math.max(1, (Number(current) || 1) - 1))}
                  className="grid h-7 w-7 place-items-center text-xl transition hover:bg-silver"
                >
                  -
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  aria-label="Cantidad"
                  value={quantity}
                  onChange={(event) => {
                    const digits = event.target.value.replace(/\D/g, '');
                    setQuantity(digits === '' ? '' : Number(digits));
                  }}
                  onBlur={() => setQuantity((current) => Math.max(1, Number(current) || 1))}
                  className="w-16 bg-transparent text-center text-base outline-none"
                />
                <button
                  type="button"
                  aria-label="Aumentar cantidad"
                  onClick={() => setQuantity((current) => (Number(current) || 1) + 1)}
                  className="grid h-7 w-7 place-items-center text-xl transition hover:bg-silver"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-9 space-y-3">
              <button
                ref={addButtonRef}
                type="button"
                onClick={handleAddToQuote}
                className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#003b7a]"
              >
                Agregar a cotización
              </button>
              <button
                type="button"
                onClick={handleDownloadSheet}
                className="w-full rounded-full border border-slate-300 px-6 py-3.5 text-sm font-bold text-primary transition hover:bg-silver"
              >
                Descargar ficha técnica
              </button>
            </div>

            <div className="mt-16 flex gap-4 rounded-xl bg-[#f4f4f4] p-5">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                <i className="mdi mdi-check-decagram-outline text-xl"></i>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm font-bold text-primary">Garantia Tuboplast</p>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-bold uppercase text-primary">
                    Premium
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-darkmuted">
                  Respaldo directo de fábrica por 50 años contra defectos de fabricación
                  en condiciones normales de uso.
                </p>
              </div>
            </div>
          </article>
        </div>

        <TechnicalSpecifications groups={product.technicalSpecifications} />

        <ProductNotices notices={product.notices} />

        <section className="mt-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-title text-3xl font-medium text-primary">
                Otros productos
              </h2>
              <span className="mt-4 block h-1 w-12 bg-secondary" />
            </div>
            <a href="/catalog" className="text-sm font-bold text-primary">
              Ver todo
              <i className="mdi mdi-arrow-right ml-2 align-middle text-sm"></i>
            </a>
          </div>

          {relatedProducts.length > 0 && (
            <Swiper {...carouselProps(4)} className="!pb-1">
              {loopSafe(relatedProducts, 8).map((relatedProduct, index) => (
                <SwiperSlide key={`${relatedProduct.title}-${index}`} className="!h-auto">
                  <ItemCard product={relatedProduct} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </section>
      </section>
    </main>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Base title="Detalle de producto">
      <ProductDetailScreen
        product={properties.product}
        relatedProducts={properties.relatedProducts}
      />
    </Base>,
  );
});

