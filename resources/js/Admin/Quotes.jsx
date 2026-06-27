import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'
import QuotesRest from '../Actions/Admin/QuotesRest.js'
import { openQuotePdf } from '../Utils/quoteStorage.js'

const quotesRest = new QuotesRest()

const PER_PAGE_OPTIONS = [10, 25, 50, 100]

// Capa de marca (formato de la referencia weFem) con colores Tuboplast.
const BRAND_CSS = `
.wfq-wrap{color:#1f2a44;}
.wfq-card{background:#fff;border:1px solid #e7edf5;border-radius:16px;box-shadow:0 1px 2px rgba(15,37,64,.04),0 6px 16px rgba(0,73,145,.06);padding:16px;}
@media(min-width:992px){.wfq-card{padding:20px;}}
.wfq-iconbox{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#0a5aa8,#004991);color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 10px rgba(0,73,145,.25);flex-shrink:0;}
.wfq-h2{font-size:18px;font-weight:700;line-height:1.25;margin:0;color:#0f2540;}
@media(min-width:992px){.wfq-h2{font-size:20px;}}
.wfq-sub{font-size:12px;color:#8a93a6;margin:0;}.wfq-sub b{color:#004991;}
.wfq-tool{height:40px;width:40px;border-radius:12px;background:#e6effa;color:#004991;border:0;display:inline-flex;align-items:center;justify-content:center;transition:background .2s;}
.wfq-tool:hover{background:#d6e6f7;}
.wfq-search{height:40px;border-radius:12px;border:1px solid #dce5f0;background:#f5f8fc;font-size:13px;padding:0 12px 0 36px;outline:none;width:100%;}
.wfq-search:focus{border-color:#004991;}
.wfq-tablewrap{border:1px solid #eef2f8;border-radius:12px;overflow-x:auto;}
.wfq-tablewrap::-webkit-scrollbar{height:8px;}.wfq-tablewrap::-webkit-scrollbar-thumb{background:#cfdcec;border-radius:9px;}
table.wfq-table{width:100%;border-collapse:collapse;font-size:13px;min-width:980px;margin:0;}
table.wfq-table thead th{background:#f5f8fc;color:#8a93a6;font-size:11px;text-transform:uppercase;letter-spacing:.025em;font-weight:600;padding:12px;white-space:nowrap;}
table.wfq-table tbody td{padding:12px;border-top:1px solid #eef2f8;vertical-align:middle;}
table.wfq-table tbody tr{cursor:pointer;transition:background-color .15s ease;}
table.wfq-table tbody tr:hover{background:#f9fbfe;}
table.wfq-table tbody tr.unseen{background:#eaf4ff;}
table.wfq-table tbody tr.unseen:hover{background:#dff0ff;}
.wfq-st{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:50rem;font-size:11px;font-weight:600;white-space:nowrap;}
.wfq-st .dot{width:6px;height:6px;border-radius:50%;}
.wfq-st.pendiente{background:#fff4d6;color:#854f0b;}.wfq-st.pendiente .dot{background:#caa12a;}
.wfq-st.contactado{background:#e8f0ff;color:#185fa5;}.wfq-st.contactado .dot{background:#3b82f6;}
.wfq-st.convertido{background:#e1f5ee;color:#0f6e56;}.wfq-st.convertido .dot{background:#16c784;}
.wfq-st.archivado{background:#f1efe8;color:#5f5e5a;}.wfq-st.archivado .dot{background:#9a958c;}
.wfq-chip{display:inline-flex;align-items:center;padding:3px 10px;border-radius:50rem;font-size:11px;font-weight:600;background:#e6effa;color:#004991;}
.wfq-new{display:inline-flex;align-items:center;padding:2px 8px;border-radius:50rem;font-size:10px;font-weight:700;background:#004991;color:#fff;margin-left:6px;}
.wfq-act{width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;border:0;font-size:13px;transition:filter .15s;}
.wfq-act:hover{filter:brightness(.95);}
.wfq-act.edit{background:#e8f0ff;color:#3b82f6;}
.wfq-act.pdf{background:#fff1d6;color:#9a6b00;}
.wfq-act.del{background:#fcebeb;color:#e24b4a;}
.wfq-pg{min-width:32px;height:32px;padding:0 8px;border-radius:8px;border:0;background:none;color:#8a93a6;font-weight:600;font-size:13px;}
.wfq-pg:hover{background:#f4f8fd;}
.wfq-pg.on{background:#004991;color:#fff;}
.wfq-pg:disabled{opacity:.4;cursor:not-allowed;}
.wfq-btn{height:36px;padding:0 14px;border-radius:10px;background:#004991;color:#fff;font-weight:600;font-size:13px;border:0;display:inline-flex;align-items:center;gap:6px;transition:background .2s;}
.wfq-btn:hover{background:#003b7a;color:#fff;}
.wfq-btn.ghost{background:#e6effa;color:#004991;}.wfq-btn.ghost:hover{background:#d6e6f7;}
.wfq-btn.green{background:#16a34a;}.wfq-btn.green:hover{background:#15803d;}
.wfq-btn.amber{background:#e0a800;color:#003b7a;}.wfq-btn.amber:hover{background:#c99800;color:#003b7a;}
.wfq-btn.danger{background:#e24b4a;}.wfq-btn.danger:hover{background:#c93b3a;}
.wfq-btn.outline{background:#fff;border:1px solid #dce5f0;color:#5b6577;}.wfq-btn.outline:hover{background:#f4f8fd;color:#0f2540;}
.wfq-sec{border:1px solid #eef2f8;border-radius:12px;padding:16px;}
.wfq-sec h4{font-size:14px;font-weight:700;color:#0f2540;margin:0;}
.wfq-lbl{display:block;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#8a93a6;margin-bottom:2px;}
.wfq-val{font-size:13px;color:#1f2a44;word-break:break-word;margin:0;}
.wfq-modal-ovl{position:fixed;inset:0;z-index:1100;background:rgba(15,23,42,.5);display:flex;align-items:flex-start;justify-content:center;padding:3vh 12px;}
.wfq-modal{position:relative;width:min(1000px,96vw);max-height:94vh;background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(15,37,64,.25);display:flex;flex-direction:column;overflow:hidden;}
.wfq-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid #eef2f8;flex-shrink:0;}
.wfq-modal-body{overflow-y:auto;padding:16px 20px;}
.wfq-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 20px;border-top:1px solid #eef2f8;flex-shrink:0;}
.wfq-close{width:36px;height:36px;border-radius:10px;border:0;background:none;color:#8a93a6;font-size:18px;}
.wfq-close:hover{background:#f4f8fd;color:#0f2540;}
.wfq-itemtable{width:100%;border-collapse:collapse;font-size:13px;min-width:520px;}
.wfq-itemtable th{text-align:left;font-size:11px;text-transform:uppercase;color:#8a93a6;font-weight:600;padding:8px;border-bottom:1px solid #eef2f8;}
.wfq-itemtable td{padding:8px;border-bottom:1px solid #f1f5fa;}
`

