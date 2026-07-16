import { useEffect, useMemo, useRef, useState } from 'react';
import { downloadQuotePdf, submitQuote } from '../../Utils/quoteStorage';
import { fetchUbigeoRows, getDepartments, getDistricts, getProvinces } from '../../Utils/ubigeo';

const emptyForm = {
  name: '',
  business: '',
  ruc: '',
  email: '',
  phonePrefix: '+51',
  phone: '',
  department: '',
  province: '',
  district: '',
  ubigeo: '',
  observations: '',
  accepted: false,
};

const Field = ({ label, className = '', ...inputProps }) => (
  <label className={`block ${className}`}>
    <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
      {label}
    </span>
    <input
      {...inputProps}
      className="mt-2 w-full border-b border-slate-300 bg-transparent px-1 py-2 text-base text-dark outline-none transition placeholder:text-muted focus:border-primary"
    />
  </label>
);

const Dropdown = ({ className = '', disabled = false, label, onChange, options, placeholder, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const close = (event) => {
      if (event.key === 'Escape' || !dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);

    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-primary">{label}</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        className="mt-2 flex w-full items-center justify-between gap-2 border-b border-slate-300 bg-transparent px-1 py-2 text-left text-base outline-none transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={`min-w-0 flex-1 truncate ${value ? 'text-dark' : 'text-muted'}`}>{value || placeholder}</span>
        <i className={`mdi mdi-chevron-down shrink-0 text-lg text-primary transition ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
        >
          {options.length ? options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === value}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-silver ${
                option === value ? 'font-bold text-primary' : 'text-darkmuted'
              }`}
            >
              {option}
              {option === value && <i className="mdi mdi-check-bold text-primary"></i>}
            </button>
          )) : (
            <p className="px-4 py-2.5 text-sm text-muted">Sin opciones disponibles</p>
          )}
        </div>
      )}
    </div>
  );
};

