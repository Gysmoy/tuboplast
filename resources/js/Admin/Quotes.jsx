import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'
import AdminTable from '../Components/AdminTable.jsx'
import ConfirmModal from '../Components/ConfirmModal.jsx'
import QuotesRest from '../Actions/Admin/QuotesRest.js'
import { openQuotePdf } from '../Utils/quoteStorage.js'

const quotesRest = new QuotesRest()

// Estilos propios de esta vista (badges, modal). La tabla trae los suyos.
const QUOTES_CSS = `
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
.wfq-h2{font-size:18px;font-weight:700;line-height:1.25;margin:0;color:#0f2540;}
.wfq-btn{height:36px;padding:0 14px;border-radius:10px;background:#004991;color:#fff;font-weight:600;font-size:13px;border:0;display:inline-flex;align-items:center;gap:6px;transition:background .2s;}
.wfq-btn:hover{background:#003b7a;color:#fff;}
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

const Detail = ({ label, value }) => (
  <div className='col-md-4 col-sm-6'>
    <span className='wfq-lbl'>{label}</span>
    <p className='wfq-val'>{value || '-'}</p>
  </div>
)

const Quotes = () => {
  const tableRef = useRef(null)
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [archiveMode, setArchiveMode] = useState(false)
  const [archiveReason, setArchiveReason] = useState('')
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const resetArchive = () => { setArchiveMode(false); setArchiveReason('') }

  const changeState = async (quote, state, reason = null) => {
    if (!quote) return
    const ok = await quotesRest.changeState(quote.id, state, reason)
    if (!ok) return
    const patch = { quote_status: state, archived_reason: state === 'archivado' ? reason : null }
    tableRef.current?.patchRow(quote.id, patch)
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
    tableRef.current?.patchRow(quote.id, { seen: true })
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

  const askDelete = (quote, event) => { if (event) event.stopPropagation(); setConfirmTarget(quote) }

  const performDelete = async () => {
    const quote = confirmTarget
    if (!quote) return
    setDeleting(true)
    const ok = await quotesRest.delete(quote.id)
    setDeleting(false)
    if (!ok) return
    if (isUnseen(quote)) window.dispatchEvent(new CustomEvent('quotes:seen', { detail: { id: quote.id } }))
    if (selectedQuote?.id === quote.id) closeModal()
    setConfirmTarget(null)
    tableRef.current?.reload()
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

  const stop = (fn) => (e) => { e.stopPropagation(); fn() }

  const columns = [
    {
      key: 'code', header: 'Cotización', field: 'code', nowrap: true,
      render: (q) => (<><span className='fw-semibold' style={{ color: '#004991' }}>{q.code || `#${q.id}`}</span>{isUnseen(q) && <span className='wfq-new'>Nueva</span>}</>),
    },
    {
      key: 'name', header: 'Cliente', field: 'name', filterFields: ['name', 'business'], nowrap: true,
      render: (q) => (<><span className='fw-semibold d-block'>{q.name}</span><small className='text-muted'>{q.business || 'Sin empresa'}</small></>),
    },
    {
      key: 'email', header: 'Contacto', field: 'email', filterFields: ['email', 'phone'], nowrap: true,
      render: (q) => (<><span className='d-block'>{q.email}</span><small className='text-muted'>{phoneDisplay(q)}</small></>),
    },
    {
      key: 'items', header: 'Items', align: 'center', filterable: false, sortable: false,
      render: (q) => { const items = normalizeItems(q.items); return <span className='wfq-chip'>{items.length} ({q.total_items})</span> },
    },
    { key: 'region', header: 'Ubicación', field: 'region', render: (q) => <span style={{ color: '#5b6577' }}>{q.region || '-'}</span> },
    { key: 'created_at', header: 'Fecha', field: 'created_at', filterType: 'date', sortField: 'created_at', nowrap: true, width: 138, render: (q) => <span style={{ color: '#5b6577' }}>{q.created_at ? moment(q.created_at).format('DD/MM/YY HH:mm') : '-'}</span> },
    {
      key: 'quote_status', header: 'Estado', field: 'quote_status',
      filterOptions: Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label })),
      render: (q) => <StatusPill state={q.quote_status} />,
    },
    {
      key: 'actions', header: 'Acciones', align: 'center', filterable: false,
      render: (q) => (
        <div className='d-flex align-items-center justify-content-center gap-1'>
          <button className='wfq-act edit' title='Ver detalle' onClick={stop(() => openDetails(q))}><i className='mdi mdi-eye'></i></button>
          <button className='wfq-act pdf' title='Ver PDF' onClick={stop(() => viewPdf(q))}><i className='mdi mdi-file-pdf-box'></i></button>
          <button className='wfq-act del' title='Eliminar' onClick={(e) => askDelete(q, e)}><i className='mdi mdi-trash-can'></i></button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <style>{QUOTES_CSS}</style>

      <AdminTable
        ref={tableRef}
        rest={quotesRest}
        title='Lista de cotizaciónes'
        icon='ti ti-receipt-2'
        countSuffix='cotizaciónes'
        defaultSort={[{ selector: 'code', desc: true }]}
        minWidth={1040}
        columns={columns}
        rowClassName={(q) => (isUnseen(q) ? 'at-row-unseen' : '')}
        onRowClick={openDetails}
      />

      {/* Modal detalle */}
      {selectedQuote && (
        <div className='wfq-modal-ovl' onMouseDown={closeModal}>
          <div className='wfq-modal' onMouseDown={(e) => e.stopPropagation()}>
            <div className='wfq-modal-head'>
              <h3 className='wfq-h2' style={{ fontSize: 16 }}>Cotización <span style={{ color: '#004991' }}>{selectedQuote.code || `#${selectedQuote.id}`}</span></h3>
              <button className='wfq-close' onClick={closeModal}><i className='mdi mdi-close'></i></button>
            </div>

            <div className='wfq-modal-body'>
              <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3'>
                <div className='d-flex flex-wrap align-items-center gap-2'>
                  <span className='text-muted' style={{ fontSize: 13 }}>{selectedQuote.created_at ? moment(selectedQuote.created_at).format('LLL') : ''}</span>
                  <StatusPill state={status} />
                  {isUnseen(selectedQuote) && <span className='wfq-new'>Nueva</span>}
                </div>
                <button type='button' className='wfq-btn amber' onClick={() => viewPdf(selectedQuote)}><i className='mdi mdi-file-pdf-box'></i> Ver PDF</button>
              </div>

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
              <p className='text-muted mb-2' style={{ fontSize: 13 }}>Indica el motivo por el que archivas <b style={{ color: '#004991' }}>{selectedQuote.code || `#${selectedQuote.id}`}</b>.</p>
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

      <ConfirmModal
        open={!!confirmTarget}
        title='Eliminar cotización'
        message={confirmTarget ? `Se eliminará ${confirmTarget.code || `#${confirmTarget.id}`}. Esta acción no se puede deshacer.` : ''}
        confirmLabel='Eliminar'
        variant='danger'
        loading={deleting}
        onConfirm={performDelete}
        onCancel={() => { if (!deleting) setConfirmTarget(null) }}
      />
    </div>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Adminto {...properties} title='Cotizaciónes'>
      <Quotes />
    </Adminto>
  )
})
