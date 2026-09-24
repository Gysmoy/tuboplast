import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'
import AdminTable from '../Components/AdminTable.jsx'
import ConfirmModal from '../Components/ConfirmModal.jsx'
import InputFormGroup from '../Components/Form/InputFormGroup.jsx'
import SwitchFormGroup from '../Components/Form/SwitchFormGroup.jsx'
import WhatsappNumbersRest from '../Actions/Admin/WhatsappNumbersRest.js'

const whatsappNumbersRest = new WhatsappNumbersRest()

const WFD_CSS = `
.wfd-act{width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;border:0;font-size:13px;transition:filter .15s;}
.wfd-act:hover{filter:brightness(.95);}
.wfd-act.edit{background:#e8f0ff;color:#3b82f6;}
.wfd-act.del{background:#fcebeb;color:#e24b4a;}
.wfd-chip{display:inline-flex;align-items:center;padding:3px 10px;border-radius:50rem;font-size:11px;font-weight:600;background:#e6effa;color:#004991;}
.wfd-chip.primary{background:#e6f7ea;color:#1e7e34;}
.wfd-btn{height:40px;padding:0 14px;border-radius:12px;background:#004991;color:#fff;font-weight:600;font-size:13px;border:0;display:inline-flex;align-items:center;gap:6px;transition:background .2s;}
.wfd-btn:hover{background:#003b7a;color:#fff;}
.wfd-btn.foot{height:38px;border-radius:10px;}
.wfd-btn:disabled{opacity:.65;cursor:default;}
.wfd-btn.outline{background:#fff;border:1px solid #dce5f0;color:#5b6577;}.wfd-btn.outline:hover{background:#f4f8fd;color:#0f2540;}
.wfd-h2{font-size:18px;font-weight:700;line-height:1.25;margin:0;color:#0f2540;}
.wfd-modal-ovl{position:fixed;inset:0;z-index:1100;background:rgba(15,23,42,.5);display:flex;align-items:flex-start;justify-content:center;padding:3vh 12px;}
.wfd-modal{position:relative;width:min(560px,96vw);max-height:94vh;background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(15,37,64,.25);display:flex;flex-direction:column;overflow:hidden;}
.wfd-modal form{display:flex;flex-direction:column;min-height:0;flex:1;}
.wfd-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid #eef2f8;flex-shrink:0;}
.wfd-modal-body{overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:6px;flex:1;}
.wfd-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 20px;border-top:1px solid #eef2f8;flex-shrink:0;}
.wfd-close{width:36px;height:36px;border-radius:10px;border:0;background:none;color:#8a93a6;font-size:18px;}
.wfd-close:hover{background:#f4f8fd;color:#0f2540;}
.wfd-modal .form-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#8a93a6;margin-bottom:3px;}
.wfd-err{display:flex;align-items:center;gap:8px;background:#fcebeb;color:#b42318;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:500;}
`

