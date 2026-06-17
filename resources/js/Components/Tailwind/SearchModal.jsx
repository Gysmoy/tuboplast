import { useEffect, useRef, useState } from 'react';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    setQuery('');
    setResults([]);
    setTouched(false);

    const focusTimer = setTimeout(() => inputRef.current?.focus(), 60);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const controller = new AbortController();
    const debounce = setTimeout(async () => {
      try {
        const response = await fetch(`/api/catalog/search?q=${encodeURIComponent(term)}`, {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        const data = await response.json();
        setResults(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        if (error.name !== 'AbortError') setResults([]);
      } finally {
        setTouched(true);
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [query, isOpen]);

  if (!isOpen) return null;

  const term = query.trim();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Buscador de productos"
      className="fixed inset-0 z-[95] flex items-start justify-center bg-slate-950/55 px-4 pt-20 backdrop-blur-[2px] sm:pt-28"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-fade-down animate-duration-200">
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 sm:px-5 sm:py-4">
          <i className="mdi mdi-magnify text-xl text-primary"></i>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busca un producto, categoría o SKU…"
            className="min-w-0 flex-1 bg-transparent text-base text-dark outline-none placeholder:text-muted"
          />
          {loading && <i className="mdi mdi-loading mdi-spin text-lg text-muted"></i>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar buscador"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-silver text-muted transition hover:text-primary"
          >
            <i className="mdi mdi-close"></i>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {term.length < 2 ? (
            <div className="px-5 py-10 text-center text-sm text-muted">
              <i className="mdi mdi-text-search mb-2 block text-3xl text-slate-300"></i>
              Escribe al menos 2 caracteres para buscar en el catálogo.
            </div>
          ) : results.length ? (
            <ul className="divide-y divide-slate-100">
              {results.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.detailUrl}
                    className="flex items-center gap-4 px-4 py-3 transition hover:bg-silver sm:px-5"
                  >
                    <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-silver">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-primary">{item.title}</span>
                      <span className="mt-0.5 block truncate text-xs text-muted">
                        {[item.categoryLabel, item.type].filter(Boolean).join(' · ')}
                      </span>
                    </span>
                    {item.price && <span className="shrink-0 text-sm font-bold text-darkmuted">{item.price}</span>}
                    <i className="mdi mdi-arrow-right shrink-0 text-muted"></i>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            touched && !loading && (
              <div className="px-5 py-10 text-center text-sm text-muted">
                <i className="mdi mdi-package-variant-closed-remove mb-2 block text-3xl text-slate-300"></i>
                No encontramos resultados para <b className="text-darkmuted">“{term}”</b>.
              </div>
            )
          )}
        </div>

        <a
          href="/catalog"
          className="flex items-center justify-center gap-2 border-t border-slate-200 bg-silver/60 px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-primary transition hover:bg-silver"
        >
          Ver todo el catálogo
          <i className="mdi mdi-arrow-right"></i>
        </a>
      </div>
    </div>
  );
};

export default SearchModal;
