import { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ItemCard from './Components/Items/ItemCard';
import Base from './Components/Tailwind/Base';
import CreateReactScript from './Utils/CreateReactScript';

const emptyFilters = { segment: [], line: [], classification: [], type: [] };

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

// Cuántos valores se muestran inline antes de ofrecer "Ver más".
const FACET_LIMIT = 6;

// Grupo de checkboxes con corte: muestra los primeros y abre un modal con
// buscador cuando hay demasiados valores.
const FacetCheckboxGroup = ({ title, groupKey, items, selected, onToggle, onSeeMore }) => {
  if (!items.length) return null;
  const shown = items.slice(0, FACET_LIMIT);
  const extra = items.length - shown.length;

  return (
    <FilterGroup title={title}>
      {shown.map((label) => (
        <FilterCheckbox key={label} label={label} checked={selected.includes(label)} onChange={() => onToggle(groupKey, label)} />
      ))}
      {extra > 0 && (
        <button
          type="button"
          onClick={() => onSeeMore({ key: groupKey, title })}
          className="flex items-center gap-1 text-xs font-bold text-primary transition hover:text-[#003b7a]"
        >
          <i className="mdi mdi-plus-circle-outline text-sm"></i>
          Ver más ({extra})
        </button>
      )}
    </FilterGroup>
  );
};

// Modal para seleccionar valores de un filtro con muchos valores + buscador.
const FilterModal = ({ group, items, selected, onToggle, onClose }) => {
  const [search, setSearch] = useState('');
  const term = search.trim().toLowerCase();
  const filtered = term ? items.filter((label) => label.toLowerCase().includes(term)) : items;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onMouseDown={onClose}>
      <div
        className="flex max-h-[85vh] w-full flex-col rounded-t-2xl bg-white shadow-2xl sm:max-w-md sm:rounded-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-silver px-5 py-4">
          <h3 className="text-base font-bold text-primary">{group.title}</h3>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-silver hover:text-primary">
            <i className="mdi mdi-close text-lg"></i>
          </button>
        </div>

        <div className="px-5 pt-4">
          <label className="relative block">
            <input
              type="text"
              value={search}
              autoFocus
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Buscar en ${group.title.toLowerCase()}…`}
              className="h-11 w-full rounded-xl border border-silver bg-white pl-10 pr-4 text-sm text-dark outline-none transition focus:border-primary"
            />
            <i className="mdi mdi-magnify pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-primary"></i>
          </label>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {filtered.length ? (
            filtered.map((label) => (
              <FilterCheckbox key={label} label={label} checked={selected.includes(label)} onChange={() => onToggle(group.key, label)} />
            ))
          ) : (
            <p className="py-6 text-center text-sm text-muted">Sin coincidencias para “{search}”.</p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-silver px-5 py-4">
          <span className="text-xs text-muted">{selected.length} seleccionados</span>
          <button type="button" onClick={onClose} className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#003b7a]">
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};

const sortOptions = [
  { label: 'Más populares', value: 'popular' },
  { label: 'Nombre: A → Z', value: 'name-asc' },
  { label: 'Nombre: Z → A', value: 'name-desc' },
];

const SortDropdown = ({ onChange, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = sortOptions.find((option) => option.value === value) ?? sortOptions[0];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full sm:w-auto">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 rounded-xl border border-silver bg-white px-4 py-3 text-sm font-bold text-primary shadow-sm transition hover:border-primary hover:shadow-md sm:min-w-[210px]"
      >
        {selectedOption.label}
        <i className={`mdi mdi-chevron-down text-base text-muted transition ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Ordenar productos"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 rounded-xl border border-silver bg-white p-2 shadow-xl sm:left-auto sm:w-64"
        >
          {sortOptions.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  isSelected ? 'bg-silver font-bold text-primary' : 'text-darkmuted hover:bg-silver'
                }`}
              >
                {option.label}
                {isSelected && <i className="mdi mdi-check-bold text-primary"></i>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Windowed page list (1 … 4 5 6 … 56) so it scales to thousands of pages.
const buildPages = (current, last) => {
  if (last <= 1) return [1];
  const pages = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(last - 1, current + 1);
  if (left > 2) pages.push('…');
  for (let page = left; page <= right; page += 1) pages.push(page);
  if (right < last - 1) pages.push('…');
  pages.push(last);
  return pages;
};

const CatalogScreen = ({ items: initialItems = [], facets = {}, pagination = null }) => {
  const [items, setItems] = useState(initialItems);
  const [meta, setMeta] = useState(pagination);
  const [filters, setFilters] = useState(emptyFilters);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sort, setSort] = useState('popular');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [modalGroup, setModalGroup] = useState(null);
  const firstRender = useRef(true);

  const facetGroups = {
    segment: facets.segment || [],
    line: facets.line || [],
    classification: facets.classification || [],
    type: facets.type || [],
  };

  const activeCount = Object.values(filters).reduce((total, list) => total + list.length, 0);
  const hasActive = activeCount > 0 || query.trim().length > 0;
  const totalPages = meta?.last_page || 1;
  const currentPage = meta?.current_page || page;
  const total = meta?.total ?? items.length;

  // Debounce the search box and reset to page 1.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch a page from the backend whenever filters/sort/page/query change.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);

    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    filters.segment.forEach((value) => params.append('segment[]', value));
    filters.line.forEach((value) => params.append('line[]', value));
    filters.classification.forEach((value) => params.append('classification[]', value));
    filters.type.forEach((value) => params.append('type[]', value));
    params.set('sort', sort);
    params.set('page', String(page));
    params.set('per_page', '12');

    fetch(`/api/catalog/items?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data) => {
        setItems(Array.isArray(data.data) ? data.data : []);
        setMeta(data.meta || null);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setItems([]);
          setMeta(null);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [filters, sort, page, debouncedQuery]);

  const toggleFilter = (group, value) => {
    setFilters((current) => {
      const list = current[group];
      const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
      return { ...current, [group]: next };
    });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    setQuery('');
    setDebouncedQuery('');
    setPage(1);
  };

  const goToPage = (next) => {
    const target = Math.min(Math.max(next, 1), totalPages);
    setPage(target);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const changeSort = (value) => {
    setSort(value);
    setPage(1);
  };

  const pages = useMemo(() => buildPages(currentPage, totalPages), [currentPage, totalPages]);

  return (
    <main className="space-y-10 sm:space-y-12 lg:space-y-16">
      <header className="mx-auto w-full max-w-site px-4 pt-10 sm:pt-12 lg:pt-16">
        <h1 className="font-title text-3xl font-medium leading-tight text-primary sm:text-4xl">Soluciones para Conducción de Agua</h1>
        <span className="mt-4 block h-1 w-12 bg-secondary" />
      </header>

      <section className="mx-auto grid min-h-screen w-full max-w-site gap-8 px-4 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12 xl:gap-16">
        <aside>
          <div className="lg:sticky lg:top-40">
            <button
              type="button"
              aria-controls="catalog-filters"
              aria-expanded={isFiltersOpen}
              onClick={() => setIsFiltersOpen((current) => !current)}
              className="flex w-full items-center justify-between rounded-xl border border-silver bg-white px-4 py-3 text-left text-primary shadow-sm transition hover:border-primary lg:pointer-events-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"
            >
              <span className="flex items-center gap-2 text-lg font-bold lg:text-xl">
                <i className="mdi mdi-filter-variant text-2xl"></i>
                Filtrar Por
              </span>
              <span className="flex items-center gap-2 text-xs font-bold lg:hidden">
                {activeCount} activos
                <i className={`mdi mdi-chevron-down text-lg transition ${isFiltersOpen ? 'rotate-180' : ''}`}></i>
              </span>
            </button>

            <div
              id="catalog-filters"
              className={`${isFiltersOpen ? 'block' : 'hidden'} mt-5 rounded-xl border border-silver bg-white p-5 shadow-sm lg:mt-8 lg:block lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
            >
              <div className="space-y-8">
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Buscar</p>
                  <label className="relative block">
                    <input
                      type="text"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Producto, categoría o SKU…"
                      className="h-11 w-full rounded-xl border border-silver bg-white pl-10 pr-9 text-sm text-dark outline-none transition focus:border-primary"
                    />
                    <i className="mdi mdi-magnify pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-primary"></i>
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        aria-label="Limpiar búsqueda"
                        className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:text-primary"
                      >
                        <i className="mdi mdi-close text-sm"></i>
                      </button>
                    )}
                  </label>
                </div>

                {hasActive && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-primary transition hover:text-[#003b7a]"
                  >
                    <i className="mdi mdi-close-circle-outline text-sm"></i>
                    Limpiar {activeCount > 0 ? `filtros (${activeCount})` : 'búsqueda'}
                  </button>
                )}

                <FacetCheckboxGroup title="Segmento" groupKey="segment" items={facetGroups.segment} selected={filters.segment} onToggle={toggleFilter} onSeeMore={setModalGroup} />

                <FacetCheckboxGroup title="Línea de producto" groupKey="line" items={facetGroups.line} selected={filters.line} onToggle={toggleFilter} onSeeMore={setModalGroup} />

                <FacetCheckboxGroup title="Clasificación" groupKey="classification" items={facetGroups.classification} selected={filters.classification} onToggle={toggleFilter} onSeeMore={setModalGroup} />

                {facetGroups.type.length > 0 && (
                  <FilterGroup title="Tipo de producto">
                    <div className="flex flex-wrap gap-2">
                      {facetGroups.type.map((label) => {
                        const active = filters.type.includes(label);
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => toggleFilter('type', label)}
                            className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                              active ? 'bg-primary text-white' : 'bg-silver text-darkmuted hover:bg-slate-200'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </FilterGroup>
                )}

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
          </div>
        </aside>

        <div>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
            <p className="flex items-center gap-2 text-sm text-darkmuted">
              {loading && <i className="mdi mdi-loading mdi-spin text-base text-primary"></i>}
              Mostrando <b className="text-primary">{items.length}</b> de <b className="text-primary">{total}</b> productos
            </p>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
              <span className="text-[10px] uppercase tracking-[0.08em] text-muted sm:text-xs">Ordenar por:</span>
              <SortDropdown value={sort} onChange={changeSort} />
            </div>
          </div>

          {items.length ? (
            <div className={`grid grid-cols-2 gap-4 transition-opacity sm:gap-5 lg:gap-6 xl:grid-cols-3 ${loading ? 'opacity-50' : ''}`}>
              {items.map((product) => (
                <ItemCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 px-6 py-20 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-silver text-primary">
                <i className="mdi mdi-filter-remove-outline text-3xl"></i>
              </span>
              <h2 className="mt-5 font-title text-xl font-bold text-primary">
                {hasActive ? 'No hay productos con esos filtros' : 'Aún no hay productos publicados'}
              </h2>
              <p className="mt-2 max-w-sm text-sm text-muted">
                {hasActive
                  ? 'Ajusta o limpia los filtros para ver más resultados.'
                  : 'Los productos que registres en el panel administrativo aparecerán aquí automáticamente.'}
              </p>
              {hasActive && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-[#003b7a]"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          )}

          {totalPages > 1 ? (
            <nav aria-label="Paginación del catálogo" className="mt-16 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                aria-label="Página anterior"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="grid h-10 w-10 place-items-center border-b-2 border-slate-300 text-dark transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                <i className="mdi mdi-chevron-left"></i>
              </button>

              {pages.map((item, index) => (
                item === '…' ? (
                  <span key={`gap-${index}`} className="grid h-10 w-10 place-items-center text-sm text-muted">…</span>
                ) : (
                  <button
                    key={`page-${item}`}
                    type="button"
                    onClick={() => goToPage(item)}
                    className={`grid h-10 w-10 place-items-center border-b-2 text-sm transition ${
                      currentPage === item ? 'border-primary font-bold text-primary' : 'border-slate-300 text-muted hover:text-primary'
                    }`}
                  >
                    {item}
                  </button>
                )
              ))}

              <button
                type="button"
                aria-label="Página siguiente"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="grid h-10 w-10 place-items-center border-b-2 border-slate-300 text-dark transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                <i className="mdi mdi-chevron-right"></i>
              </button>
            </nav>
          ) : null}
        </div>
      </section>

      <section className="relative w-full bg-primary text-white">
        <div className="mx-auto grid w-full max-w-site gap-10 px-4 py-12 sm:grid-cols-2 sm:gap-12 sm:py-16 lg:gap-16">
          <article className="text-center">
            <i className="mdi mdi-check-decagram-outline text-4xl text-secondary"></i>
            <h2 className="mt-6 text-xl font-bold">Alta Resistencia</h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/60">
              Materiales vírgenes que aseguran resistencia a
              <br className="hidden lg:block" />
              la corrosión y agentes químicos.
            </p>
          </article>

          <article className="text-center">
            <i className="mdi mdi-pipe text-4xl text-secondary"></i>
            <h2 className="mt-6 text-xl font-bold">Fácil Instalación</h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/60">
              Sistemas de unión flexible y cementado diseñados
              <br className="hidden lg:block" />
              para optimizar tiempos en obra.
            </p>
          </article>
        </div>
      </section>

      {modalGroup && (
        <FilterModal
          key={modalGroup.key}
          group={modalGroup}
          items={facetGroups[modalGroup.key] || []}
          selected={filters[modalGroup.key] || []}
          onToggle={toggleFilter}
          onClose={() => setModalGroup(null)}
        />
      )}
    </main>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Base title="Catálogo">
      <CatalogScreen
        items={properties.items || []}
        facets={properties.facets || {}}
        pagination={properties.pagination || null}
      />
    </Base>,
  );
});
