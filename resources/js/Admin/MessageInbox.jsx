import React, { useEffect, useRef, useState } from 'react'
import AdminTable from '../Components/AdminTable.jsx'
import ConfirmModal from '../Components/ConfirmModal.jsx'

const INBOX_CSS = `
.wfm-new{display:inline-flex;align-items:center;padding:2px 8px;border-radius:50rem;font-size:10px;font-weight:700;background:#004991;color:#fff;margin-left:6px;}
.wfm-act{width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;border:0;font-size:13px;transition:filter .15s;}
.wfm-act:hover{filter:brightness(.95);}
.wfm-act.edit{background:#e8f0ff;color:#3b82f6;}
.wfm-act.del{background:#fcebeb;color:#e24b4a;}
.wfm-h2{font-size:18px;font-weight:700;line-height:1.25;margin:0;color:#0f2540;}
.wfm-btn{height:36px;padding:0 14px;border-radius:10px;background:#004991;color:#fff;font-weight:600;font-size:13px;border:0;display:inline-flex;align-items:center;gap:6px;transition:background .2s;}
.wfm-btn:hover{background:#003b7a;color:#fff;}
.wfm-sec{border:1px solid #eef2f8;border-radius:12px;padding:16px;}
.wfm-sec h4{font-size:14px;font-weight:700;color:#0f2540;margin:0;}
.wfm-lbl{display:block;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#8a93a6;margin-bottom:2px;}
.wfm-val{font-size:13px;color:#1f2a44;word-break:break-word;margin:0;white-space:pre-wrap;}
.wfm-modal-ovl{position:fixed;inset:0;z-index:1100;background:rgba(15,23,42,.5);display:flex;align-items:flex-start;justify-content:center;padding:3vh 12px;}
.wfm-modal{position:relative;width:min(880px,96vw);max-height:94vh;background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(15,37,64,.25);display:flex;flex-direction:column;overflow:hidden;}
.wfm-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid #eef2f8;flex-shrink:0;}
.wfm-modal-body{overflow-y:auto;padding:16px 20px;}
.wfm-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 20px;border-top:1px solid #eef2f8;flex-shrink:0;}
.wfm-close{width:36px;height:36px;border-radius:10px;border:0;background:none;color:#8a93a6;font-size:18px;}
.wfm-close:hover{background:#f4f8fd;color:#0f2540;}
`

const isUnseen = (m) => m?.seen === false || m?.seen === 0

const Detail = ({ label, value, full = false }) => (
  <div className={full ? 'col-12' : 'col-md-4 col-sm-6'}>
    <span className='wfm-lbl'>{label}</span>
    <p className='wfm-val'>{value || '-'}</p>
  </div>
)

