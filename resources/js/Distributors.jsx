import { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Base from './Components/Tailwind/Base';
import CreateReactScript from './Utils/CreateReactScript';
import Global from './Utils/Global';
import { loadGoogleMapsApi } from './Utils/googleMaps';

const DEFAULT_CENTER = { lat: -12.104889, lng: -77.036412 };

const toCoordinate = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeDistributor = (distributor) => ({
  id: distributor.id,
  name: distributor.name ?? `Distribuidor autorizado - ${distributor.district}`,
  department: distributor.department,
  province: distributor.province,
  district: distributor.district,
  address: distributor.address,
  phone: [distributor.phone_prefix, distributor.phone].filter(Boolean).join(' ') || 'Consultar disponibilidad',
  hours: distributor.hours ?? 'Atención previa coordinación',
  latitude: toCoordinate(distributor.latitude),
  longitude: toCoordinate(distributor.longitude),
  highlighted: Boolean(distributor.highlighted),
});

const directionsUrl = (distributor) => {
  const destination = distributor.latitude != null && distributor.longitude != null
    ? `${distributor.latitude},${distributor.longitude}`
    : distributor.address;

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
};

const Dropdown = ({
  compact = false,
  disabled = false,
  id,
  label,
  onChange,
  options,
  placeholder,
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectOption = (nextValue) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  const optionClassName = (isSelected) => (
    `flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
      isSelected
        ? 'bg-silver font-bold text-primary'
        : 'text-darkmuted hover:bg-silver hover:text-primary'
    }`
  );

  return (
    <div ref={dropdownRef} className="relative">
      {label && (
        <span className={`${compact ? 'sr-only' : 'text-[10px] font-bold uppercase tracking-[0.12em] text-primary'}`}>
          {label}
        </span>
      )}
      <button
        type="button"
        aria-controls={`${id}-options`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        className={`flex w-full items-center justify-between gap-3 border-b border-slate-300 bg-transparent text-left text-sm outline-none transition hover:border-primary ${
          compact ? 'py-2 text-muted' : 'mt-2 px-3 py-3 text-darkmuted'
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <span className="truncate">{selectedOption?.label ?? placeholder}</span>
        <i className={`mdi mdi-chevron-down shrink-0 text-base transition ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <div
          id={`${id}-options`}
          role="listbox"
          aria-label={label}
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-72 overflow-y-auto rounded-xl border border-silver bg-white p-2 shadow-xl"
        >
          <button
            type="button"
            role="option"
            aria-selected={!value}
            onClick={() => selectOption('')}
            className={optionClassName(!value)}
          >
            {placeholder}
            {!value && <i className="mdi mdi-check-bold text-primary"></i>}
          </button>
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => selectOption(option.value)}
                className={optionClassName(isSelected)}
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

const MapLegend = () => (
  <div className="absolute right-4 top-4 z-10 rounded-lg bg-white/95 p-4 text-[10px] text-darkmuted shadow-lg sm:right-6 sm:top-6 sm:min-w-40">
    <p className="mb-3 text-xs font-bold text-primary">Leyenda</p>
    <p className="flex items-center gap-2">
      <span className="h-3 w-3 rounded-full bg-secondary" />
      Distribuidor oro
    </p>
    <p className="mt-2 flex items-center gap-2">
      <span className="h-3 w-3 rounded-full bg-primary" />
      Punto de venta
    </p>
  </div>
);

const FallbackMap = ({ distributors, onSelect, selectedId }) => (
  <div className="absolute inset-0 overflow-hidden bg-[#dce2df]">
    <div className="absolute inset-y-0 left-0 w-[34%] bg-[#9bcbd4]" />
    <div className="absolute -left-12 top-[48%] h-20 w-[80%] rotate-[18deg] bg-white/70 shadow-sm" />
    <div className="absolute left-[20%] top-[26%] h-10 w-[95%] -rotate-[8deg] bg-white/65 shadow-sm" />
    <div className="absolute left-[42%] top-0 h-[120%] w-7 rotate-[14deg] bg-white/75 shadow-sm" />
    <div className="absolute left-[63%] top-0 h-[120%] w-5 -rotate-[12deg] bg-white/70 shadow-sm" />
    <div className="absolute left-[78%] top-0 h-[120%] w-4 rotate-[5deg] bg-white/65 shadow-sm" />
    <div className="absolute inset-0 opacity-45 [background-image:repeating-linear-gradient(0deg,transparent,transparent_31px,#94a3b8_32px,#94a3b8_33px),repeating-linear-gradient(90deg,transparent,transparent_46px,#94a3b8_47px,#94a3b8_48px)]" />
    <span className="absolute left-[46%] top-[36%] text-lg font-bold uppercase tracking-[0.12em] text-slate-500/80">Miraflores</span>
    <span className="absolute bottom-[12%] right-[18%] text-base font-bold uppercase tracking-[0.12em] text-slate-500/75">Barranco</span>
    <span className="absolute bottom-[28%] left-[8%] text-sm font-bold text-teal-700/75">Costa Verde</span>

    {distributors.map((distributor, index) => (
      <button
        key={distributor.id}
        type="button"
        aria-label={`Seleccionar ${distributor.name}`}
        onClick={() => onSelect(distributor.id)}
        style={{
          left: `${[56, 73, 84, 63][index % 4]}%`,
          top: `${[27, 51, 69, 75][index % 4]}%`,
        }}
        className={`absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white shadow-lg transition ${
          distributor.highlighted ? 'bg-secondary' : 'bg-primary'
        } ${selectedId === distributor.id ? 'scale-125' : ''}`}
      >
        <span className="h-2 w-2 rounded-full bg-white" />
      </button>
    ))}
  </div>
);

const DistributorMap = ({ distributors, onSelect, selectedId }) => {
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const mapsRef = useRef(null);
  const markersRef = useRef([]);
  const [mapStatus, setMapStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    if (!Global.GMAPS_API_KEY) {
      setMapStatus('fallback');
      return undefined;
    }

    loadGoogleMapsApi(Global.GMAPS_API_KEY)
      .then((maps) => {
        if (cancelled || !mapElementRef.current) return;

        mapsRef.current = maps;
        mapInstanceRef.current = new maps.Map(mapElementRef.current, {
          center: DEFAULT_CENTER,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        setMapStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setMapStatus('fallback');
      });

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      mapInstanceRef.current = null;
      mapsRef.current = null;
    };
  }, []);

  useEffect(() => {
    const maps = mapsRef.current;
    const map = mapInstanceRef.current;
    if (mapStatus !== 'ready' || !maps || !map) return;

    markersRef.current.forEach((marker) => {
      maps.event.clearInstanceListeners(marker);
      marker.setMap(null);
    });

    const bounds = new maps.LatLngBounds();
    markersRef.current = distributors
      .filter((distributor) => distributor.latitude != null && distributor.longitude != null)
      .map((distributor) => {
        const position = { lat: distributor.latitude, lng: distributor.longitude };
        const marker = new maps.Marker({
          map,
          position,
          title: distributor.name,
          icon: {
            path: maps.SymbolPath.CIRCLE,
            scale: distributor.id === selectedId ? 13 : 10,
            fillColor: distributor.highlighted ? '#F4E300' : '#004991',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 4,
          },
        });

        marker.addListener('click', () => onSelect(distributor.id));
        bounds.extend(position);
        return marker;
      });

    if (markersRef.current.length === 0) {
      map.setCenter(DEFAULT_CENTER);
      map.setZoom(12);
      return;
    }

    const selected = distributors.find((distributor) => (
      distributor.id === selectedId
      && distributor.latitude != null
      && distributor.longitude != null
    ));

    map.setCenter(selected
      ? { lat: selected.latitude, lng: selected.longitude }
      : bounds.getCenter());
    map.setZoom(markersRef.current.length === 1 ? 14 : 12);
  }, [distributors, mapStatus, onSelect, selectedId]);

  useEffect(() => {
    const selected = distributors.find((distributor) => distributor.id === selectedId);
    if (!selected || selected.latitude == null || selected.longitude == null) return;
    mapInstanceRef.current?.panTo({ lat: selected.latitude, lng: selected.longitude });
  }, [distributors, selectedId]);

  return (
    <div className="relative h-[360px] overflow-hidden rounded-2xl bg-silver shadow-sm sm:h-[480px] lg:h-[650px]">
      <FallbackMap distributors={distributors} onSelect={onSelect} selectedId={selectedId} />
      <div
        ref={mapElementRef}
        className={`absolute inset-0 transition-opacity duration-500 ${mapStatus === 'ready' ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <MapLegend />
      {mapStatus === 'loading' && (
        <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary shadow-sm">
          Cargando mapa
        </span>
      )}
    </div>
  );
};

const DistributorCard = ({ distributor, isSelected, onSelect }) => {
  const shareDistributor = async () => {
    const shareData = {
      title: distributor.name,
      text: distributor.address,
      url: directionsUrl(distributor),
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard?.writeText(shareData.url);
    } catch {
      // The user may cancel the native share dialog.
    }
  };

  return (
    <article
      className={`rounded-2xl border-l-4 p-4 shadow-sm transition sm:p-5 space-y-4 ${
        isSelected
          ? 'border-secondary bg-white shadow-md'
          : 'border-transparent bg-[#f7f7f7] hover:bg-white hover:shadow-md'
      }`}
    >
      <button type="button" onClick={() => onSelect(distributor.id)} className="w-full text-left space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            {distributor.highlighted && (
              <span className="mb-4 inline-block rounded-full bg-secondary px-3 py-1 text-[9px] font-bold uppercase text-primary">
                Destacado
              </span>
            )}
            <h3 className="font-title text-xl font-bold text-primary">{distributor.name}</h3>
          </div>
          {distributor.highlighted && <i className="mdi mdi-check-decagram-outline text-3xl text-primary"></i>}
        </div>

        <div className="space-y-2 text-sm text-darkmuted">
          <p className="flex gap-3">
            <i className="mdi mdi-map-marker-outline text-primary"></i>
            {distributor.address}
          </p>
          <p className="flex gap-3">
            <i className="mdi mdi-phone-outline text-primary"></i>
            {distributor.phone}
          </p>
          <p className="flex gap-3">
            <i className="mdi mdi-clock-outline text-primary"></i>
            {distributor.hours}
          </p>
        </div>
      </button>

      <div className="flex gap-3">
        <a
          href={directionsUrl(distributor)}
          target="_blank"
          rel="noreferrer"
          className={`flex flex-1 items-center justify-center gap-3 rounded-full px-5 py-3 text-sm font-bold transition ${
            isSelected ? 'bg-primary text-white hover:bg-[#003b7a]' : 'bg-slate-200 text-primary hover:bg-slate-300'
          }`}
        >
          Como llegar
          <i className="mdi mdi-arrow-right text-lg"></i>
        </a>
        <button
          type="button"
          onClick={shareDistributor}
          aria-label={`Compartir ubicación de ${distributor.name}`}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-xl text-primary transition hover:bg-silver"
        >
          <i className="mdi mdi-share-variant-outline"></i>
        </button>
      </div>
    </article>
  );
};

const DistributorsScreen = ({ distributors = [] }) => {
  const mapSectionRef = useRef(null);
  const normalizedDistributors = useMemo(() => {
    const seenLocations = new Set();

    return distributors
      .map(normalizeDistributor)
      .filter((distributor) => {
        const locationKey = distributor.latitude != null && distributor.longitude != null
          ? `${distributor.latitude.toFixed(5)}:${distributor.longitude.toFixed(5)}`
          : distributor.address.toLocaleLowerCase();

        if (seenLocations.has(locationKey)) return false;

        seenLocations.add(locationKey);
        return true;
      });
  }, [distributors]);
  const [department, setDepartment] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [sort, setSort] = useState('featured');
  const [selectedId, setSelectedId] = useState(normalizedDistributors[0]?.id ?? null);

  const sortEs = (a, b) => a.localeCompare(b, 'es');
  // Solo departamentos/provincias/distritos donde hay distribuidores.
  const departments = useMemo(
    () => [...new Set(normalizedDistributors.map((d) => d.department).filter(Boolean))].sort(sortEs),
    [normalizedDistributors],
  );
  const provinces = useMemo(
    () => [...new Set(normalizedDistributors.filter((d) => !department || d.department === department).map((d) => d.province).filter(Boolean))].sort(sortEs),
    [normalizedDistributors, department],
  );
  const districts = useMemo(
    () => [...new Set(normalizedDistributors.filter((d) => (!department || d.department === department) && (!province || d.province === province)).map((d) => d.district).filter(Boolean))].sort(sortEs),
    [normalizedDistributors, department, province],
  );
  const filteredDistributors = useMemo(() => {
    const filtered = normalizedDistributors.filter((distributor) => (
      (!department || distributor.department === department)
      && (!province || distributor.province === province)
      && (!district || distributor.district === district)
    ));

    return [...filtered].sort((a, b) => (
      sort === 'name'
        ? a.name.localeCompare(b.name)
        : Number(b.highlighted) - Number(a.highlighted)
    ));
  }, [department, district, normalizedDistributors, province, sort]);

  useEffect(() => {
    if (!filteredDistributors.some((distributor) => distributor.id === selectedId)) {
      setSelectedId(filteredDistributors[0]?.id ?? null);
    }
  }, [filteredDistributors, selectedId]);

  const selectDistributorFromCard = (id) => {
    setSelectedId(id);

    if (!window.matchMedia('(max-width: 767px)').matches) return;

    requestAnimationFrame(() => {
      mapSectionRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  };

  return (
    <main>
      <section className="overflow-hidden bg-primary">
        <h1 className="sr-only">Ubica a nuestros distribuidores a nivel nacional</h1>
        <img
          src="/assets/img/distributors/banner-distribuidores.png"
          alt="Ubica a nuestros distribuidores a nivel nacional"
          className="block h-auto w-full"
        />
      </section>

      <section className="mx-auto w-full max-w-site px-4 pb-12 pt-8 sm:pb-16 lg:pt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Filtra por ubicación</p>

          <div className="grid w-full gap-4 sm:max-w-2xl sm:grid-cols-3 lg:items-end">
            <Dropdown
              id="department-dropdown"
              label="Departamento"
              placeholder="Todos"
              value={department}
              options={departments.map((option) => ({ label: option, value: option }))}
              onChange={(nextValue) => {
                setDepartment(nextValue);
                setProvince('');
                setDistrict('');
              }}
            />

            <Dropdown
              disabled={!department}
              id="province-dropdown"
              label="Provincia"
              placeholder="Todas"
              value={province}
              options={provinces.map((option) => ({ label: option, value: option }))}
              onChange={(nextValue) => {
                setProvince(nextValue);
                setDistrict('');
              }}
            />

            <Dropdown
              disabled={!province}
              id="district-dropdown"
              label="Distrito"
              placeholder="Todos"
              value={district}
              options={districts.map((option) => ({ label: option, value: option }))}
              onChange={setDistrict}
            />
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,430px)_minmax(0,1fr)] lg:gap-8">
          <div className="order-2 lg:order-1">
            <div className="mb-5 flex items-end justify-between gap-4">
              <h2 className="font-title text-lg font-bold leading-tight text-primary sm:text-xl">
                {filteredDistributors.length} Distribuidores
                <br />
                encontrados
              </h2>
              <div className="w-36">
                <Dropdown
                  compact
                  id="sort-dropdown"
                  label="Ordenar distribuidores"
                  placeholder="Ordenar"
                  value={sort}
                  options={[
                    { label: 'Destacados', value: 'featured' },
                    { label: 'Por nombre', value: 'name' },
                  ]}
                  onChange={setSort}
                />
              </div>
            </div>

            <div className="space-y-4 lg:max-h-[650px] lg:overflow-y-auto lg:pr-3">
              {filteredDistributors.map((distributor) => (
                <DistributorCard
                  key={distributor.id}
                  distributor={distributor}
                  isSelected={distributor.id === selectedId}
                  onSelect={selectDistributorFromCard}
                />
              ))}
              {filteredDistributors.length === 0 && (
                <div className="rounded-2xl bg-silver p-8 text-center">
                  <i className="mdi mdi-map-search-outline text-4xl text-primary"></i>
                  <p className="mt-4 font-title text-xl font-bold text-primary">No encontramos distribuidores</p>
                  <p className="mt-2 text-sm text-muted">Prueba otra combinación de departamento y provincia.</p>
                </div>
              )}
            </div>
          </div>

          <div ref={mapSectionRef} className="order-1 scroll-mt-24 lg:order-2">
            <DistributorMap distributors={filteredDistributors} onSelect={setSelectedId} selectedId={selectedId} />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-site px-4 pb-12 sm:pb-16 lg:pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-secondary text-primary shadow-sm p-16">
          <div className="absolute -right-12 -top-20 h-72 w-72 rounded-full border-[40px] border-white/20" />
          <div className="absolute bottom-[-120px] right-[22%] h-56 w-56 rounded-full border-[34px] border-white/15" />
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="block h-1 w-16 bg-primary" />
              <p className="mt-4 text-sm uppercase">Exclusivo para maestros</p>
              <h2 className="mt-4 font-title text-3xl font-medium leading-tight sm:text-4xl">
                ¿Eres distribuidor y quieres ser parte de nuestra red?
              </h2>
              <p className="mt-3 text-xl font-regular">Únete a la red de soluciones en PVC líder en el mercado peruano.</p>
            </div>
            <a
              href="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-full bg-primary px-7 py-3.5 font-medium text-white shadow-md transition hover:bg-[#003b7a] lg:self-auto"
            >
              Solicitar información
              <i className="mdi mdi-arrow-right text-lg"></i>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Base title="Distribuidores">
      <DistributorsScreen distributors={properties.distributors} />
    </Base>,
  );
});
