import { useRef } from 'react';
import gsap from 'gsap';
import { addQuoteItem } from '../../Utils/quoteStorage';

const ItemCard = ({ product, showPrice = false }) => {
  const category = product.categoryLabel ?? product.category;
  const detailUrl = product.detailUrl ?? '/catalog';
  const cardImageRef = useRef(null);
  const cartButtonRef = useRef(null);

  const handleAddToQuote = (event) => {
    event.preventDefault();
    event.stopPropagation();
    addQuoteItem(product, 1);

    const sourceImage = cardImageRef.current;
    const targetButton = document.querySelector('[data-quote-button]');

    if (!sourceImage || !targetButton) {
      return;
    }

    const sourceRect = sourceImage.getBoundingClientRect();
    const targetRect = targetButton.getBoundingClientRect();
    const sourceCenterX = sourceRect.left + sourceRect.width / 2;
    const sourceCenterY = sourceRect.top + sourceRect.height / 2;
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    const flyingImage = sourceImage.cloneNode(true);
    Object.assign(flyingImage.style, {
      position: 'fixed',
      left: `${sourceRect.left}px`,
      top: `${sourceRect.top}px`,
      width: `${sourceRect.width}px`,
      height: `${sourceRect.height}px`,
      margin: '0',
      zIndex: '9999',
      pointerEvents: 'none',
      borderRadius: '0.75rem',
      objectFit: 'cover',
      boxShadow: '0 20px 50px rgba(4, 24, 48, 0.25)',
      transformOrigin: 'center center',
    });

    document.body.appendChild(flyingImage);

    const timeline = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        flyingImage.remove();
      },
    });

    timeline
      .set(flyingImage, { opacity: 1, scale: 1, rotate: 0 })
      .to(flyingImage, { duration: 0.12, scale: 1.04 })
      .to(
        flyingImage,
        {
          duration: 0.8,
          x: targetCenterX - sourceCenterX,
          y: targetCenterY - sourceCenterY,
          scale: 0.16,
          opacity: 0.25,
          rotate: 8,
          ease: 'power3.inOut',
        },
        '>-0.02',
      )
      .to(targetButton, { duration: 0.18, scale: 1.08, ease: 'back.out(3)' }, '-=0.25')
      .to(targetButton, { duration: 0.16, scale: 1, ease: 'power2.out' }, '>-0.03');

    if (cartButtonRef.current) {
      gsap.fromTo(
        cartButtonRef.current,
        { scale: 1 },
        { scale: 0.95, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.out' },
      );
    }
  };

  return (
    <article
      data-reveal
      className="relative flex h-full flex-col overflow-hidden rounded-xl bg-[#fafafa] shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <a
        href={detailUrl}
        aria-label={`Ver detalle de ${product.title}`}
        className="absolute inset-0 z-10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <span className="sr-only">Ver detalle de {product.title}</span>
      </a>

      <img ref={cardImageRef} src={product.image} alt={product.title} className="aspect-[5/4] w-full object-cover" />

      <div className="flex flex-1 flex-col p-5">
        <div>
          <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-muted">{category}</span>
          <p className="min-h-[52px] text-lg font-bold leading-tight text-primary">{product.title}</p>
        </div>

        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-end gap-3">
          <div className="rounded-lg bg-white/60 p-2">
            <span className="block text-[10px] uppercase text-muted">Uso</span>
            <p className="truncate text-xs font-bold text-primary">{product.use ?? product.pressure ?? '-'}</p>
          </div>
          <div className="rounded-lg bg-white/60 p-2">
            <span className="block text-[10px] uppercase text-muted">Diametro</span>
            <p className="text-xs font-bold text-primary">{product.diameter}</p>
          </div>
          <button
            ref={cartButtonRef}
            type="button"
            onClick={handleAddToQuote}
            aria-label={`Agregar ${product.title} a la cotizacion`}
            className="relative z-20 grid h-11 w-11 place-items-center self-stretch rounded-lg bg-primary text-white transition hover:bg-[#003b7a]"
          >
            <i className="mdi mdi-cart-plus text-xl"></i>
          </button>
        </div>

        {showPrice && (
          <div className="mt-auto pt-5">
            <p className="font-title text-2xl font-bold text-primary">{product.price}</p>
          </div>
        )}
      </div>
    </article>
  );
};

export default ItemCard;