const WhatsappNumbers = () => {
  const tableRef = useRef(null)
  const tagRef = useRef()
  const titleRef = useRef()
  const phoneRef = useRef()

  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(null)
  const [isPrimary, setIsPrimary] = useState(false)
  const [status, setStatus] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const resetForm = () => {
    setDataLoaded(null)
    setIsPrimary(false)
    setStatus(true)
    setFormError('')
    setIsModalOpen(false)
    if (tagRef.current) tagRef.current.value = ''
    if (titleRef.current) titleRef.current.value = ''
    if (phoneRef.current) phoneRef.current.value = ''
  }

  const closeForm = () => { if (!loading) resetForm() }

  const onModalOpen = (data = null) => {
    setDataLoaded(data)
    setFormError('')
    setIsPrimary(!!data?.is_primary)
    setStatus(data?.status == null ? true : data.status === true || data.status === 1 || data.status === '1')
    setIsModalOpen(true)
    setTimeout(() => {
      if (tagRef.current) tagRef.current.value = data?.tag || ''
      if (titleRef.current) titleRef.current.value = data?.title || ''
      if (phoneRef.current) phoneRef.current.value = data?.phone || ''
    }, 30)
  }

  const askDelete = (row, event) => { if (event) event.stopPropagation(); setConfirmTarget(row) }

  const performDelete = async () => {
    const row = confirmTarget
    if (!row) return
    setDeleting(true)
    const ok = await whatsappNumbersRest.delete(row.id)
    setDeleting(false)
    if (!ok) return
    setConfirmTarget(null)
    tableRef.current?.reload()
  }

  const onSetPrimary = async (row) => {
    const ok = await whatsappNumbersRest.setPrimary({ id: row.id })
    if (!ok) return
    tableRef.current?.reload()
  }

  const onSaveSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    if (!titleRef.current.value.trim() || !phoneRef.current.value.trim()) {
      setFormError('Completa el título y el número de WhatsApp.')
      return
    }

    setFormError('')
    setLoading(true)
    const result = await whatsappNumbersRest.save({
      id: dataLoaded?.id,
      tag: tagRef.current.value,
      title: titleRef.current.value,
      phone: phoneRef.current.value,
      is_primary: isPrimary,
      status,
    })
    setLoading(false)

    if (!result) return
    tableRef.current?.reload()
    resetForm()
  }

  const columns = [
    {
      key: 'title', header: 'WhatsApp', field: 'title', filterFields: ['title', 'tag', 'phone'], nowrap: true,
      render: (d) => (
        <>
          <span className='fw-semibold d-block'>
            {d.title}
            {!!d.is_primary && <span className='wfd-chip primary ms-2'><i className='mdi mdi-star me-1'></i>Principal</span>}
          </span>
          <small className='text-muted'>{d.tag ? `#${d.tag} · ` : ''}{d.phone}</small>
        </>
      ),
    },
    {
      key: 'is_primary', header: 'Botón flotante', align: 'center', filterable: false, sortable: false,
      render: (d) => (
        !d.is_primary
          ? <button className='wfd-btn outline' style={{ height: 32, fontSize: 12 }} onClick={() => onSetPrimary(d)}>Usar como principal</button>
          : <span className='text-success fw-semibold'><i className='mdi mdi-check-circle me-1'></i>En uso</span>
      ),
    },
    {
      key: 'status', header: 'Estado', field: 'status', align: 'center',
      filterOptions: [{ value: '1', label: 'Activo' }, { value: '0', label: 'Inactivo' }],
      render: (d) => {
        const isActive = d.status === true || d.status === 1 || d.status === '1'
        return (
          <SwitchFormGroup id={`switch-whatsapp-${d.id}`} checked={isActive} refreshable={isActive} noMargin
            onChange={async (event) => { await whatsappNumbersRest.status({ id: d.id, status: !event.currentTarget.checked }); tableRef.current?.reload() }} />
        )
      },
    },
    {
      key: 'actions', header: 'Acciones', align: 'center', filterable: false, sortable: false,
      render: (d) => (
        <div className='d-flex align-items-center justify-content-center gap-1'>
          <button className='wfd-act edit' title='Editar' onClick={() => onModalOpen(d)}><i className='mdi mdi-square-edit-outline'></i></button>
          <button className='wfd-act del' title='Eliminar' onClick={(e) => askDelete(d, e)}><i className='mdi mdi-trash-can'></i></button>
        </div>
      ),
    },
  ]

  return (
    <>
      <style>{WFD_CSS}</style>
      <AdminTable
        ref={tableRef}
        rest={whatsappNumbersRest}
        title='Números de WhatsApp'
        icon='mdi mdi-whatsapp'
        countSuffix='números'
        defaultSort={[{ selector: 'is_primary', desc: true }]}
        minWidth={720}
        headerActions={(
          <button type='button' className='wfd-btn' onClick={() => onModalOpen(null)}><i className='mdi mdi-plus'></i> Nuevo WhatsApp</button>
        )}
        columns={columns}
      />

      <div className='wfd-modal-ovl' style={{ display: isModalOpen ? 'flex' : 'none' }} onMouseDown={closeForm}>
        <div className='wfd-modal' onMouseDown={(e) => e.stopPropagation()}>
          <form onSubmit={onSaveSubmit}>
            <div className='wfd-modal-head'>
              <h3 className='wfd-h2' style={{ fontSize: 16 }}>
                <i className={`mdi ${dataLoaded ? 'mdi-square-edit-outline' : 'mdi-plus-box'} me-1`} style={{ color: '#004991' }}></i>
                {dataLoaded ? 'Editar WhatsApp' : 'Nuevo WhatsApp'}
              </h3>
              <button type='button' className='wfd-close' onClick={closeForm}><i className='mdi mdi-close'></i></button>
            </div>

            <div className='wfd-modal-body'>
              {formError && <div className='wfd-err'><i className='mdi mdi-alert-circle-outline'></i>{formError}</div>}

              <div className='row'>
                <InputFormGroup col='col-md-12' eRef={titleRef} label='Título' placeholder='Ej. WhatsApp corporativo' required />
                <InputFormGroup col='col-md-6' eRef={tagRef} label='Tag interno' placeholder='Ej. corporativo' />
                <InputFormGroup col='col-md-6' eRef={phoneRef} label='Número (con código de país)' placeholder='51947389121' required />
                <SwitchFormGroup col='col-md-6' id='whatsapp-is-primary' label='Usar en el botón flotante' checked={isPrimary} refreshable={isPrimary}
                  onChange={(event) => setIsPrimary(event.currentTarget.checked)} />
                <SwitchFormGroup col='col-md-6' id='whatsapp-status' label='Activo' checked={status} refreshable={status}
                  onChange={(event) => setStatus(event.currentTarget.checked)} />
              </div>
            </div>

            <div className='wfd-modal-foot'>
              <button type='button' className='wfd-btn outline foot' onClick={closeForm} disabled={loading}>Cancelar</button>
              <button type='submit' className='wfd-btn foot' disabled={loading}>
                {loading
                  ? <><span className='spinner-border spinner-border-sm'></span> Guardando...</>
                  : <><i className='mdi mdi-content-save'></i> {dataLoaded ? 'Guardar cambios' : 'Crear WhatsApp'}</>}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        open={!!confirmTarget}
        title='Eliminar WhatsApp'
        message={confirmTarget ? `Se eliminará el WhatsApp "${confirmTarget.title}". Esta acción no se puede deshacer.` : ''}
        confirmLabel='Eliminar'
        variant='danger'
        loading={deleting}
        onConfirm={performDelete}
        onCancel={() => { if (!deleting) setConfirmTarget(null) }}
      />
    </>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Adminto {...properties} title='Números de WhatsApp'>
      <WhatsappNumbers {...properties} />
    </Adminto>
  )
})
