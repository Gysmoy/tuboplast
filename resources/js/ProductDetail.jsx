import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import ItemCard from './Components/Items/ItemCard';
import Base from './Components/Tailwind/Base';
import CreateReactScript from './Utils/CreateReactScript';

const formatPrice = (amount) => `S/ ${Number(amount).toFixed(2)}`;

const ProductGallery = ({ product }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
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
            onClick={() => setSelectedIndex(index)}
            className={`overflow-hidden rounded-lg border-2 bg-light transition ${
              selectedIndex === index
                ? 'border-secondary'
                : 'border-transparent hover:border-silver'
            }`}
          >
            <img
              src={image}
              alt=""
              className="aspect-[5/4] w-full object-cover"
            />
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
  <section className="mt-24">
    <div>
      <h2 className="font-title text-3xl font-medium text-primary">
        Especificaciones técnicas
      </h2>
      <span className="mt-4 block h-1 w-12 bg-secondary" />
    </div>

    <div className="mt-10 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {groups.map((group, index) => (
        <article
          key={group.title}
          className={`px-6 first:pl-0 ${
            index > 0 ? 'border-l border-slate-300' : ''
          }`}
        >
          <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-primary">
            {group.title}
          </h3>
          <dl className="mt-7 space-y-5">
            {group.items.map((item) => (
              <div key={item.label}>
                <dt className="text-[10px] uppercase text-muted">{item.label}</dt>
                <dd className="mt-1 text-sm font-medium text-primary">{item.value}</dd>
              </div>
            ))}
          </dl>

          {group.badges && (
            <div className="mt-5 flex gap-2">
              {group.badges.map((badge) => (
                <span
                  key={badge}
                  className="grid h-8 min-w-8 place-items-center border border-slate-300 bg-light px-2 text-[9px] font-bold text-primary"
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

const ProductDetailScreen = ({ product, relatedProducts }) => {
  const [quantity, setQuantity] = useState(2);

  return (
    <main>
      <section className="mx-auto w-full max-w-[1560px] px-4 pb-16 pt-8 lg:pb-20 lg:pt-10">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,732px)_minmax(0,658px)] lg:justify-between lg:gap-12">
          <ProductGallery product={product} />

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

            <div className="mt-8 flex items-end justify-between gap-6">
              <div>
                <span className="block text-[10px] uppercase tracking-[0.12em] text-muted">
                  Cantidad
                </span>
                <div className="mt-2 flex w-32 items-center justify-between border-b border-slate-300 pb-2 text-primary">
                  <button
                    type="button"
                    aria-label="Reducir cantidad"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    className="grid h-7 w-7 place-items-center text-xl transition hover:bg-silver"
                  >
                    -
                  </button>
                  <span className="text-base">{quantity}</span>
                  <button
                    type="button"
                    aria-label="Aumentar cantidad"
                    onClick={() => setQuantity((current) => current + 1)}
                    className="grid h-7 w-7 place-items-center text-xl transition hover:bg-silver"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted">
                  Precio Unitario {formatPrice(product.unitPrice)}
                </p>
                <p className="mt-1 font-title text-4xl font-medium text-primary lg:text-[52px]">
                  {formatPrice(product.unitPrice * quantity)}
                  <span className="ml-2 font-sans text-xs text-muted">Inc. IGV</span>
                </p>
              </div>
            </div>

            <div className="mt-9 space-y-3">
              <button
                type="button"
                className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#003b7a]"
              >
                Agregar a cotización
              </button>
              <button
                type="button"
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
                  <p className="text-sm font-bold text-primary">Garantía Tuboplast</p>
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

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct, index) => (
              <ItemCard
                key={`${relatedProduct.title}-${index}`}
                product={relatedProduct}
              />
            ))}
          </div>
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
