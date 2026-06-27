import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'
import AdminTable from '../Components/AdminTable.jsx'
import ConfirmModal from '../Components/ConfirmModal.jsx'
import ClubRest from '../Actions/Admin/ClubRest.js'

const clubRest = new ClubRest()

// Estilos propios de esta vista (badges + modal). La tabla trae los suyos.
const CLUB_CSS = `
.wfc-new{display:inline-flex;align-items:center;padding:2px 8px;border-radius:50rem;font-size:10px;font-weight:700;background:#004991;color:#fff;margin-left:6px;}
.wfc-act{width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;border:0;font-size:13px;transition:filter .15s;}
.wfc-act:hover{filter:brightness(.95);}
.wfc-act.edit{background:#e8f0ff;color:#3b82f6;}
.wfc-act.del{background:#fcebeb;color:#e24b4a;}
.wfc-h2{font-size:18px;font-weight:700;line-height:1.25;margin:0;color:#0f2540;}
.wfc-btn{height:36px;padding:0 14px;border-radius:10px;background:#004991;color:#fff;font-weight:600;font-size:13px;border:0;display:inline-flex;align-items:center;gap:6px;transition:background .2s;}
.wfc-btn:hover{background:#003b7a;color:#fff;}
.wfc-sec{border:1px solid #eef2f8;border-radius:12px;padding:16px;}
.wfc-sec h4{font-size:14px;font-weight:700;color:#0f2540;margin:0;}
.wfc-lbl{display:block;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#8a93a6;margin-bottom:2px;}
.wfc-val{font-size:13px;color:#1f2a44;word-break:break-word;margin:0;}
.wfc-modal-ovl{position:fixed;inset:0;z-index:1100;background:rgba(15,23,42,.5);display:flex;align-items:flex-start;justify-content:center;padding:3vh 12px;}
.wfc-modal{position:relative;width:min(880px,96vw);max-height:94vh;background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(15,37,64,.25);display:flex;flex-direction:column;overflow:hidden;}
.wfc-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid #eef2f8;flex-shrink:0;}
.wfc-modal-body{overflow-y:auto;padding:16px 20px;}
.wfc-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 20px;border-top:1px solid #eef2f8;flex-shrink:0;}
.wfc-close{width:36px;height:36px;border-radius:10px;border:0;background:none;color:#8a93a6;font-size:18px;}
.wfc-close:hover{background:#f4f8fd;color:#0f2540;}
`

const isUnseen = (m) => m?.seen === false || m?.seen === 0

const Detail = ({ label, value, full = false }) => (
  <div className={full ? 'col-12' : 'col-md-4 col-sm-6'}>
    <span className='wfc-lbl'>{label}</span>
    <p className='wfc-val'>{value || '-'}</p>
  </div>
)