const PhonePrefixDropdown = ({ prefixes, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);
  const selected = prefixes.find((item) => item.beautyCode === value);

  useEffect(() => {
    if (!isOpen) return undefined;

    const close = (event) => {
      if (event.key === 'Escape' || !dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);

    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [isOpen]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return prefixes;
    return prefixes.filter((item) => (
      item.country.toLowerCase().includes(term) || item.beautyCode.includes(term)
    ));
  }, [prefixes, search]);

  return (
    <div ref={dropdownRef} className="relative w-[120px] shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="mt-2 flex w-full items-center justify-between gap-2 border-b border-slate-300 bg-transparent px-1 py-2 text-left text-base text-dark outline-none transition hover:border-primary"
      >
        <span className="flex items-center gap-1.5">
          <span className="font-emoji text-lg leading-none">{selected?.flag ?? '🌐'}</span>
          <span className="font-medium">{value || '+51'}</span>
        </span>
        <i className={`mdi mdi-chevron-down text-base text-primary transition ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      {isOpen && (
        <div className="absolute left-0 z-30 mt-2 w-72 rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 p-2">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar país o código"
              className="w-full rounded-lg bg-silver px-3 py-2 text-sm text-dark outline-none placeholder:text-muted"
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length ? filtered.map((item) => (
              <button
                key={`${item.isoCode?.ISO2}-${item.beautyCode}`}
                type="button"
                onClick={() => {
                  onChange(item.beautyCode);
                  setSearch('');
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-silver ${
                  item.beautyCode === value ? 'font-bold text-primary' : 'text-darkmuted'
                }`}
              >
                <span className="font-emoji text-lg leading-none">{item.flag}</span>
                <span className="flex-1 truncate">{item.country}</span>
                <span className="text-muted">{item.beautyCode}</span>
              </button>
            )) : (
              <p className="px-3 py-2.5 text-sm text-muted">Sin resultados</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const QuoteRequestModal = ({ isOpen, items = [], onClose, onSuccess }) => {
  const [form, setForm] = useState(emptyForm);
  const [feedback, setFeedback] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [ubigeoRows, setUbigeoRows] = useState([]);
  const [prefixes, setPrefixes] = useState([]);

  const departments = useMemo(() => getDepartments(ubigeoRows), [ubigeoRows]);
  const provinces = useMemo(() => getProvinces(ubigeoRows, form.department), [ubigeoRows, form.department]);
  const districts = useMemo(() => getDistricts(ubigeoRows, form.department, form.province), [ubigeoRows, form.department, form.province]);

  useEffect(() => {
    if (!isOpen) return undefined;

    setFeedback('');
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    if (!ubigeoRows.length) {
      fetchUbigeoRows()
        .then(setUbigeoRows)
        .catch(() => setFeedback('No pudimos cargar las ubicaciones. Inténtalo nuevamente.'));
    }

    if (!prefixes.length) {
      fetch('/phone_prefixes.json', { headers: { Accept: 'application/json' } })
        .then((response) => response.json())
        .then((data) => setPrefixes(Array.isArray(data) ? data : []))
        .catch(() => {});
    }
  }, [isOpen, ubigeoRows.length, prefixes.length]);

  if (!isOpen) return null;

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateRuc = (event) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 11);
    setForm((current) => ({ ...current, ruc: value }));
  };

  const updatePhone = (event) => {
    const value = event.target.value.replace(/[^\d\s]/g, '').slice(0, 15);
    setForm((current) => ({ ...current, phone: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (isSending) return;

    if (!items.length) {
      setFeedback('Agrega al menos un producto a tu cotización.');
      return;
    }
    if (form.ruc && form.ruc.length !== 11) {
      setFeedback('El RUC debe tener 11 dígitos.');
      return;
    }
    if (!form.ubigeo) {
      setFeedback('Selecciona departamento, provincia y distrito.');
      return;
    }
    if (!form.accepted) {
      setFeedback('Debes aceptar los términos y condiciones para continuar.');
      return;
    }

    setFeedback('');
    setIsSending(true);

    try {
      const saved = await submitQuote(form, items);
      await downloadQuotePdf(form, items, {
        code: saved?.code,
        date: saved?.created_at,
      });

      setForm(emptyForm);
      onSuccess?.(saved);
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-request-title"
      className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/55 backdrop-blur-[2px] sm:items-center sm:px-4 sm:py-8"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <section className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-y-auto rounded-t-3xl bg-light shadow-2xl animate-fade-up animate-duration-300 sm:max-h-[90vh] sm:rounded-3xl">
        <div className="sticky top-0 z-20 flex justify-center bg-light pt-3 sm:hidden">
          <span className="h-1.5 w-12 rounded-full bg-slate-300" />
        </div>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute right-4 top-4 z-30 grid h-10 w-10 place-items-center rounded-full bg-white text-xl text-muted shadow-sm transition hover:text-primary"
        >
          <i className="mdi mdi-close"></i>
        </button>

        <form onSubmit={submit} className="px-6 pb-8 pt-6 sm:px-9 sm:py-10">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-2xl text-white">
              <i className="mdi mdi-card-account-details-outline"></i>
            </span>
            <h2 id="quote-request-title" className="font-title text-2xl font-bold text-primary sm:text-3xl">
              Datos de la Empresa / Cliente
            </h2>
          </div>

          <div className="mt-8 grid gap-x-6 gap-y-6 sm:grid-cols-2">
            <Field
              label="Nombre completo"
              name="name"
              placeholder="Ej. Juan Pérez"
              value={form.name}
              onChange={updateField}
              required
              className="sm:col-span-2"
            />
            <Field
              label="Razón social / Empresa"
              name="business"
              placeholder="Ej. Constructora Lima S.A.C"
              value={form.business}
              onChange={updateField}
              className="sm:col-span-2"
            />
            <Field
              label="RUC"
              name="ruc"
              inputMode="numeric"
              placeholder="11 dígitos"
              value={form.ruc}
              onChange={updateRuc}
            />
            <Field
              label="Correo electrónico"
              name="email"
              type="email"
              placeholder="usuario@empresa.com"
              value={form.email}
              onChange={updateField}
              required
            />

            <div className="sm:col-span-2">
              <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                Teléfono / WhatsApp
              </span>
              <div className="flex items-end gap-3">
                <PhonePrefixDropdown
                  prefixes={prefixes}
                  value={form.phonePrefix}
                  onChange={(phonePrefix) => setForm((current) => ({ ...current, phonePrefix }))}
                />
                <input
                  name="phone"
                  inputMode="numeric"
                  placeholder="900 000 000"
                  value={form.phone}
                  onChange={updatePhone}
                  className="mt-2 w-full flex-1 border-b border-slate-300 bg-transparent px-1 py-2 text-base text-dark outline-none transition placeholder:text-muted focus:border-primary"
                />
              </div>
            </div>

            <Dropdown
              label="Departamento"
              placeholder="Selecciona un departamento"
              value={form.department}
              options={departments}
              onChange={(department) => setForm((current) => ({
                ...current,
                department,
                province: '',
                district: '',
                ubigeo: '',
              }))}
            />
            <Dropdown
              label="Provincia"
              placeholder="Selecciona una provincia"
              disabled={!form.department}
              value={form.province}
              options={provinces}
              onChange={(province) => setForm((current) => ({
                ...current,
                province,
                district: '',
                ubigeo: '',
              }))}
            />
            <Dropdown
              label="Distrito"
              placeholder="Selecciona un distrito"
              disabled={!form.province}
              value={form.district}
              options={districts.map((item) => item.district)}
              onChange={(district) => {
                const selected = districts.find((item) => item.district === district);
                setForm((current) => ({
                  ...current,
                  district,
                  ubigeo: selected?.ubigeo || '',
                }));
              }}
              className="sm:col-span-2"
            />

            <label className="block sm:col-span-2">
              <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                Observaciones
              </span>
              <textarea
                name="observations"
                rows={3}
                placeholder="Cantidades por medida, plazos, datos de entrega u otra referencia para tu cotización."
                value={form.observations}
                onChange={updateField}
                maxLength={2000}
                className="mt-2 w-full resize-y border-b border-slate-300 bg-transparent px-1 py-2 text-base text-dark outline-none transition placeholder:text-muted focus:border-primary"
              />
            </label>
          </div>

          <label className="mt-7 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-darkmuted">
            <input
              type="checkbox"
              checked={form.accepted}
              onChange={(event) => setForm((current) => ({ ...current, accepted: event.target.checked }))}
              className="mt-0.5 h-5 w-5 shrink-0 rounded accent-[#004991]"
            />
            <span>
              Acepto los <a href="/privacy-policy" target="_blank" rel="noreferrer" className="font-medium text-primary underline">términos y condiciones</a> de TUBOPLAST S.A. y el tratamiento de mis datos personales para la gestión de esta cotización.
            </span>
          </label>

          {feedback && (
            <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {feedback}
            </p>
          )}

          <button
            type="submit"
            disabled={isSending}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#003b7a] disabled:cursor-wait disabled:opacity-60"
          >
            <i className="mdi mdi-file-pdf-box text-lg"></i>
            {isSending ? 'Generando...' : 'Descargar Cotización en PDF'}
          </button>

          <p className="mt-6 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
            La validez de este documento es de 15 días calendario
          </p>
        </form>
      </section>
    </div>
  );
};

export default QuoteRequestModal;
