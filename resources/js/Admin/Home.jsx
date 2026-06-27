import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'

const EMPTY_DASHBOARD = {
  month_label: '',
  kpis: [],
  metrics: [],
  funnel: [],
  funnel_max: 1,
  chart: { labels: [], qty: [], amount: [] },
  latest_quotes: [],
}

// Capa de marca (formato de la referencia weFem) con colores Tuboplast.
const BRAND_CSS = `
.wfd-wrap{color:#1f2a44;}
.wfd-card{background:#fff;border:1px solid #e7edf5;border-radius:16px;box-shadow:0 1px 2px rgba(15,37,64,.04),0 6px 16px rgba(0,73,145,.06);padding:16px;height:100%;}
@media(min-width:992px){.wfd-card{padding:20px;}}
.wfd-iconbox{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#0a5aa8,#004991);color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 10px rgba(0,73,145,.25);flex-shrink:0;}
.wfd-iconbox.sm{width:34px;height:34px;border-radius:10px;font-size:15px;}
.wfd-iconbox.amber{background:linear-gradient(135deg,#f7c400,#e0a800);color:#003b7a;box-shadow:0 4px 10px rgba(224,168,0,.25);}
.wfd-h2{font-size:18px;font-weight:700;line-height:1.25;margin:0;color:#0f2540;}
@media(min-width:992px){.wfd-h2{font-size:20px;}}
.wfd-sub{font-size:12px;color:#8a93a6;margin:0;}
.wfd-sub b{color:#004991;}
.wfd-kpi-label{font-size:12.5px;color:#8a93a6;margin:0;}
.wfd-kpi-val{font-size:26px;font-weight:800;color:#0f2540;line-height:1.05;margin:6px 0;}
.wfd-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:50rem;font-size:11px;font-weight:600;white-space:nowrap;}
.wfd-badge.up{background:#e1f5ee;color:#0f6e56;}
.wfd-badge.down{background:#fcebeb;color:#e24b4a;}
.wfd-badge.brand{background:#e6effa;color:#004991;}
.wfd-metric{border:1px solid #eef2f8;border-radius:12px;padding:10px 12px;}
.wfd-metric small{font-size:11.5px;color:#8a93a6;display:block;}
.wfd-metric strong{font-size:17px;color:#0f2540;}
.wfd-prog{height:8px;border-radius:50rem;background:#eef2f8;overflow:hidden;margin-top:12px;}
.wfd-prog>span{display:block;height:100%;border-radius:50rem;}
.wfd-stage{border:1px solid #eef2f8;border-radius:12px;padding:14px;height:100%;}
.wfd-tablewrap{border:1px solid #eef2f8;border-radius:12px;overflow-x:auto;}
.wfd-tablewrap::-webkit-scrollbar{height:8px;}
.wfd-tablewrap::-webkit-scrollbar-thumb{background:#cfdcec;border-radius:9px;}
.wfd-table{width:100%;border-collapse:collapse;font-size:13px;min-width:760px;margin:0;}
.wfd-table thead th{background:#f5f8fc;color:#8a93a6;font-size:11px;text-transform:uppercase;letter-spacing:.025em;font-weight:600;padding:12px;white-space:nowrap;}
.wfd-table tbody td{padding:12px;border-top:1px solid #eef2f8;vertical-align:middle;}
.wfd-table tbody tr:hover{background:#f9fbfe;}
.wfd-st{display:inline-flex;align-items:center;padding:4px 10px;border-radius:50rem;font-size:11px;font-weight:600;white-space:nowrap;}
.wfd-st.pendiente{background:#faeeda;color:#854f0b;}
.wfd-st.contactado{background:#e8f0ff;color:#185fa5;}
.wfd-st.convertido{background:#e1f5ee;color:#0f6e56;}
.wfd-st.archivado{background:#f1efe8;color:#5f5e5a;}
.wfd-ddwrap{position:relative;}
.wfd-dd{height:38px;border:1px solid #dce5f0;border-radius:10px;background:#f5f8fc;font-size:13px;font-weight:600;color:#0f2540;padding:0 12px;display:inline-flex;align-items:center;justify-content:space-between;gap:10px;cursor:pointer;width:100%;}
.wfd-dd:hover{border-color:#004991;}
.wfd-dd .chev{color:#8a93a6;font-size:14px;transition:transform .2s;}
.wfd-ddwrap.open .wfd-dd .chev{transform:rotate(180deg);}
.wfd-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:40;min-width:100%;max-height:260px;overflow-y:auto;background:#fff;border:1px solid #e7edf5;border-radius:12px;box-shadow:0 12px 30px rgba(15,37,64,.12);padding:6px;}
.wfd-opt{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 10px;border-radius:8px;font-size:13px;color:#1f2a44;cursor:pointer;border:0;background:none;width:100%;text-align:left;}
.wfd-opt:hover{background:#f4f8fd;}
.wfd-opt.sel{background:#e6effa;color:#004991;font-weight:700;}
.wfd-wrap .spin{display:inline-block;animation:wfd-spin 1s linear infinite;}
@keyframes wfd-spin{to{transform:rotate(360deg);}}
.wfd-monthpick{padding:10px;min-width:248px;}
.wfd-mp-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.wfd-mp-year{font-weight:700;color:#0f2540;font-size:14px;}
.wfd-mp-nav{width:30px;height:30px;border:0;border-radius:8px;background:#f4f8fd;color:#004991;display:inline-flex;align-items:center;justify-content:center;}
.wfd-mp-nav:hover{background:#e6effa;}
.wfd-mp-nav:disabled{opacity:.4;cursor:not-allowed;}
.wfd-mp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}
.wfd-mp-cell{padding:8px 0;border:1px solid #eef2f8;border-radius:8px;background:#fff;font-size:12.5px;color:#1f2a44;cursor:pointer;text-transform:capitalize;}
.wfd-mp-cell:hover{background:#f4f8fd;border-color:#cfdcec;}
.wfd-mp-cell.sel{background:#004991;border-color:#004991;color:#fff;font-weight:700;}
`

