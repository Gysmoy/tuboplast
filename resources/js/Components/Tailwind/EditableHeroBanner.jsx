const overlayClassName = 'absolute inset-0 bg-[linear-gradient(100deg,#f7fbff_0%,#f7fbff_34%,rgba(247,251,255,0.94)_42%,rgba(247,251,255,0.76)_50%,rgba(247,251,255,0.48)_58%,rgba(247,251,255,0.22)_66%,rgba(247,251,255,0)_78%)]';

const contentGlowClassName = 'absolute -left-28 -right-10 -top-16 -bottom-10 rounded-3xl bg-[#f7fbff]/90 blur-2xl';

const EditableHeroBanner = ({
  image,
  title,
  description,
  eyebrow,
  imageOnly = false,
  imageAlt = '',
  topSlot = null,
  children,
  className = '',
  contentClassName = '',
  imageClassName = '',
}) => {
  if (imageOnly) {
    return (
      <section className={`bg-silver/40 pt-3 pb-2 sm:pt-4 sm:pb-3 lg:pt-5 lg:pb-3 ${className}`}>
        <div className="mx-auto w-full max-w-site px-4">
          {topSlot && <div className="mb-3">{topSlot}</div>}
          <div className="relative overflow-hidden rounded-lg bg-primary shadow-sm ring-1 ring-black/5">
            <h1 className="sr-only">{title}</h1>
            <img src={image} alt={imageAlt || title} className="block h-auto w-full" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-white ${className}`}>
      <div className="w-full">
        <div className="relative min-h-[300px] overflow-hidden bg-white sm:min-h-[360px] lg:min-h-[390px]">
          <h1 className="sr-only">{title}</h1>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover object-center ${imageClassName}`}
          />
          <div className={overlayClassName} />
          <div className="editable-hero-inner relative mx-auto flex min-h-[300px] w-full max-w-site items-center px-4 py-12 sm:min-h-[360px] lg:min-h-[390px]">
            <div className={`relative max-w-[31rem] ${contentClassName}`}>
              <div className={contentGlowClassName} aria-hidden="true" />
              <div className="relative">
                {topSlot}
                {children || (
                  <>
                    {eyebrow && (
                      <p className="inline-flex rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-normal text-primary">
                        {eyebrow}
                      </p>
                    )}
                    <h2 className="mt-5 max-w-[28rem] font-title text-4xl font-medium leading-[1.05] text-primary sm:text-5xl">
                      {title}
                    </h2>
                    {description && (
                      <p className="mt-5 max-w-sm text-sm leading-relaxed text-darkmuted sm:text-base">
                        {description}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditableHeroBanner;
