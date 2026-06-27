import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import ReactAppend from '../Utils/ReactAppend.jsx'
import Adminto from '../Components/Adminto.jsx'
import Modal from '../Components/Modal.jsx'
import Table from '../Components/Table.jsx'
import TippyButton from '../Components/Form/TippyButton.jsx'
import QuotesRest from '../Actions/Admin/QuotesRest.js'
import { openQuotePdf } from '../Utils/quoteStorage.js'

const quotesRest = new QuotesRest()

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
  if (item?.unitPrice != null && Number.isFinite(Number(item.unitPrice))) {
    return Number(item.unitPrice)
  }
  if (item?.price) {
    const value = Number(String(item.price).replace(/[^\d.]/g, ''))
    return Number.isFinite(value) && value > 0 ? value : null
  }
  return null
}

const currencySymbol = (currency) => (String(currency ?? 'PEN').toUpperCase() === 'USD' ? '$' : 'S/')

const formatMoney = (value, currency = 'PEN') => `${currencySymbol(currency)} ${Number(value).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const itemCurrency = (item) => String(item?.currency ?? 'PEN').toUpperCase()

const STATUS_META = {
  pendiente: { label: 'Pendiente', cls: 'bg-warning-subtle text-warning' },
  contactado: { label: 'Contactado', cls: 'bg-info-subtle text-info' },
  convertido: { label: 'Convertido', cls: 'bg-success-subtle text-success' },
  archivado: { label: 'Archivado', cls: 'bg-secondary-subtle text-secondary' },
}

const statusMeta = (state) => STATUS_META[state] || STATUS_META.pendiente

const buildCustomer = (quote) => ({
  name: quote?.name,
  business: quote?.business,
  ruc: quote?.ruc,
  email: quote?.email,
  phonePrefix: quote?.phone_prefix,
  phone: quote?.phone,
  department: quote?.department,
  province: quote?.province,
  district: quote?.district,
})

const phoneDisplay = (quote) => [quote?.phone_prefix, quote?.phone].filter(Boolean).join(' ') || '-'

const Detail = ({ label, value, className = 'col-md-4' }) => (
  <div className={className}>
    <span className='d-block text-uppercase fw-semibold text-muted' style={{ fontSize: '11px', letterSpacing: '0.04em' }}>{label}</span>
    <p className='mb-0 mt-1 text-break'>{value || '-'}</p>
  </div>
)

const SectionTitle = ({ icon, children }) => (
  <div className='col-12'>
    <h5 className='d-flex align-items-center gap-2 mb-0 text-primary'>
      <i className={`mdi ${icon}`}></i>
      {children}
    </h5>
    <hr className='mt-2 mb-1' />
  </div>
)

const Quotes = () => {
  const gridRef = useRef()
  const modalRef = useRef()
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [archiveMode, setArchiveMode] = useState(false)
  const [archiveReason, setArchiveReason] = useState('')

  const refreshGrid = () => $(gridRef.current).dxDataGrid('instance').refresh()

  const resetArchive = () => {
    setArchiveMode(false)
    setArchiveReason('')
  }

  const changeState = async (quote, state, reason = null) => {
    if (!quote) return
    const ok = await quotesRest.changeState(quote.id, state, reason)
    if (!ok) return
    setSelectedQuote((current) => current?.id === quote.id
      ? { ...current, quote_status: state, archived_reason: state === 'archivado' ? reason : null }
      : current)
    resetArchive()
    refreshGrid()
  }

  const confirmArchive = () => {
    if (!archiveReason.trim()) return
    changeState(selectedQuote, 'archivado', archiveReason.trim())
  }

  const markSeen = async (quote) => {
    if (quote.seen === true || quote.seen === 1) return
    const ok = await quotesRest.seen(quote.id)
    if (!ok) return
    setSelectedQuote((current) => current?.id === quote.id ? { ...current, seen: true } : current)
    window.dispatchEvent(new CustomEvent('quotes:seen', { detail: { id: quote.id } }))
    refreshGrid()
  }

  const openDetails = async (quote) => {
    setSelectedQuote(quote)
    resetArchive()
    $(modalRef.current).modal('show')
    await markSeen(quote)
  }

  const viewPdf = (quote) => {
    // Open the tab synchronously (within the click) so popup blockers allow it,
    // then load the inline PDF blob once it is generated.
    const win = window.open('', '_blank')
    openQuotePdf(buildCustomer(quote), normalizeItems(quote.items), {
      code: quote.code,
      date: quote.created_at,
    }, win)
  }

  const deleteQuote = async (quote) => {
    const ok = await quotesRest.delete(quote.id)
    if (!ok) return

    if (quote.seen !== true && quote.seen !== 1) {
      window.dispatchEvent(new CustomEvent('quotes:seen', { detail: { id: quote.id } }))
    }
    refreshGrid()
  }

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

  return (
    <>
      <Table
        gridRef={gridRef}
        title='cotizaciones'
        rest={quotesRest}
        onRowPrepared={({ data, rowElement, rowType }) => {
          if (rowType !== 'data' || data.seen === true || data.seen === 1) return
          rowElement.find('td').css('background-color', '#eaf4ff')
        }}
        toolBar={(container) => {
          container.unshift({
            widget: 'dxButton',
            location: 'after',
            options: {
              icon: 'refresh',
              hint: 'Refrescar tabla',
              onClick: refreshGrid
            }
          })
        }}
        columns={[
          {
            dataField: 'code',
            caption: 'Cotización',
            width: 150,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <span className='fw-semibold'>{data.code || `#${data.id}`}</span>)
            }
          },
          {
            dataField: 'name',
            caption: 'Cliente',
            minWidth: 220,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <div>
                <span className='d-block fw-semibold'>{data.name}</span>
                <small className='text-muted'>{data.business || 'Sin empresa'}</small>
              </div>)
            }
          },
          {
            dataField: 'email',
            caption: 'Contacto',
            minWidth: 220,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <div>
                <span className='d-block'>{data.email}</span>
                <small className='text-muted'>{phoneDisplay(data)}</small>
              </div>)
            }
          },
          {
            dataField: 'total_items',
            caption: 'Items',
            width: 100,
            alignment: 'center',
            cellTemplate: (container, { data }) => {
              const items = normalizeItems(data.items)
              ReactAppend(container, <span className='badge bg-primary-subtle text-primary'>{items.length} ({data.total_items})</span>)
            }
          },
          {
            dataField: 'region',
            caption: 'Ubicación',
            minWidth: 180
          },
          {
            dataField: 'created_at',
            caption: 'Fecha',
            dataType: 'datetime',
            width: 170,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <span>{moment(data.created_at).format('LLL')}</span>)
            }
          },
          {
            dataField: 'quote_status',
            caption: 'Estado',
            width: 130,
            cellTemplate: (container, { data }) => {
              const meta = statusMeta(data.quote_status)
              ReactAppend(container, <span className={`badge ${meta.cls}`}>{meta.label}</span>)
            }
          },
          {
            caption: 'Acciones',
            width: 150,
            cellTemplate: (container, { data }) => {
              container.attr('style', 'display: flex; gap: 4px; overflow: unset')

              ReactAppend(container, <TippyButton className='btn btn-sm btn-soft-primary' title='Ver detalle' onClick={() => openDetails(data)}>
                <i className='mdi mdi-eye'></i>
              </TippyButton>)

              ReactAppend(container, <TippyButton className='btn btn-sm btn-soft-secondary' title='Ver PDF en nueva pestaña' onClick={() => viewPdf(data)}>
                <i className='mdi mdi-file-pdf-box'></i>
              </TippyButton>)

              ReactAppend(container, <TippyButton className='btn btn-sm btn-soft-danger' title='Eliminar' onClick={() => deleteQuote(data)}>
                <i className='mdi mdi-trash-can'></i>
              </TippyButton>)
            },
            allowFiltering: false,
            allowExporting: false
          }
        ]}
      />

      <Modal
        modalRef={modalRef}
        title={`Detalle de cotización ${selectedQuote?.code || ''}`.trim()}
        onClose={() => { setSelectedQuote(null); resetArchive() }}
        hideFooter
        size='lg'
      >
        {/* Resumen superior */}
        <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 rounded bg-light p-3 mb-3'>
          <div className='d-flex flex-wrap align-items-center gap-2'>
            <span className='badge bg-primary fs-6'>{selectedQuote?.code || `#${selectedQuote?.id || ''}`}</span>
            <span className='text-muted'>{selectedQuote?.created_at ? moment(selectedQuote.created_at).format('LLL') : ''}</span>
            <span className={`badge ${statusMeta(status).cls}`}>{statusMeta(status).label}</span>
            {(selectedQuote?.seen === false || selectedQuote?.seen === 0) && (
              <span className='badge bg-info-subtle text-info'>Nueva</span>
            )}
          </div>
          <button type='button' className='btn btn-sm btn-primary d-flex align-items-center gap-1' onClick={() => viewPdf(selectedQuote)}>
            <i className='mdi mdi-file-pdf-box'></i>
            Ver PDF
          </button>
        </div>

        {/* Seguimiento / estado */}
        <div className='border rounded p-3 mb-3'>
          <div className='d-flex flex-wrap align-items-center gap-2'>
            <span className='fw-semibold'>Seguimiento</span>
            <span className={`badge ${statusMeta(status).cls}`}>{statusMeta(status).label}</span>
            <div className='ms-auto d-flex flex-wrap gap-2'>
              {status === 'pendiente' && (
                <>
                  <button type='button' className='btn btn-sm btn-info text-white d-flex align-items-center gap-1' onClick={() => changeState(selectedQuote, 'contactado')}>
                    <i className='mdi mdi-account-check'></i> Marcar contactado
                  </button>
                  <button type='button' className='btn btn-sm btn-outline-secondary d-flex align-items-center gap-1' onClick={() => setArchiveMode(true)}>
                    <i className='mdi mdi-archive-arrow-down'></i> Archivar
                  </button>
                </>
              )}
              {status === 'contactado' && (
                <>
                  <button type='button' className='btn btn-sm btn-success d-flex align-items-center gap-1' onClick={() => changeState(selectedQuote, 'convertido')}>
                    <i className='mdi mdi-check-decagram'></i> Marcar convertido
                  </button>
                  <button type='button' className='btn btn-sm btn-outline-secondary d-flex align-items-center gap-1' onClick={() => setArchiveMode(true)}>
                    <i className='mdi mdi-archive-arrow-down'></i> Archivar
                  </button>
                </>
              )}
              {status === 'convertido' && (
                <span className='text-success small d-flex align-items-center gap-1'>
                  <i className='mdi mdi-check-decagram'></i> Cotización convertida
                </span>
              )}
              {status === 'archivado' && (
                <span className='text-muted small d-flex align-items-center gap-1'>
                  <i className='mdi mdi-archive'></i> Cotización archivada
                </span>
              )}
            </div>
          </div>

          {archiveMode && (status === 'pendiente' || status === 'contactado') && (
            <div className='mt-3'>
              <label className='form-label small fw-semibold mb-1'>Motivo de archivado</label>
              <textarea
                className='form-control'
                rows={2}
                value={archiveReason}
                onChange={(e) => setArchiveReason(e.target.value)}
                placeholder='Indica por qué se archiva esta cotización...'
              />
              <div className='d-flex gap-2 mt-2'>
                <button type='button' className='btn btn-sm btn-danger d-flex align-items-center gap-1' disabled={!archiveReason.trim()} onClick={confirmArchive}>
                  <i className='mdi mdi-archive-arrow-down'></i> Confirmar archivado
                </button>
                <button type='button' className='btn btn-sm btn-light' onClick={resetArchive}>Cancelar</button>
              </div>
            </div>
          )}

          {status === 'archivado' && selectedQuote?.archived_reason && (
            <div className='alert alert-secondary mt-3 mb-0 py-2 px-3'>
              <span className='fw-semibold'>Motivo de archivado:</span> {selectedQuote.archived_reason}
            </div>
          )}
        </div>

        <div className='row g-3'>
          <SectionTitle icon='mdi-account-tie'>Datos del cliente</SectionTitle>
          <Detail className='col-md-6' label='Nombre completo' value={selectedQuote?.name} />
          <Detail className='col-md-6' label='Razón social / Empresa' value={selectedQuote?.business} />
          <Detail className='col-md-3' label='RUC' value={selectedQuote?.ruc} />
          <Detail className='col-md-6' label='Correo electrónico' value={selectedQuote?.email} />
          <Detail className='col-md-3' label='Teléfono / WhatsApp' value={phoneDisplay(selectedQuote)} />

          <SectionTitle icon='mdi-map-marker'>Ubicación</SectionTitle>
          <Detail label='Departamento' value={selectedQuote?.department} />
          <Detail label='Provincia' value={selectedQuote?.province} />
          <Detail label='Distrito' value={selectedQuote?.district} />
          <Detail label='Ubigeo' value={selectedQuote?.ubigeo} />
          <Detail label='Aceptó términos' value={selectedQuote?.accepted_terms ? 'Sí' : 'No'} />

          <SectionTitle icon='mdi-package-variant-closed'>Productos cotizados</SectionTitle>
          <div className='col-12'>
            <div className='table-responsive'>
              <table className='table table-sm table-striped align-middle mb-0'>
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>#</th>
                    <th style={{ width: '56px' }}></th>
                    <th>Producto</th>
                    <th>SKU</th>
                    <th className='text-center' style={{ width: '80px' }}>Cantidad</th>
                    <th className='text-end' style={{ width: '110px' }}>P. unitario</th>
                    <th className='text-end' style={{ width: '120px' }}>Subtotal</th>
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
                        <td>
                          {item.image
                            ? <img src={item.image} alt={item.title} width={40} height={40} style={{ objectFit: 'cover', borderRadius: '6px' }} />
                            : <span className='text-muted'>—</span>}
                        </td>
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
                    {currencyTotals.map(([cur, total]) => (
                      <tr key={cur}>
                        <td colSpan={6} className='text-end fw-semibold'>Total estimado ({cur})</td>
                        <td className='text-end fw-bold text-primary'>{formatMoney(total, cur)}</td>
                      </tr>
                    ))}
                  </tfoot>
                )}
              </table>
            </div>
            {hasPricing && (
              <small className='text-muted d-block mt-1'>* Montos referenciales. El PDF entregado al cliente no incluye precios.</small>
            )}
          </div>

          <SectionTitle icon='mdi-information-outline'>Registro</SectionTitle>
          <Detail label='Dirección IP' value={selectedQuote?.ip_address} />
          <Detail label='Dispositivo' value={selectedQuote?.device_type} />
          <Detail label='Navegador' value={selectedQuote?.browser} />
          <Detail label='Sistema operativo' value={selectedQuote?.operating_system} />
        </div>
      </Modal>
    </>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Adminto {...properties} title='Cotizaciones'>
      <Quotes />
    </Adminto>
  )
})