const normalizeItems = (items) => {
  if (Array.isArray(items)) return items
  if (typeof items === 'string') {
    try {
      const parsed = JSON.parse(items)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

const parsePrice = (item) => {
  if (item?.unitPrice != null && Number.isFinite(Number(item.unitPrice))) return Number(item.unitPrice)
  if (item?.price) {
    const value = Number(String(item.price).replace(/[^\d.]/g, ''))
    return Number.isFinite(value) && value > 0 ? value : null
  }
  return null
}

const currencySymbol = (currency) => (String(currency ?? 'PEN').toUpperCase() === 'USD' ? '$' : 'S/')
const formatMoney = (value, currency = 'PEN') => `${currencySymbol(currency)} ${Number(value).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const itemCurrency = (item) => String(item?.currency ?? 'PEN').toUpperCase()

const STATUS_LABEL = { pendiente: 'Pendiente', contactado: 'Contactado', convertido: 'Convertido', archivado: 'Archivado' }
const statusKey = (state) => (STATUS_LABEL[state] ? state : 'pendiente')
const StatusPill = ({ state }) => {
  const key = statusKey(state)
  return <span className={`wfq-st ${key}`}><span className='dot'></span>{STATUS_LABEL[key]}</span>
}

const isUnseen = (q) => q?.seen === false || q?.seen === 0
const phoneDisplay = (quote) => [quote?.phone_prefix, quote?.phone].filter(Boolean).join(' ') || '-'
const buildCustomer = (quote) => ({
  name: quote?.name, business: quote?.business, ruc: quote?.ruc, email: quote?.email,
  phonePrefix: quote?.phone_prefix, phone: quote?.phone,
  department: quote?.department, province: quote?.province, district: quote?.district,
})

// Lista de páginas con ventana (1 … 4 5 6 … 59).
const buildPages = (current, last) => {
  if (last <= 1) return [1]
  const pages = [1]
  const left = Math.max(2, current - 1)
  const right = Math.min(last - 1, current + 1)
  if (left > 2) pages.push('…')
  for (let p = left; p <= right; p += 1) pages.push(p)
  if (right < last - 1) pages.push('…')
  pages.push(last)
  return pages
}

const Detail = ({ label, value }) => (
  <div className='col-md-4 col-sm-6'>
    <span className='wfq-lbl'>{label}</span>
    <p className='wfq-val'>{value || '-'}</p>
  </div>
)

const Quotes = () => {
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const [selectedQuote, setSelectedQuote] = useState(null)
  const [archiveMode, setArchiveMode] = useState(false)
  const [archiveReason, setArchiveReason] = useState('')
  const firstSearch = useRef(true)

  // Debounce búsqueda → reset page.
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQuery(query.trim()); setPage(1) }, 350)
    return () => clearTimeout(t)
  }, [query])

  const load = useCallback(async () => {
    setLoading(true)
    const params = {
      requireTotalCount: true,
      skip: (page - 1) * perPage,
      take: perPage,
      sort: [{ selector: 'created_at', desc: true }],
    }
    if (debouncedQuery) {
      params.filter = [
        ['code', 'contains', debouncedQuery], 'or',
        ['name', 'contains', debouncedQuery], 'or',
        ['email', 'contains', debouncedQuery], 'or',
        ['region', 'contains', debouncedQuery],
      ]
    }
    const res = await quotesRest.paginate(params)
    setRows(Array.isArray(res?.data) ? res.data : [])
    setTotal(Number(res?.totalCount) || 0)
    setLoading(false)
  }, [page, perPage, debouncedQuery])

  useEffect(() => { load() }, [load])

  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const pages = useMemo(() => buildPages(page, totalPages), [page, totalPages])

  const resetArchive = () => { setArchiveMode(false); setArchiveReason('') }

  const patchRow = (id, patch) => setRows((list) => list.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  const changeState = async (quote, state, reason = null) => {
    if (!quote) return
    const ok = await quotesRest.changeState(quote.id, state, reason)
    if (!ok) return
    const patch = { quote_status: state, archived_reason: state === 'archivado' ? reason : null }
    patchRow(quote.id, patch)
    setSelectedQuote((cur) => (cur?.id === quote.id ? { ...cur, ...patch } : cur))
    resetArchive()
  }

  const confirmArchive = () => {
    if (!archiveReason.trim()) return
    changeState(selectedQuote, 'archivado', archiveReason.trim())
  }

  const markSeen = async (quote) => {
    if (!isUnseen(quote)) return
    const ok = await quotesRest.seen(quote.id)
    if (!ok) return
    patchRow(quote.id, { seen: true })
    setSelectedQuote((cur) => (cur?.id === quote.id ? { ...cur, seen: true } : cur))
    window.dispatchEvent(new CustomEvent('quotes:seen', { detail: { id: quote.id } }))
  }

  const openDetails = async (quote) => {
    setSelectedQuote(quote)
    resetArchive()
    await markSeen(quote)
  }

  const closeModal = () => { setSelectedQuote(null); resetArchive() }

  const viewPdf = (quote) => {
    const win = window.open('', '_blank')
    openQuotePdf(buildCustomer(quote), normalizeItems(quote.items), { code: quote.code, date: quote.created_at }, win)
  }

  const deleteQuote = async (quote, event) => {
    if (event) event.stopPropagation()
    if (!confirm('¿Eliminar esta cotización? Esta acción no se puede deshacer.')) return
    const ok = await quotesRest.delete(quote.id)
    if (!ok) return
    if (isUnseen(quote)) window.dispatchEvent(new CustomEvent('quotes:seen', { detail: { id: quote.id } }))
    if (selectedQuote?.id === quote.id) closeModal()
    load()
  }

  // Body scroll lock con modal abierto.
  useEffect(() => {
    document.body.style.overflow = selectedQuote ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedQuote])

  const selectedItems = normalizeItems(selectedQuote?.items)
  const totalsByCurrency = selectedItems.reduce((totals, item) => {
    const unit = parsePrice(item)
    if (unit == null) return totals
    const qty = Math.max(1, Number(item.quantity) || 1)
    const cur = itemCurrency(item)
    totals[cur] = (totals[cur] || 0) + unit * qty
    return totals
  }, {})
  const currencyTotals = Object.entries(totalsByCurrency)
  const hasPricing = currencyTotals.length > 0
  const status = selectedQuote?.quote_status || 'pendiente'

  const from = total === 0 ? 0 : (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)

  return (
    <div className='wfq-wrap'>
      <style>{BRAND_CSS}</style>

      <div className='wfq-card'>
        {/* Encabezado */}
        <div className='d-flex align-items-center justify-content-between gap-3 mb-4'>
          <div className='d-flex align-items-center gap-3'>
            <div className='wfq-iconbox'><i className='fas fa-file-invoice-dollar'></i></div>
            <div>
              <h2 className='wfq-h2'>Lista de cotizaciones</h2>
              <p className='wfq-sub'><b>{total.toLocaleString('es-PE')}</b> cotizaciones</p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className='d-flex flex-wrap align-items-center gap-2 mb-4'>
          <button type='button' className='wfq-tool' title='Refrescar' onClick={load}><i className='mdi mdi-refresh'></i></button>
          {loading && <i className='mdi mdi-loading mdi-spin' style={{ color: '#004991', fontSize: 18 }}></i>}
          <div className='position-relative ms-auto' style={{ width: '100%', maxWidth: 300 }}>
            <i className='mdi mdi-magnify position-absolute' style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8a93a6', fontSize: 16 }}></i>
            <input type='text' className='wfq-search' placeholder='Buscar cliente, código, ubicación…' value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>

        {/* Tabla */}
        <div className='wfq-tablewrap'>
          <table className='wfq-table'>
            <thead>
              <tr>
                <th>Cotización</th>
                <th>Cliente</th>
                <th>Contacto</th>
                <th className='text-center'>Items</th>
                <th>Ubicación</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th className='text-center'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? rows.map((quote) => {
                const items = normalizeItems(quote.items)
                return (
                  <tr key={quote.id} className={isUnseen(quote) ? 'unseen' : ''} onClick={() => openDetails(quote)}>
                    <td>
                      <span className='fw-semibold' style={{ color: '#004991' }}>{quote.code || `#${quote.id}`}</span>
                      {isUnseen(quote) && <span className='wfq-new'>Nueva</span>}
                    </td>
                    <td>
                      <span className='fw-semibold d-block'>{quote.name}</span>
                      <small className='text-muted'>{quote.business || 'Sin empresa'}</small>
                    </td>
                    <td>
                      <span className='d-block'>{quote.email}</span>
                      <small className='text-muted'>{phoneDisplay(quote)}</small>
                    </td>
                    <td className='text-center'><span className='wfq-chip'>{items.length} ({quote.total_items})</span></td>
                    <td style={{ color: '#5b6577' }}>{quote.region || '-'}</td>
                    <td style={{ whiteSpace: 'nowrap', color: '#5b6577' }}>{quote.created_at ? moment(quote.created_at).format('DD MMM YYYY, HH:mm') : '-'}</td>
                    <td><StatusPill state={quote.quote_status} /></td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className='d-flex align-items-center justify-content-center gap-1'>
                        <button className='wfq-act edit' title='Ver detalle' onClick={() => openDetails(quote)}><i className='mdi mdi-eye'></i></button>
                        <button className='wfq-act pdf' title='Ver PDF' onClick={() => viewPdf(quote)}><i className='mdi mdi-file-pdf-box'></i></button>
                        <button className='wfq-act del' title='Eliminar' onClick={(e) => deleteQuote(quote, e)}><i className='mdi mdi-trash-can'></i></button>
                      </div>
                    </td>
                  </tr>
                )
              }) : (
                <tr><td colSpan={8} className='text-center py-4' style={{ color: '#9aa3b3' }}>{loading ? 'Cargando…' : 'No se encontraron cotizaciones.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className='d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mt-4' style={{ fontSize: 13 }}>
          <div className='d-flex align-items-center gap-1'>
            <span className='me-1' style={{ color: '#8a93a6', fontSize: 12 }}>Por página:</span>
            {PER_PAGE_OPTIONS.map((n) => (
              <button key={n} className={`wfq-pg ${perPage === n ? 'on' : ''}`} onClick={() => { setPerPage(n); setPage(1) }}>{n}</button>
            ))}
          </div>
          <div className='d-flex align-items-center gap-2'>
            <span className='d-none d-sm-inline' style={{ color: '#8a93a6', fontSize: 12 }}>
              {from}-{to} de {total.toLocaleString('es-PE')}
            </span>
            <div className='d-flex align-items-center gap-1'>
              <button className='wfq-pg' disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}><i className='mdi mdi-chevron-left'></i></button>
              {pages.map((item, idx) => item === '…'
                ? <span key={`g-${idx}`} className='wfq-pg' style={{ cursor: 'default' }}>…</span>
                : <button key={item} className={`wfq-pg ${page === item ? 'on' : ''}`} onClick={() => setPage(item)}>{item}</button>)}
              <button className='wfq-pg' disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}><i className='mdi mdi-chevron-right'></i></button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal detalle */}
      {selectedQuote && (
        <div className='wfq-modal-ovl' onMouseDown={closeModal}>
          <div className='wfq-modal' onMouseDown={(e) => e.stopPropagation()}>
            <div className='wfq-modal-head'>
              <h3 className='wfq-h2' style={{ fontSize: 16 }}>
                Cotización <span style={{ color: '#004991' }}>{selectedQuote.code || `#${selectedQuote.id}`}</span>
              </h3>
              <button className='wfq-close' onClick={closeModal}><i className='mdi mdi-close'></i></button>
            </div>

            <div className='wfq-modal-body'>
              {/* Resumen superior */}
              <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3'>
                <div className='d-flex flex-wrap align-items-center gap-2'>
                  <span className='text-muted' style={{ fontSize: 13 }}>{selectedQuote.created_at ? moment(selectedQuote.created_at).format('LLL') : ''}</span>
                  <StatusPill state={status} />
                  {isUnseen(selectedQuote) && <span className='wfq-new'>Nueva</span>}
                </div>
                <button type='button' className='wfq-btn amber' onClick={() => viewPdf(selectedQuote)}>
                  <i className='mdi mdi-file-pdf-box'></i> Ver PDF
                </button>
              </div>

              {/* Seguimiento */}
              <div className='wfq-sec mb-3'>
                <div className='d-flex flex-wrap align-items-center gap-2'>
                  <span className='fw-semibold'>Seguimiento</span>
                  <StatusPill state={status} />
                  <div className='ms-auto d-flex flex-wrap gap-2'>
                    {status === 'pendiente' && (
                      <>
                        <button type='button' className='wfq-btn' onClick={() => changeState(selectedQuote, 'contactado')}><i className='mdi mdi-account-check'></i> Marcar contactado</button>
                        <button type='button' className='wfq-btn outline' onClick={() => setArchiveMode(true)}><i className='mdi mdi-archive-arrow-down'></i> Archivar</button>
                      </>
                    )}
                    {status === 'contactado' && (
                      <>
                        <button type='button' className='wfq-btn green' onClick={() => changeState(selectedQuote, 'convertido')}><i className='mdi mdi-check-decagram'></i> Marcar convertido</button>
                        <button type='button' className='wfq-btn outline' onClick={() => setArchiveMode(true)}><i className='mdi mdi-archive-arrow-down'></i> Archivar</button>
                      </>
                    )}
                    {status === 'convertido' && <span className='text-success small d-flex align-items-center gap-1'><i className='mdi mdi-check-decagram'></i> Cotización convertida</span>}
                    {status === 'archivado' && <span className='text-muted small d-flex align-items-center gap-1'><i className='mdi mdi-archive'></i> Cotización archivada</span>}
                  </div>
                </div>

                {status === 'archivado' && selectedQuote.archived_reason && (
                  <div className='mt-3 p-2 px-3' style={{ background: '#f1efe8', borderRadius: 8, fontSize: 13 }}>
                    <span className='fw-semibold'>Motivo de archivado:</span> {selectedQuote.archived_reason}
                  </div>
                )}
              </div>

              <div className='row g-3'>
                {/* Cliente */}
                <div className='col-12'>
                  <div className='wfq-sec'>
                    <h4 className='mb-3'><i className='mdi mdi-account-tie me-1' style={{ color: '#004991' }}></i>Datos del cliente</h4>
                    <div className='row g-3'>
                      <Detail label='Nombre completo' value={selectedQuote.name} />
                      <Detail label='Razón social / Empresa' value={selectedQuote.business} />
                      <Detail label='RUC' value={selectedQuote.ruc} />
                      <Detail label='Correo electrónico' value={selectedQuote.email} />
                      <Detail label='Teléfono / WhatsApp' value={phoneDisplay(selectedQuote)} />
                    </div>
                  </div>
                </div>

                {/* Ubicación */}
                <div className='col-12'>
                  <div className='wfq-sec'>
                    <h4 className='mb-3'><i className='mdi mdi-map-marker me-1' style={{ color: '#004991' }}></i>Ubicación</h4>
                    <div className='row g-3'>
                      <Detail label='Departamento' value={selectedQuote.department} />
                      <Detail label='Provincia' value={selectedQuote.province} />
                      <Detail label='Distrito' value={selectedQuote.district} />
                      <Detail label='Ubigeo' value={selectedQuote.ubigeo} />
                      <Detail label='Aceptó términos' value={selectedQuote.accepted_terms ? 'Sí' : 'No'} />
                    </div>
                  </div>
                </div>

                {/* Productos */}
                <div className='col-12'>
                  <div className='wfq-sec'>
                    <h4 className='mb-3'><i className='mdi mdi-package-variant-closed me-1' style={{ color: '#004991' }}></i>Productos cotizados</h4>
                    <div style={{ overflowX: 'auto' }}>
                      <table className='wfq-itemtable'>
                        <thead>
                          <tr>
                            <th style={{ width: 36 }}>#</th>
                            <th style={{ width: 52 }}></th>
                            <th>Producto</th>
                            <th>SKU</th>
                            <th className='text-center'>Cant.</th>
                            <th className='text-end'>P. unitario</th>
                            <th className='text-end'>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedItems.length ? selectedItems.map((item, index) => {
                            const qty = Math.max(1, Number(item.quantity) || 1)
                            const unit = parsePrice(item)
                            const cur = itemCurrency(item)
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.image ? <img src={item.image} alt={item.title} width={40} height={40} style={{ objectFit: 'cover', borderRadius: 6 }} /> : <span className='text-muted'>—</span>}</td>
                                <td className='fw-semibold'>{item.title}</td>
                                <td>{item.sku || '-'}</td>
                                <td className='text-center fw-semibold'>{qty}</td>
                                <td className='text-end'>{unit != null ? formatMoney(unit, cur) : (item.price || '-')}</td>
                                <td className='text-end fw-semibold'>{unit != null ? formatMoney(unit * qty, cur) : '-'}</td>
                              </tr>
                            )
                          }) : (
                            <tr><td colSpan={7} className='text-center text-muted'>Sin productos</td></tr>
                          )}
                        </tbody>
                        {hasPricing && (
                          <tfoot>
                            {currencyTotals.map(([cur, totalCur]) => (
                              <tr key={cur}>
                                <td colSpan={6} className='text-end fw-semibold'>Total estimado ({cur})</td>
                                <td className='text-end fw-bold' style={{ color: '#004991' }}>{formatMoney(totalCur, cur)}</td>
                              </tr>
                            ))}
                          </tfoot>
                        )}
                      </table>
                    </div>
                    {hasPricing && <small className='text-muted d-block mt-2'>* Montos referenciales. El PDF entregado al cliente no incluye precios.</small>}
                  </div>
                </div>

                {/* Registro */}
                <div className='col-12'>
                  <div className='wfq-sec'>
                    <h4 className='mb-3'><i className='mdi mdi-information-outline me-1' style={{ color: '#004991' }}></i>Registro</h4>
                    <div className='row g-3'>
                      <Detail label='Dirección IP' value={selectedQuote.ip_address} />
                      <Detail label='Dispositivo' value={selectedQuote.device_type} />
                      <Detail label='Navegador' value={selectedQuote.browser} />
                      <Detail label='Sistema operativo' value={selectedQuote.operating_system} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='wfq-modal-foot'>
              <button type='button' className='wfq-btn danger' onClick={closeModal}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal motivo de archivado */}
      {archiveMode && selectedQuote && (
        <div className='wfq-modal-ovl' style={{ zIndex: 1200, alignItems: 'center' }} onMouseDown={resetArchive}>
          <div className='wfq-modal' style={{ width: 'min(460px,96vw)' }} onMouseDown={(e) => e.stopPropagation()}>
            <div className='wfq-modal-head'>
              <h3 className='wfq-h2' style={{ fontSize: 16 }}><i className='mdi mdi-archive-arrow-down me-1' style={{ color: '#004991' }}></i>Archivar cotización</h3>
              <button className='wfq-close' onClick={resetArchive}><i className='mdi mdi-close'></i></button>
            </div>
            <div className='wfq-modal-body'>
              <p className='text-muted mb-2' style={{ fontSize: 13 }}>
                Indica el motivo por el que archivas <b style={{ color: '#004991' }}>{selectedQuote.code || `#${selectedQuote.id}`}</b>.
              </p>
              <label className='wfq-lbl'>Motivo de archivado</label>
              <textarea className='form-control' rows={3} autoFocus value={archiveReason} onChange={(e) => setArchiveReason(e.target.value)} placeholder='Ej. Cliente desistió, datos incompletos...' />
            </div>
            <div className='wfq-modal-foot'>
              <button type='button' className='wfq-btn outline' onClick={resetArchive}>Cancelar</button>
              <button type='button' className='wfq-btn danger' disabled={!archiveReason.trim()} onClick={confirmArchive}><i className='mdi mdi-archive-arrow-down'></i> Confirmar archivado</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Adminto {...properties} title='Cotizaciones'>
      <Quotes />
    </Adminto>
  )
})
