import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ItemCard from './Components/Items/ItemCard';
import Base from './Components/Tailwind/Base';
import CreateReactScript from './Utils/CreateReactScript';

const productTemplates = [
  {
    categoryLabel: 'Tubería PVC-U',
    title: 'Tubería Agua SP Clase 15 NTP 399.002 3/4" x 5m',
    image: '/assets/img/items/item-2.png',
    price: 'S/ 28.30',
    pressure: '150 PSI',
    diameter: '33 mm',
  },
  {
    categoryLabel: 'Tubería PVC-U',
    title: 'Tubería Agua SP Clase 15 NTP 399.002 3/4" x 5m',
    image: '/assets/img/items/item-3.png',
    price: 'S/ 28.30',
    pressure: '150 PSI',
    diameter: '33 mm',
  },
  {
    categoryLabel: 'Tubería PVC-U',
    title: 'Tubería Agua SP Clase 15 NTP 399.002 3/4" x 5m',
    image: '/assets/img/items/item-1.png',
    price: 'S/ 28.30',
    pressure: '150 PSI',
    diameter: '33 mm',
  },
  {
    categoryLabel: 'Tubería PVC-U',
    title: 'Tubería Agua SP Clase 15 NTP 399.002 3/4" x 5m',
    image: '/assets/img/items/item-4.png',
    price: 'S/ 28.30',
    pressure: '150 PSI',
    diameter: '33 mm',
  },
];

const products = Array.from({ length: 12 }, (_, index) => ({
  ...productTemplates[index % productTemplates.length],
  id: index + 1,
}));

const materialOptions = [
  'PVC-U (Saneamiento)',
  '3/4" (26.5mm) CPVC (Agua Caliente)',
  'HDPE (Minería)',
];

const diameterOptions = [
  '1/2" (21mm)',
  '3/4" (26.5mm)',
  '1" (33mm)',
  '2" (60mm)',
  '4" (110mm)',
];

const pressureOptions = [
  'Clase 5 (75 PSI)',
  'Clase 7.5 (112 PSI)',
  'Clase 10 (150 PSI)',
  'Clase 15 (225 PSI)',
];