const FUNNEL_BAR = { warning: '#f0a82b', success: '#16a34a', primary: '#004991' }

const CustomSelect = ({ value, options, onChange, icon, minWidth = 140 }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = options.find((o) => String(o.value) === String(value))

  return (
    <div ref={ref} className={`wfd-ddwrap ${open ? 'open' : ''}`} style={{ minWidth }}>
      <button type='button' className='wfd-dd' onClick={() => setOpen((o) => !o)}>
        <span>{icon && <i className={`${icon} me-1`} style={{ color: '#004991' }}></i>}{selected ? selected.label : '—'}</span>
        <i className='ti ti-chevron-down chev'></i>
      </button>
      {open && (
        <div className='wfd-menu'>
          {options.map((o) => (
            <button
              key={o.value}
              type='button'
              className={`wfd-opt ${String(o.value) === String(value) ? 'sel' : ''}`}
              onClick={() => { onChange(o.value); setOpen(false) }}
            >
              {o.label}
              {String(o.value) === String(value) && <i className='ti ti-check'></i>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Month picker custom (mes + año en un popover tipo calendario).
const MonthPicker = ({ month, year, months, years, onChange }) => {
  const [open, setOpen] = useState(false)
  const [navYear, setNavYear] = useState(year)
  const ref = useRef(null)

  useEffect(() => { if (open) setNavYear(year) }, [open, year])
  useEffect(() => {
    const handler = (event) => { if (!ref.current?.contains(event.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const minYear = years.length ? Math.min(...years) : navYear
  const maxYear = years.length ? Math.max(...years) : navYear
  const current = months.find((m) => String(m.value) === String(month))

  return (
    <div ref={ref} className={`wfd-ddwrap ${open ? 'open' : ''}`} style={{ minWidth: 175 }}>
      <button type='button' className='wfd-dd' onClick={() => setOpen((o) => !o)}>
        <span className='text-capitalize'><i className='ti ti-calendar-month me-1' style={{ color: '#004991' }}></i>{current ? current.label : '—'} {year}</span>
        <i className='ti ti-chevron-down chev'></i>
      </button>
      {open && (
        <div className='wfd-menu wfd-monthpick'>
          <div className='wfd-mp-head'>
            <button type='button' className='wfd-mp-nav' disabled={navYear <= minYear} onClick={() => setNavYear((y) => Math.max(minYear, y - 1))}><i className='ti ti-chevron-left'></i></button>
            <span className='wfd-mp-year'>{navYear}</span>
            <button type='button' className='wfd-mp-nav' disabled={navYear >= maxYear} onClick={() => setNavYear((y) => Math.min(maxYear, y + 1))}><i className='ti ti-chevron-right'></i></button>
          </div>
          <div className='wfd-mp-grid'>
            {months.map((m) => {
              const selected = String(m.value) === String(month) && navYear === year
              return (
                <button
                  key={m.value}
                  type='button'
                  className={`wfd-mp-cell ${selected ? 'sel' : ''}`}
                  onClick={() => { onChange(m.value, navYear); setOpen(false) }}
                >
                  {m.short || m.label.slice(0, 3)}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const Home = ({ dashboard, filter }) => {
  const [data, setData] = useState(dashboard || EMPTY_DASHBOARD)
  const [mode, setMode] = useState(filter?.mode ?? 'month')
  const [year, setYear] = useState(filter?.year ?? new Date().getFullYear())
  const [month, setMonth] = useState(filter?.month ?? (new Date().getMonth() + 1))
  const [loading, setLoading] = useState(false)
  const chartRef = useRef(null)
  const apexRef = useRef(null)
  const firstRender = useRef(true)

  const d = useMemo(() => ({ ...EMPTY_DASHBOARD, ...(data || {}) }), [data])
  const modeOptions = [{ value: 'month', label: 'Por mes' }, { value: 'year', label: 'Por año' }]
  const monthOptions = filter?.months ?? []
  const yearOptions = (filter?.years ?? []).map((y) => ({ value: y, label: String(y) }))

  useEffect(() => {
    document.title = 'Inicio | Admin'
  }, [])

  // Refetch del dashboard al cambiar mes/año (sin recargar la página).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return undefined
    }

    const controller = new AbortController()
    setLoading(true)
    fetch(`/api/admin/dashboard?mode=${mode}&month=${month}&year=${year}`, {
      headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      credentials: 'same-origin',
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((res) => { if (res?.dashboard) setData(res.dashboard) })
      .catch((error) => { if (error.name !== 'AbortError') console.error(error) })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [mode, month, year])

  useEffect(() => {
    if (!chartRef.current || typeof ApexCharts === 'undefined') return

    const options = {
      chart: { type: 'line', height: 340, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [
        { name: 'Cantidad de cotizaciones', type: 'column', data: d.chart.qty },
        { name: 'Monto cotizado (S/)', type: 'line', data: d.chart.amount },
      ],
      stroke: { width: [0, 3], curve: 'smooth' },
      plotOptions: { bar: { columnWidth: '46%', borderRadius: 5 } },
      xaxis: { categories: d.chart.labels, title: { text: d.chart.x_title || 'Día del mes' } },
      yaxis: [
        { title: { text: 'Cantidad' }, labels: { formatter: (v) => Math.round(v) } },
        { opposite: true, title: { text: 'Monto (S/)' }, labels: { formatter: (v) => `S/ ${Math.round(v).toLocaleString('es-PE')}` } },
      ],
      colors: ['#004991', '#e0a800'],
      dataLabels: { enabled: false },
      grid: { borderColor: '#eef2f8' },
      legend: { position: 'top' },
      tooltip: { shared: true, intersect: false },
    }

    apexRef.current = new ApexCharts(chartRef.current, options)
    apexRef.current.render()

    return () => {
      if (apexRef.current) {
        apexRef.current.destroy()
        apexRef.current = null
      }
    }
  }, [d])

  return (
    <div className='wfd-wrap'>
      <style>{BRAND_CSS}</style>

      <div className='row g-3'>
        {/* Encabezado + filtro */}
        <div className='col-12'>
          <div className='wfd-card'>
            <div className='d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3'>
              <div className='d-flex align-items-center gap-3'>
                <div className='wfd-iconbox'><i className='ti ti-layout-dashboard'></i></div>
                <div>
                  <h2 className='wfd-h2'>Panel Comercial</h2>
                  <p className='wfd-sub text-capitalize'>Resumen ejecutivo de <b>{d.month_label || 'el mes actual'}</b></p>
                </div>
              </div>
              <div className='d-flex align-items-center gap-2 flex-wrap'>
                {loading && <i className='ti ti-loader-2 spin' style={{ color: '#004991', fontSize: 18 }}></i>}
                <CustomSelect value={mode} options={modeOptions} onChange={setMode} icon='ti ti-filter' minWidth={130} />
                {mode === 'month' ? (
                  <MonthPicker month={month} year={year} months={monthOptions} years={filter?.years ?? []} onChange={(m, y) => { setMonth(m); setYear(y) }} />
                ) : (
                  <CustomSelect value={year} options={yearOptions} onChange={setYear} icon='ti ti-calendar' minWidth={120} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* KPIs */}
        {d.kpis.map((kpi) => (
          <div key={kpi.title} className='col-12 col-md-6 col-xl-3'>
            <div className='wfd-card'>
              <div className='d-flex align-items-start justify-content-between'>
                <p className='wfd-kpi-label'>{kpi.title}</p>
                <div className='wfd-iconbox sm'><i className={kpi.icon}></i></div>
              </div>
              <p className='wfd-kpi-val'>{kpi.value}</p>
              <span className={`wfd-badge ${kpi.positive ? 'up' : 'down'}`}>
                <i className={`ti ti-arrow-${kpi.positive ? 'up' : 'down'}-right`}></i>{kpi.delta}
              </span>
            </div>
          </div>
        ))}

        {/* Gráfico */}
        <div className='col-12 col-xl-8'>
          <div className='wfd-card'>
            <div className='d-flex align-items-center justify-content-between mb-3'>
              <h2 className='wfd-h2'>Tendencia de cotizaciones</h2>
              <span className='wfd-badge brand text-capitalize'>{d.month_label}</span>
            </div>
            <div ref={chartRef} />
          </div>
        </div>

        {/* Métricas */}
        <div className='col-12 col-xl-4'>
          <div className='wfd-card'>
            <h2 className='wfd-h2 mb-3'>Métricas de desempeño</h2>
            <div className='d-flex flex-column gap-2'>
              {d.metrics.map((metric) => (
                <div key={metric.label} className='wfd-metric'>
                  <small>{metric.label}</small>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Embudo */}
        <div className='col-12'>
          <div className='wfd-card'>
            <h2 className='wfd-h2 mb-3'>Embudo de cotizaciones</h2>
            <div className='row g-3'>
              {d.funnel.map((item) => (
                <div key={item.stage} className='col-12 col-md-4'>
                  <div className='wfd-stage'>
                    <div className='d-flex justify-content-between align-items-center'>
                      <span style={{ fontSize: 13, color: '#5b6577' }}>{item.stage}</span>
                      <strong style={{ color: FUNNEL_BAR[item.color], fontSize: 18 }}>{item.value}</strong>
                    </div>
                    <div className='wfd-prog'>
                      <span style={{ width: `${Math.min(100, (item.value / (d.funnel_max || 1)) * 100)}%`, background: FUNNEL_BAR[item.color] }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Últimas cotizaciones */}
        <div className='col-12'>
          <div className='wfd-card'>
            <div className='d-flex align-items-center gap-3 mb-3'>
              <div className='wfd-iconbox amber'><i className='ti ti-file-invoice'></i></div>
              <div>
                <h2 className='wfd-h2'>Últimas cotizaciones</h2>
                <p className='wfd-sub'>Las <b>{d.latest_quotes.length}</b> más recientes del periodo</p>
              </div>
            </div>

            <div className='wfd-tablewrap'>
              <table className='wfd-table'>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Cliente</th>
                    <th>Ubicación</th>
                    <th className='text-center'>Items</th>
                    <th className='text-end'>Monto</th>
                    <th className='text-center'>Estado</th>
                    <th className='text-end'>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {d.latest_quotes.length ? d.latest_quotes.map((quote) => (
                    <tr key={quote.code}>
                      <td className='fw-semibold' style={{ color: '#004991' }}>{quote.code}</td>
                      <td>
                        <span className='fw-semibold d-block'>{quote.customer}</span>
                        <small className='text-muted'>{quote.business}</small>
                      </td>
                      <td style={{ color: '#5b6577' }}>{quote.region}</td>
                      <td className='text-center fw-semibold'>{quote.items}</td>
                      <td className='text-end fw-semibold' style={{ whiteSpace: 'nowrap' }}>{quote.amount}</td>
                      <td className='text-center'><span className={`wfd-st ${quote.status}`}>{quote.status_label}</span></td>
                      <td className='text-end' style={{ color: '#8a93a6', whiteSpace: 'nowrap' }}>{quote.date}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={7} className='text-center py-4' style={{ color: '#9aa3b3' }}>Sin cotizaciones en este periodo</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Adminto {...properties} title='Inicio'>
      <Home {...properties} />
    </Adminto>
  )
})