const Club = () => {
  const tableRef = useRef(null)
  const [selected, setSelected] = useState(null)
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const markSeen = async (member) => {
    if (!isUnseen(member)) return
    const ok = await clubRest.seen(member.id)
    if (!ok) return
    tableRef.current?.patchRow(member.id, { seen: true })
    setSelected((cur) => (cur?.id === member.id ? { ...cur, seen: true } : cur))
    window.dispatchEvent(new CustomEvent('club:seen', { detail: { id: member.id } }))
  }

  const openDetails = async (member) => {
    setSelected(member)
    await markSeen(member)
  }

  const closeModal = () => setSelected(null)

  const askDelete = (member, event) => { if (event) event.stopPropagation(); setConfirmTarget(member) }

  const performDelete = async () => {
    const member = confirmTarget
    if (!member) return
    setDeleting(true)
    const ok = await clubRest.delete(member.id)
    setDeleting(false)
    if (!ok) return
    if (isUnseen(member)) window.dispatchEvent(new CustomEvent('club:seen', { detail: { id: member.id } }))
    if (selected?.id === member.id) closeModal()
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
      key: 'name', header: 'Experto', field: 'name', filterFields: ['name', 'dni'], nowrap: true,
      render: (m) => (<><span className='fw-semibold d-block'>{m.name}{isUnseen(m) && <span className='wfc-new'>Nuevo</span>}</span><small className='text-muted'>DNI / CE: {m.dni || '-'}</small></>),
    },
    { key: 'email', header: 'Correo', field: 'email', nowrap: true, render: (m) => <span>{m.email}</span> },
    { key: 'specialty', header: 'Especialidad', field: 'specialty', render: (m) => <span>{m.specialty || '-'}</span> },
    {
      key: 'district', header: 'Ubicación', field: 'district', filterFields: ['district', 'province', 'department'], nowrap: true,
      render: (m) => (<><span className='fw-semibold d-block'>{m.district || '-'}</span><small className='text-muted'>{[m.province, m.department].filter(Boolean).join(', ') || '-'}</small></>),
    },
    { key: 'created_at', header: 'Fecha', field: 'created_at', filterType: 'date', sortField: 'created_at', nowrap: true, width: 138, render: (m) => <span style={{ color: '#5b6577' }}>{m.created_at ? moment(m.created_at).format('DD/MM/YY HH:mm') : '-'}</span> },
    {
      key: 'actions', header: 'Acciones', align: 'center', filterable: false,
      render: (m) => (
        <div className='d-flex align-items-center justify-content-center gap-1'>
          <button className='wfc-act edit' title='Ver detalle' onClick={stop(() => openDetails(m))}><i className='mdi mdi-eye'></i></button>
          <button className='wfc-act del' title='Eliminar' onClick={(e) => askDelete(m, e)}><i className='mdi mdi-trash-can'></i></button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <style>{CLUB_CSS}</style>

      <AdminTable
        ref={tableRef}
        rest={clubRest}
        title='Solicitudes del Club Experto'
        icon='ti ti-users-group'
        countSuffix='solicitudes'
        defaultSort={[{ selector: 'created_at', desc: true }]}
        minWidth={920}
        columns={columns}
        rowClassName={(m) => (isUnseen(m) ? 'at-row-unseen' : '')}
        onRowClick={openDetails}
      />

      {selected && (
        <div className='wfc-modal-ovl' onMouseDown={closeModal}>
          <div className='wfc-modal' onMouseDown={(e) => e.stopPropagation()}>
            <div className='wfc-modal-head'>
              <h3 className='wfc-h2' style={{ fontSize: 16 }}>
                <i className='mdi mdi-account-star me-1' style={{ color: '#004991' }}></i>
                {selected.name}
                {isUnseen(selected) && <span className='wfc-new'>Nuevo</span>}
              </h3>
              <button className='wfc-close' onClick={closeModal}><i className='mdi mdi-close'></i></button>
            </div>

            <div className='wfc-modal-body'>
              <div className='row g-3'>
                <div className='col-12'>
                  <div className='wfc-sec'>
                    <h4 className='mb-3'><i className='mdi mdi-account-tie me-1' style={{ color: '#004991' }}></i>Datos del experto</h4>
                    <div className='row g-3'>
                      <Detail label='Nombre completo' value={selected.name} />
                      <Detail label='DNI / CE' value={selected.dni} />
                      <Detail label='Correo electrónico' value={selected.email} />
                      <Detail label='Especialidad' value={selected.specialty} />
                      <Detail label='Fecha de registro' value={selected.created_at ? moment(selected.created_at).format('LLL') : '-'} />
                    </div>
                  </div>
                </div>

                <div className='col-12'>
                  <div className='wfc-sec'>
                    <h4 className='mb-3'><i className='mdi mdi-map-marker me-1' style={{ color: '#004991' }}></i>Ubicación</h4>
                    <div className='row g-3'>
                      <Detail label='Departamento' value={selected.department} />
                      <Detail label='Provincia' value={selected.province} />
                      <Detail label='Distrito' value={selected.district} />
                      <Detail label='Código ubigeo' value={selected.ubigeo} />
                    </div>
                  </div>
                </div>

                <div className='col-12'>
                  <div className='wfc-sec'>
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

            <div className='wfc-modal-foot'>
              <button type='button' className='wfc-btn' onClick={closeModal}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirmTarget}
        title='Eliminar solicitud'
        message={confirmTarget ? `Se eliminará la solicitud de ${confirmTarget.name}. Esta acción no se puede deshacer.` : ''}
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
    <Adminto {...properties} title='Club experto'>
      <Club />
    </Adminto>
  )
})