const MessageInbox = ({ badgeEvent, rest, title, icon = 'ti ti-message-dots', countSuffix = 'mensajes' }) => {
  const tableRef = useRef(null)
  const [selected, setSelected] = useState(null)
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const markSeen = async (message) => {
    if (!isUnseen(message)) return
    const ok = await rest.seen(message.id)
    if (!ok) return
    tableRef.current?.patchRow(message.id, { seen: true })
    setSelected((cur) => (cur?.id === message.id ? { ...cur, seen: true } : cur))
    window.dispatchEvent(new CustomEvent(badgeEvent, { detail: { id: message.id } }))
  }

  const openDetails = async (message) => {
    setSelected(message)
    await markSeen(message)
  }

  const closeModal = () => setSelected(null)

  const askDelete = (message, event) => { if (event) event.stopPropagation(); setConfirmTarget(message) }

  const performDelete = async () => {
    const message = confirmTarget
    if (!message) return
    setDeleting(true)
    const ok = await rest.delete(message.id)
    setDeleting(false)
    if (!ok) return
    if (isUnseen(message)) window.dispatchEvent(new CustomEvent(badgeEvent, { detail: { id: message.id } }))
    if (selected?.id === message.id) closeModal()
    setConfirmTarget(null)
    tableRef.current?.reload()
  }

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected])

  const stop = (fn) => (e) => { e.stopPropagation(); fn() }

  const columns = [
    {
      key: 'name', header: 'Contacto', field: 'name', filterFields: ['name', 'business'], nowrap: true,
      render: (m) => (<><span className='fw-semibold d-block'>{m.name}{isUnseen(m) && <span className='wfm-new'>Nuevo</span>}</span><small className='text-muted'>{m.business || 'Sin empresa'}</small></>),
    },
    { key: 'email', header: 'Correo', field: 'email', nowrap: true, render: (m) => <span>{m.email}</span> },
    { key: 'service', header: 'Motivo', field: 'service', render: (m) => <span>{m.service || '-'}</span> },
    { key: 'created_at', header: 'Fecha', field: 'created_at', filterType: 'date', sortField: 'created_at', nowrap: true, width: 138, render: (m) => <span style={{ color: '#5b6577' }}>{m.created_at ? moment(m.created_at).format('DD/MM/YY HH:mm') : '-'}</span> },
    {
      key: 'actions', header: 'Acciones', align: 'center', filterable: false,
      render: (m) => (
        <div className='d-flex align-items-center justify-content-center gap-1'>
          <button className='wfm-act edit' title='Ver detalle' onClick={stop(() => openDetails(m))}><i className='mdi mdi-eye'></i></button>
          <button className='wfm-act del' title='Eliminar' onClick={(e) => askDelete(m, e)}><i className='mdi mdi-trash-can'></i></button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <style>{INBOX_CSS}</style>

      <AdminTable
        ref={tableRef}
        rest={rest}
        title={`Lista de ${title.toLowerCase()}`}
        icon={icon}
        countSuffix={countSuffix}
        defaultSort={[{ selector: 'created_at', desc: true }]}
        minWidth={820}
        columns={columns}
        rowClassName={(m) => (isUnseen(m) ? 'at-row-unseen' : '')}
        onRowClick={openDetails}
      />

      {selected && (
        <div className='wfm-modal-ovl' onMouseDown={closeModal}>
          <div className='wfm-modal' onMouseDown={(e) => e.stopPropagation()}>
            <div className='wfm-modal-head'>
              <h3 className='wfm-h2' style={{ fontSize: 16 }}>
                <i className='mdi mdi-email-outline me-1' style={{ color: '#004991' }}></i>
                {selected.name}
                {isUnseen(selected) && <span className='wfm-new'>Nuevo</span>}
              </h3>
              <button className='wfm-close' onClick={closeModal}><i className='mdi mdi-close'></i></button>
            </div>

            <div className='wfm-modal-body'>
              <div className='row g-3'>
                <div className='col-12'>
                  <div className='wfm-sec'>
                    <h4 className='mb-3'><i className='mdi mdi-account-tie me-1' style={{ color: '#004991' }}></i>Datos del contacto</h4>
                    <div className='row g-3'>
                      <Detail label='Nombre' value={selected.name} />
                      <Detail label='Correo electrónico' value={selected.email} />
                      <Detail label='Empresa' value={selected.business} />
                      <Detail label='Motivo de consulta' value={selected.service} />
                      <Detail label='Origen' value={selected.source} />
                      <Detail label='Fecha' value={selected.created_at ? moment(selected.created_at).format('LLL') : '-'} />
                      <Detail full label='Mensaje' value={selected.message} />
                    </div>
                  </div>
                </div>

                <div className='col-12'>
                  <div className='wfm-sec'>
                    <h4 className='mb-3'><i className='mdi mdi-information-outline me-1' style={{ color: '#004991' }}></i>Registro</h4>
                    <div className='row g-3'>
                      <Detail label='Dirección IP' value={selected.ip_address} />
                      <Detail label='Dispositivo' value={selected.device_type} />
                      <Detail label='Navegador' value={selected.browser} />
                      <Detail label='Sistema operativo' value={selected.operating_system} />
                      <Detail full label='User agent' value={selected.user_agent} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='wfm-modal-foot'>
              <button type='button' className='wfm-btn' onClick={closeModal}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirmTarget}
        title='Eliminar registro'
        message={confirmTarget ? `Se eliminará el registro de ${confirmTarget.name}. Esta acción no se puede deshacer.` : ''}
        confirmLabel='Eliminar'
        variant='danger'
        loading={deleting}
        onConfirm={performDelete}
        onCancel={() => { if (!deleting) setConfirmTarget(null) }}
      />
    </div>
  )
}

export default MessageInbox
