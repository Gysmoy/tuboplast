import React, { useEffect, useMemo, useRef, useState } from 'react'
import Adminto from '../Components/Adminto.jsx'
import AdminTable from '../Components/AdminTable.jsx'
import ConfirmModal from '../Components/ConfirmModal.jsx'
import InputFormGroup from '../Components/Form/InputFormGroup.jsx'
import TextareaFormGroup from '../Components/Form/TextareaFormGroup.jsx'
import SwitchFormGroup from '../Components/Form/SwitchFormGroup.jsx'
import ProductTaxonomyRest from '../Actions/Admin/ProductTaxonomyRest.js'

const TAXONOMY_CSS = `
.wtx-act{width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;border:0;font-size:13px;transition:filter .15s;}
.wtx-act:hover{filter:brightness(.95);}
.wtx-act.edit{background:#e8f0ff;color:#3b82f6;}
.wtx-act.del{background:#fcebeb;color:#e24b4a;}
.wtx-btn{height:40px;padding:0 14px;border-radius:12px;background:#004991;color:#fff;font-weight:600;font-size:13px;border:0;display:inline-flex;align-items:center;gap:6px;transition:background .2s;}
.wtx-btn:hover{background:#003b7a;color:#fff;}
.wtx-btn.foot{height:38px;border-radius:10px;}
.wtx-btn:disabled{opacity:.65;cursor:default;}
.wtx-btn.outline{background:#fff;border:1px solid #dce5f0;color:#5b6577;}.wtx-btn.outline:hover{background:#f4f8fd;color:#0f2540;}
.wtx-h2{font-size:18px;font-weight:700;line-height:1.25;margin:0;color:#0f2540;}
.wtx-sec{border:1px solid #eef2f8;border-radius:12px;padding:16px;}
.wtx-sec h4{font-size:14px;font-weight:700;color:#0f2540;margin:0 0 14px;display:flex;align-items:center;}
.wtx-modal-ovl{position:fixed;inset:0;z-index:1100;background:rgba(15,23,42,.5);display:flex;align-items:flex-start;justify-content:center;padding:3vh 12px;}
.wtx-modal{position:relative;width:min(620px,96vw);max-height:94vh;background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(15,37,64,.25);display:flex;flex-direction:column;overflow:hidden;}
.wtx-modal form{display:flex;flex-direction:column;min-height:0;flex:1;}
.wtx-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid #eef2f8;flex-shrink:0;}
.wtx-modal-body{overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:14px;flex:1;}
.wtx-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 20px;border-top:1px solid #eef2f8;flex-shrink:0;}
.wtx-close{width:36px;height:36px;border-radius:10px;border:0;background:none;color:#8a93a6;font-size:18px;}
.wtx-close:hover{background:#f4f8fd;color:#0f2540;}
.wtx-modal .form-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#8a93a6;margin-bottom:3px;}
.wtx-err{display:flex;align-items:center;gap:8px;background:#fcebeb;color:#b42318;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:500;}
`

