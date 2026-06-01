import { useEffect } from 'react';

const ThankYouModal = ({ description, eyebrow, isOpen, onClose, title }) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="thank-you-title"
      className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/55 px-4 py-8 backdrop-blur-[2px]"
      onMouseDown={onClose}
    >
      <section
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white px-6 py-8 text-center shadow-2xl sm:px-10 sm:py-10"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-xl text-muted transition hover:bg-silver hover:text-primary"
        >
          <i className="mdi mdi-close"></i>
        </button>

        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-secondary text-4xl text-primary shadow-sm">
          <i className="mdi mdi-check-decagram"></i>
        </span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
        <h2 id="thank-you-title" className="mt-3 font-title text-3xl font-medium text-primary sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-darkmuted sm:text-base">
          {description}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-7 inline-flex items-center justify-center gap-3 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#003b7a]"
        >
          Entendido
          <i className="mdi mdi-arrow-right text-lg"></i>
        </button>
      </section>
    </div>
  );
};

export default ThankYouModal;
