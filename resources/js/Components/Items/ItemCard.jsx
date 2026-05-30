const ItemCard = ({ product }) => {
  const category = product.categoryLabel ?? product.category;

  return (
    <article
      data-reveal
      className="flex h-full flex-col overflow-hidden rounded-xl bg-[#fafafa] shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <img src={product.image} alt={product.title} className="aspect-[5/4] w-full object-cover" />
      <div className="flex flex-1 flex-col p-5">
        <div>
          <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-muted">{category}</span>
          <p className="min-h-[52px] text-lg font-bold leading-tight text-primary">{product.title}</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-white/60 p-2">
            <span className="block text-[10px] uppercase text-muted">Presión</span>
            <p className="text-xs font-bold text-primary">{product.pressure}</p>
          </div>
          <div className="rounded-lg bg-white/60 p-2">
            <span className="block text-[10px] uppercase text-muted">Diámetro</span>
            <p className="text-xs font-bold text-primary">{product.diameter}</p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-silver pt-5">
          <p className="font-title text-2xl font-bold text-primary">{product.price}</p>
          <button
            type="button"
            aria-label={`Agregar ${product.title} a la cotización`}
            className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-white transition hover:bg-[#003b7a]"
          >
            <i className="mdi mdi-cart-plus text-xl"></i>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ItemCard;