const ProductTaxonomyPage = ({ path, title, singular, icon = 'ti ti-list-details', ...properties }) => {
  const tableRef = useRef(null)
  const nameRef = useRef()
  const descriptionRef = useRef()
  const rest = useMemo(() => new ProductTaxonomyRest(path), [path])

  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const setFormValues = (data = null) => {
    if (nameRef.current) nameRef.current.value = data?.name || ''
    if (descriptionRef.current) descriptionRef.current.value = data?.description || ''
  }

  const onModalOpen = (data = null) => {
    setDataLoaded(data)
    setFormError('')
    setFormOpen(true)
    setTimeout(() => setFormValues(data), 30)
  }

  const closeForm = () => {
    if (loading) return
    setFormOpen(false)
    setDataLoaded(null)
    setFormError('')
  }

  useEffect(() => {
    document.body.style.overflow = formOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [formOpen])

  const performDelete = async () => {
    const item = confirmTarget
    if (!item) return
    setDeleting(true)
    const ok = await rest.delete(item.id)
    setDeleting(false)
    if (!ok) return
    setConfirmTarget(null)
    tableRef.current?.reload()
  }

  const onSaveSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    const name = nameRef.current.value.trim()
    if (!name) {
      setFormError(`El nombre de ${singular.toLowerCase()} es obligatorio.`)
      return
    }

    setFormError('')
    setLoading(true)
    const result = await rest.save({
      id: dataLoaded?.id,
      name,
      description: descriptionRef.current.value,
      status: true,
    })
    setLoading(false)

    if (!result) return
    setFormOpen(false)
    setDataLoaded(null)
    tableRef.current?.reload()
  }

  return (
    <Adminto {...properties} title={title}>
      <style>{TAXONOMY_CSS}</style>
      <AdminTable
        ref={tableRef}
        rest={rest}
        title={`Lista de ${title.toLowerCase()}`}
        icon={icon}
        countSuffix={title.toLowerCase()}
        defaultSort={[{ selector: 'name', desc: false }]}
        minWidth={760}
        headerActions={<button type='button' className='wtx-btn' onClick={() => onModalOpen(null)}><i className='mdi mdi-plus'></i> Nuevo</button>}
        columns={[
          { key: 'name', header: 'Nombre', field: 'name', nowrap: true, render: (d) => <span className='fw-semibold'>{d.name}</span> },
          { key: 'description', header: 'Descripcion', field: 'description', render: (d) => <span style={{ color: '#5b6577' }}>{d.description || '-'}</span> },
          {
            key: 'status', header: 'Estado', field: 'status', align: 'center',
            filterOptions: [{ value: '1', label: 'Activo' }, { value: '0', label: 'Inactivo' }],
            render: (d) => {
              const isActive = d.status === true || d.status === 1 || d.status === '1'
              return (
                <SwitchFormGroup id={`switch-${path}-${d.id}`} checked={isActive} noMargin
                  onChange={async () => { await rest.status({ id: d.id, status: isActive }); tableRef.current?.reload() }} />
              )
            },
          },
          { key: 'created_at', header: 'Fecha', field: 'created_at', filterType: 'date', sortField: 'created_at', nowrap: true, width: 138, render: (d) => <span style={{ color: '#5b6577' }}>{d.created_at ? moment(d.created_at).format('DD/MM/YY') : '-'}</span> },
          {
            key: 'actions', header: 'Acciones', align: 'center', filterable: false, sortable: false,
            render: (d) => (
              <div className='d-flex align-items-center justify-content-center gap-1'>
                <button className='wtx-act edit' title='Editar' onClick={() => onModalOpen(d)}><i className='mdi mdi-square-edit-outline'></i></button>
                <button className='wtx-act del' title='Eliminar' onClick={(e) => { e.stopPropagation(); setConfirmTarget(d) }}><i className='mdi mdi-trash-can'></i></button>
              </div>
            ),
          },
        ]}
      />

      <div className='wtx-modal-ovl' style={{ display: formOpen ? 'flex' : 'none' }} onMouseDown={closeForm}>
        <div className='wtx-modal' onMouseDown={(e) => e.stopPropagation()}>
          <form onSubmit={onSaveSubmit}>
            <div className='wtx-modal-head'>
              <h3 className='wtx-h2' style={{ fontSize: 16 }}>
                <i className={`mdi ${dataLoaded ? 'mdi-square-edit-outline' : 'mdi-plus-box'} me-1`} style={{ color: '#004991' }}></i>
                {dataLoaded ? `Editar ${singular}` : `Nuevo ${singular}`}
              </h3>
              <button type='button' className='wtx-close' onClick={closeForm}><i className='mdi mdi-close'></i></button>
            </div>

            <div className='wtx-modal-body'>
              {formError && <div className='wtx-err'><i className='mdi mdi-alert-circle-outline'></i>{formError}</div>}
              <div className='wtx-sec'>
                <h4><i className='mdi mdi-shape-outline me-1' style={{ color: '#004991' }}></i>Datos</h4>
                <InputFormGroup eRef={nameRef} label='Nombre' required />
                <TextareaFormGroup eRef={descriptionRef} label='Descripcion' rows={4} />
              </div>
            </div>

            <div className='wtx-modal-foot'>
              <button type='button' className='wtx-btn outline foot' onClick={closeForm} disabled={loading}>Cancelar</button>
              <button type='submit' className='wtx-btn foot' disabled={loading}>
                {loading
                  ? <><span className='spinner-border spinner-border-sm'></span> Guardando...</>
                  : <><i className='mdi mdi-content-save'></i> {dataLoaded ? 'Guardar cambios' : 'Crear'}</>}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        open={!!confirmTarget}
        title={`Eliminar ${singular}`}
        message={confirmTarget ? `Se eliminara "${confirmTarget.name}". Esta accion no se puede deshacer.` : ''}
        confirmLabel='Eliminar'
        variant='danger'
        loading={deleting}
        onConfirm={performDelete}
        onCancel={() => { if (!deleting) setConfirmTarget(null) }}
      />
    </Adminto>
  )
}

export default ProductTaxonomyPage
