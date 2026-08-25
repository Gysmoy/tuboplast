import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'
import AdminTable from '../Components/AdminTable.jsx'
import ConfirmModal from '../Components/ConfirmModal.jsx'
import ImageFormGroup from '../Components/Form/ImageFormGroup.jsx'
import InputFormGroup from '../Components/Form/InputFormGroup.jsx'
import SwitchFormGroup from '../Components/Form/SwitchFormGroup.jsx'
import TextareaFormGroup from '../Components/Form/TextareaFormGroup.jsx'
import ProductSegmentsRest from '../Actions/Admin/ProductSegmentsRest.js'

const rest = new ProductSegmentsRest()
const FALLBACK_IMAGE = '/assets/img/categories/category-1.webp'
const imageUrl = (image) => {
  if (!image) return FALLBACK_IMAGE
  if (/^(https?:)?\/\//.test(image) || image.startsWith('/')) return image
  if (image.startsWith('assets/')) return `/${image}`
  return `/storage/${image}`
}

const CSS = `
.wseg-act{width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;border:0;font-size:13px;transition:filter .15s;}
.wseg-act:hover{filter:brightness(.95);}
.wseg-act.edit{background:#e8f0ff;color:#3b82f6;}
.wseg-act.del{background:#fcebeb;color:#e24b4a;}
.wseg-thumb{width:70px;height:46px;object-fit:cover;border-radius:8px;border:1px solid #eef2f8;}
.wseg-btn{height:40px;padding:0 14px;border-radius:12px;background:#004991;color:#fff;font-weight:600;font-size:13px;border:0;display:inline-flex;align-items:center;gap:6px;transition:background .2s;}
.wseg-btn:hover{background:#003b7a;color:#fff;}
.wseg-btn.foot{height:38px;border-radius:10px;}
.wseg-btn:disabled{opacity:.65;cursor:default;}
.wseg-btn.outline{background:#fff;border:1px solid #dce5f0;color:#5b6577;}.wseg-btn.outline:hover{background:#f4f8fd;color:#0f2540;}
.wseg-h2{font-size:18px;font-weight:700;line-height:1.25;margin:0;color:#0f2540;}
.wseg-modal-ovl{position:fixed;inset:0;z-index:1100;background:rgba(15,23,42,.5);display:flex;align-items:flex-start;justify-content:center;padding:3vh 12px;}
.wseg-modal{position:relative;width:min(820px,96vw);max-height:94vh;background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(15,37,64,.25);display:flex;flex-direction:column;overflow:hidden;}
.wseg-modal form{display:flex;flex-direction:column;min-height:0;flex:1;}
.wseg-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid #eef2f8;flex-shrink:0;}
.wseg-modal-body{overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:14px;flex:1;}
.wseg-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 20px;border-top:1px solid #eef2f8;flex-shrink:0;}
.wseg-close{width:36px;height:36px;border-radius:10px;border:0;background:none;color:#8a93a6;font-size:18px;}
.wseg-close:hover{background:#f4f8fd;color:#0f2540;}
.wseg-modal .form-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#8a93a6;margin-bottom:3px;}
.wseg-sec{border:1px solid #eef2f8;border-radius:12px;padding:16px;}
.wseg-sec h4{font-size:14px;font-weight:700;color:#0f2540;margin:0 0 14px;display:flex;align-items:center;}
.wseg-err{display:flex;align-items:center;gap:8px;background:#fcebeb;color:#b42318;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:500;}
.wseg-count{display:inline-flex;align-items:center;justify-content:center;min-width:34px;height:28px;padding:0 10px;border-radius:999px;background:#eaf4ff;color:#004991;font-weight:700;font-size:13px;}
.wseg-count.empty{background:#fff1f2;color:#e24b4a;}
`

const boolOf = (value) => value === true || value === 1 || value === '1'
const activeItemsCount = (segment) => Number(segment?.active_items_count ?? 0)

const ProductSegments = (properties) => {
  const tableRef = useRef(null)
  const nameRef = useRef()
  const descriptionRef = useRef()
  const featuredOrderRef = useRef()
  const imageRef = useRef()

  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(null)
  const [featured, setFeatured] = useState(false)
  const [status, setStatus] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    document.body.style.overflow = formOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [formOpen])

  const setFormValues = (data = null) => {
    if (nameRef.current) nameRef.current.value = data?.name || ''
    if (descriptionRef.current) descriptionRef.current.value = data?.description || ''
    if (featuredOrderRef.current) featuredOrderRef.current.value = data?.featured_order ?? 0
    if (imageRef.current) imageRef.current.value = ''
    if (imageRef.current?.image) imageRef.current.image.src = imageUrl(data?.image)
    setFeatured(boolOf(data?.featured))
    setStatus(data?.status == null ? true : boolOf(data.status))
  }

  const openForm = (data = null) => {
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

  const save = async (event) => {
    event.preventDefault()
    if (loading) return

    const payload = {
      id: dataLoaded?.id,
      name: nameRef.current.value.trim(),
      description: descriptionRef.current.value,
      featured_order: featuredOrderRef.current.value || 0,
      featured,
      status,
      image: imageRef.current.files?.[0] ?? null,
    }

    if (!payload.name) {
      setFormError('El nombre de segmento es obligatorio.')
      return
    }

    setLoading(true)
    const result = await rest.save(payload)
    setLoading(false)
    if (!result) return

    closeForm()
    tableRef.current?.reload()
  }

  const performDelete = async () => {
    if (!confirmTarget) return
    setDeleting(true)
    const ok = await rest.delete(confirmTarget.id)
    setDeleting(false)
    if (!ok) return
    setConfirmTarget(null)
    tableRef.current?.reload()
  }

  return (
    <Adminto {...properties} title='Segmentos'>
      <style>{CSS}</style>
      <AdminTable
        ref={tableRef}
        rest={rest}
        title='Lista de segmentos'
        icon='ti ti-layers-subtract'
        countSuffix='segmentos'
        defaultSort={[{ selector: 'name', desc: false }]}
        minWidth={1030}
        headerActions={<button type='button' className='wseg-btn' onClick={() => openForm(null)}><i className='mdi mdi-plus'></i> Nuevo</button>}
        columns={[
          { key: 'image', header: 'Imagen', filterable: false, sortable: false, width: 96, render: (d) => <img src={imageUrl(d.image)} alt={d.name} className='wseg-thumb' /> },
          { key: 'name', header: 'Nombre', field: 'name', nowrap: true, render: (d) => <span className='fw-semibold'>{d.name}</span> },
          { key: 'description', header: 'Descripción', field: 'description', render: (d) => <span style={{ color: '#5b6577' }}>{d.description || '-'}</span> },
          {
            key: 'active_items_count', header: 'Items activos', field: 'active_items_count', align: 'center', width: 120, filterable: false,
            render: (d) => {
              const count = activeItemsCount(d)
              return <span className={`wseg-count ${count ? '' : 'empty'}`} title={count ? 'Puede mostrarse en home si está destacado y activo' : 'No se mostrará en home porque no tiene items activos'}>{count}</span>
            },
          },
          {
            key: 'featured', header: 'Destacado home', field: 'featured', align: 'center', width: 140,
            filterOptions: [{ value: '1', label: 'Sí' }, { value: '0', label: 'No' }],
            render: (d) => {
              const isFeatured = boolOf(d.featured)
              return <SwitchFormGroup id={`switch-featured-segment-${d.id}`} checked={isFeatured} refreshable={isFeatured} noMargin onChange={async (event) => { await rest.boolean({ id: d.id, field: 'featured', value: event.currentTarget.checked }); tableRef.current?.reload() }} />
            },
          },
          { key: 'featured_order', header: 'Orden home', field: 'featured_order', align: 'center', width: 110 },
          {
            key: 'status', header: 'Estado', field: 'status', align: 'center', width: 110,
            filterOptions: [{ value: '1', label: 'Activo' }, { value: '0', label: 'Inactivo' }],
            render: (d) => {
              const isActive = boolOf(d.status)
              return <SwitchFormGroup id={`switch-segment-${d.id}`} checked={isActive} refreshable={isActive} noMargin onChange={async (event) => { await rest.status({ id: d.id, status: !event.currentTarget.checked }); tableRef.current?.reload() }} />
            },
          },
          { key: 'created_at', header: 'Fecha', field: 'created_at', filterType: 'date', sortField: 'created_at', nowrap: true, width: 138, render: (d) => <span style={{ color: '#5b6577' }}>{d.created_at ? moment(d.created_at).format('DD/MM/YY') : '-'}</span> },
          {
            key: 'actions', header: 'Acciones', align: 'center', filterable: false, sortable: false,
            render: (d) => (
              <div className='d-flex align-items-center justify-content-center gap-1'>
                <button className='wseg-act edit' title='Editar' onClick={() => openForm(d)}><i className='mdi mdi-square-edit-outline'></i></button>
                <button className='wseg-act del' title='Eliminar' onClick={(e) => { e.stopPropagation(); setConfirmTarget(d) }}><i className='mdi mdi-trash-can'></i></button>
              </div>
            ),
          },
        ]}
      />

      <div className='wseg-modal-ovl' style={{ display: formOpen ? 'flex' : 'none' }} onMouseDown={closeForm}>
        <div className='wseg-modal' onMouseDown={(event) => event.stopPropagation()}>
          <form onSubmit={save}>
            <div className='wseg-modal-head'>
              <h3 className='wseg-h2' style={{ fontSize: 16 }}>
                <i className={`mdi ${dataLoaded ? 'mdi-square-edit-outline' : 'mdi-plus-box'} me-1`} style={{ color: '#004991' }}></i>
                {dataLoaded ? 'Editar segmento' : 'Nuevo segmento'}
              </h3>
              <button type='button' className='wseg-close' onClick={closeForm}><i className='mdi mdi-close'></i></button>
            </div>
            <div className='wseg-modal-body'>
              {formError && <div className='wseg-err'><i className='mdi mdi-alert-circle-outline'></i>{formError}</div>}
              <div className='row'>
                <div className='col-md-6'>
                  <div className='wseg-sec'>
                    <h4><i className='mdi mdi-shape-outline me-1' style={{ color: '#004991' }}></i>Datos</h4>
                    <InputFormGroup eRef={nameRef} label='Nombre' required />
                    <TextareaFormGroup eRef={descriptionRef} label='Descripción' rows={4} />
                    <InputFormGroup eRef={featuredOrderRef} label='Orden home' type='number' min='0' />
                    <div className='d-flex align-items-center gap-4 flex-wrap'>
                      <SwitchFormGroup label='Destacado home' checked={featured} onChange={() => setFeatured((current) => !current)} refreshable={featured} />
                      <SwitchFormGroup label='Activo catálogo' checked={status} onChange={() => setStatus((current) => !current)} refreshable={status} />
                    </div>
                  </div>
                </div>
                <div className='col-md-6'>
                  <ImageFormGroup eRef={imageRef} label='Imagen home' aspect='4/5' fit='cover' onError={FALLBACK_IMAGE} />
                </div>
              </div>
            </div>
            <div className='wseg-modal-foot'>
              <button type='button' className='wseg-btn outline foot' onClick={closeForm} disabled={loading}>Cancelar</button>
              <button type='submit' className='wseg-btn foot' disabled={loading}>
                {loading ? <><span className='spinner-border spinner-border-sm'></span> Guardando...</> : <><i className='mdi mdi-content-save'></i> Guardar</>}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        open={!!confirmTarget}
        title='Eliminar segmento'
        message={confirmTarget ? `Se eliminará "${confirmTarget.name}". Esta acción no se puede deshacer.` : ''}
        confirmLabel='Eliminar'
        variant='danger'
        loading={deleting}
        onConfirm={performDelete}
        onCancel={() => { if (!deleting) setConfirmTarget(null) }}
      />
    </Adminto>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(<ProductSegments {...properties} />)
})