const FilterCheckbox = ({ checked, label, onChange }) => (
  <label className={`flex cursor-pointer items-center gap-3 text-sm ${checked ? 'font-bold text-primary' : 'text-darkmuted'}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded accent-[#004991]"
    />
    {label}
  </label>
);

const FilterGroup = ({ children, title }) => (
  <div>
    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{title}</p>
    <div className="space-y-3">{children}</div>
  </div>
);

const CatalogScreen = () => {
  const [selectedFilters, setSelectedFilters] = useState([
    'HDPE (Minería)',
    '1" (33mm)',
    'Clase 7.5 (112 PSI)',
  ]);
  const [application, setApplication] = useState('Edificación');
  const [sort, setSort] = useState('popular');

  const visibleProducts = useMemo(() => {
    if (sort === 'price-asc') {
      return [...products].sort((a, b) => Number(a.price.replace(/[^\d.]/g, '')) - Number(b.price.replace(/[^\d.]/g, '')));
    }
    if (sort === 'price-desc') {
      return [...products].sort((a, b) => Number(b.price.replace(/[^\d.]/g, '')) - Number(a.price.replace(/[^\d.]/g, '')));
    }
    return products;
  }, [sort]);

  const toggleFilter = (label) => {
    setSelectedFilters((current) => (
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    ));
  };

  return (
    <main className="space-y-16">
      <header className="mx-auto w-full max-w-site px-4 pt-16">
        <h1 className="font-title text-4xl font-medium text-primary">Soluciones para Conducción de Agua</h1>
        <span className="mt-4 block h-1 w-12 bg-secondary" />
      </header>

      <section
        className="mx-auto min-h-screen w-full max-w-site px-4 grid gap-16"
        style={{ gridTemplateColumns: '260px minmax(0, 1fr)' }}
      >
        <aside>
          <div className="sticky top-40">
            <p className="flex items-center gap-2 text-xl font-bold text-primary">
              <i className="mdi mdi-filter-variant text-2xl"></i>
              Filtrar Por
            </p>

            <div className="mt-8 space-y-8">
              <FilterGroup title="Material">
                {materialOptions.map((label) => (
                  <FilterCheckbox
                    key={label}
                    label={label}
                    checked={selectedFilters.includes(label)}
                    onChange={() => toggleFilter(label)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="Aplicación / Uso">
                <div className="flex flex-wrap gap-2">
                  {['Edificación', 'Minería', 'Infraestructura'].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setApplication(label)}
                      className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                        application === label
                          ? 'bg-primary text-white'
                          : 'bg-silver text-darkmuted hover:bg-slate-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="Diámetro nominal (pulg)">
                {diameterOptions.map((label) => (
                  <FilterCheckbox
                    key={label}
                    label={label}
                    checked={selectedFilters.includes(label)}
                    onChange={() => toggleFilter(label)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="Clase / Presión (PSI)">
                {pressureOptions.map((label) => (
                  <FilterCheckbox
                    key={label}
                    label={label}
                    checked={selectedFilters.includes(label)}
                    onChange={() => toggleFilter(label)}
                  />
                ))}
              </FilterGroup>

              <div className="rounded-lg bg-[#f0f0f0] p-4">
                <p className="text-sm font-bold text-primary">Asesoría Técnica</p>
                <p className="mt-3 text-xs leading-snug text-darkmuted">
                  ¿Necesita ayuda con los cálculos de presión para su proyecto?
                </p>
                <a href="/contact" className="mt-5 inline-flex items-center text-xs font-bold uppercase tracking-[0.08em] text-primary">
                  Contactar ingeniero
                  <i className="mdi mdi-arrow-right ml-1 text-sm"></i>
                </a>
              </div>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-8 flex items-center justify-between gap-5">
            <p className="text-sm text-darkmuted">
              Mostrando <b className="text-primary">{visibleProducts.length} de 48</b> productos
            </p>

            <label className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-[0.08em] text-muted">Ordenar por:</span>
              <span className="relative">
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="min-w-[190px] appearance-none border-b border-silver bg-white py-2 pl-3 pr-8 text-sm font-bold text-dark outline-none"
                >
                  <option value="popular">Más populares</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                </select>
                <i className="mdi mdi-chevron-down pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted"></i>
              </span>
            </label>
          </div>

          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            {visibleProducts.map((product) => (
              <ItemCard key={product.id} product={product} />
            ))}
          </div>

          <nav aria-label="Paginación del catálogo" className="mt-16 flex items-center justify-center gap-2">
            <button type="button" aria-label="Página anterior" className="grid h-10 w-10 place-items-center border-b-2 border-slate-300 text-dark">
              <i className="mdi mdi-chevron-left"></i>
            </button>
            <button type="button" className="grid h-10 w-10 place-items-center border-b-2 border-primary text-sm font-bold text-primary">1</button>
            <button type="button" className="grid h-10 w-10 place-items-center border-b-2 border-slate-300 text-sm text-muted">2</button>
            <button type="button" className="grid h-10 w-10 place-items-center border-b-2 border-slate-300 text-sm text-muted">3</button>
            <button type="button" aria-label="Página siguiente" className="grid h-10 w-10 place-items-center border-b-2 border-slate-300 text-dark">
              <i className="mdi mdi-chevron-right"></i>
            </button>
          </nav>
        </div>
      </section>

      <section className="relative w-full bg-primary text-white">
        <div className="mx-auto grid w-full max-w-site grid-cols-2 gap-16 py-16 px-4">
          <article className="text-center">
            <i className="mdi mdi-check-decagram-outline text-4xl text-secondary"></i>
            <h2 className="mt-6 text-xl font-bold">Alta Resistencia</h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/60">
              Materiales vírgenes que aseguran resistencia a
              <br />
              la corrosión y agentes químicos.
            </p>
          </article>

          <article className="text-center">
            <i className="mdi mdi-pipe text-4xl text-secondary"></i>
            <h2 className="mt-6 text-xl font-bold">Fácil Instalación</h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/60">
              Sistemas de unión flexible y cementado diseñados
              <br />
              para optimizar tiempos en obra.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
};

CreateReactScript((el) => {
  createRoot(el).render(
    <Base title="Catálogo">
      <CatalogScreen />
    </Base>,
  );
});
