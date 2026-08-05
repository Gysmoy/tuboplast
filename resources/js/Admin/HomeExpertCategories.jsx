import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'
import AdminTable from '../Components/AdminTable.jsx'
import ConfirmModal from '../Components/ConfirmModal.jsx'
import CustomDropdown from '../Components/CustomDropdown.jsx'
import ImageFormGroup from '../Components/Form/ImageFormGroup.jsx'
import InputFormGroup from '../Components/Form/InputFormGroup.jsx'
import SwitchFormGroup from '../Components/Form/SwitchFormGroup.jsx'
import HomeExpertCategoriesRest from '../Actions/Admin/HomeExpertCategoriesRest.js'

const rest = new HomeExpertCategoriesRest()
const FALLBACK_IMAGE = '/assets/img/categories/category-1.webp'
const imageUrl = (image) => {
  if (!image) return FALLBACK_IMAGE
  if (/^(https?:)?\/\//.test(image) || image.startsWith('/')) return image
  if (image.startsWith('assets/')) return `/${image}`
  return `/storage/${image}`
}

const CSS = `
.whe-act{width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;border:0;font-size:13px;transition:filter .15s;}
.whe-act:hover{filter:brightness(.95);}
.whe-act.edit{background:#e8f0ff;color:#3b82f6;}
.whe-act.del{background:#fcebeb;color:#e24b4a;}
.whe-thumb{width:70px;height:46px;object-fit:cover;border-radius:8px;border:1px solid #eef2f8;}
.whe-btn{height:40px;padding:0 14px;border-radius:12px;background:#004991;color:#fff;font-weight:600;font-size:13px;border:0;display:inline-flex;align-items:center;gap:6px;transition:background .2s;}
.whe-btn:hover{background:#003b7a;color:#fff;}
.whe-btn.foot{height:38px;border-radius:10px;}
.whe-btn:disabled{opacity:.65;cursor:default;}
.whe-btn.outline{background:#fff;border:1px solid #dce5f0;color:#5b6577;}.whe-btn.outline:hover{background:#f4f8fd;color:#0f2540;}
.whe-h2{font-size:18px;font-weight:700;line-height:1.25;margin:0;color:#0f2540;}
.whe-modal-ovl{position:fixed;inset:0;z-index:1100;background:rgba(15,23,42,.5);display:flex;align-items:flex-start;justify-content:center;padding:3vh 12px;}
.whe-modal{position:relative;width:min(820px,96vw);max-height:94vh;background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(15,37,64,.25);display:flex;flex-direction:column;overflow:hidden;}
.whe-modal form{display:flex;flex-direction:column;min-height:0;flex:1;}
.whe-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid #eef2f8;flex-shrink:0;}
.whe-modal-body{overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:14px;flex:1;}
.whe-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 20px;border-top:1px solid #eef2f8;flex-shrink:0;}
.whe-close{width:36px;height:36px;border-radius:10px;border:0;background:none;color:#8a93a6;font-size:18px;}
.whe-close:hover{background:#f4f8fd;color:#0f2540;}
.whe-modal .form-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#8a93a6;margin-bottom:3px;}
.whe-err{display:flex;align-items:center;gap:8px;background:#fcebeb;color:#b42318;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:500;}
`

const FieldSelect = ({ label, value, options, onChange, required = false }) => (
  <div className='form-group col-md-6 mb-2'>
    <label className='form-label'>{label} {required && <b className='text-danger'>*</b>}</label>
    <CustomDropdown value={value} options={options} onChange={onChange} placeholder='Seleccionar' />
  </div>
)

const setRef = (ref, value) => { if (ref.current) ref.current.value = value ?? '' }

const HomeExpertCategories = ({ segments = [], ...properties }) => {
  const tableRef = useRef(null)
  const titleRef = useRef()
  const sortOrderRef = useRef()
  const imageRef = useRef()

  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(null)
  const [segmentId, setSegmentId] = useState('')
  const [status, setStatus] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const segmentOptions = useMemo(
    () => segments.map((segment) => ({ value: String(segment.id), label: segment.name })),
    [segments]
  )

  useEffect(() => {
    document.body.style.overflow = formOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [formOpen])

  const setFormValues = (data = null) => {
    setRef(titleRef, data?.title)
    setRef(sortOrderRef, data?.sort_order ?? 0)
    setSegmentId(data?.product_segment_id ? String(data.product_segment_id) : '')
    setStatus(data?.status == null ? true : data.status === true || data.status === 1 || data.status === '1')
    if (imageRef.current) imageRef.current.value = ''
    if (imageRef.current?.image) imageRef.current.image.src = imageUrl(data?.image)
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
      product_segment_id: segmentId || '',
      title: titleRef.current.value,
      sort_order: sortOrderRef.current.value || 0,
      status,
      image: imageRef.current.files?.[0] ?? null,
    }

    if (!payload.title.trim()) {
      setFormError('El titulo es obligatorio.')
      return
    }

    if (!payload.product_segment_id) {
      setFormError('Selecciona el segmento al que llevara esta tarjeta.')
      return
    }

    if (!payload.id && !payload.image) {
      setFormError('La imagen es obligatoria para registrar el card.')
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
    <Adminto {...properties} title='Expertos en'>
      <style>{CSS}</style>
      <AdminTable
        ref={tableRef}
        rest={rest}
        title='Cards de Expertos en'
        icon='ti ti-layout-grid'
        countSuffix='cards'
        defaultSort={[{ selector: 'sort_order', desc: false }]}
        minWidth={860}
        headerActions={<button type='button' className='whe-btn' onClick={() => openForm(null)}><i className='mdi mdi-plus'></i> Nuevo card</button>}
        columns={[
          { key: 'image', header: 'Imagen', filterable: false, sortable: false, width: 96, render: (d) => <img src={imageUrl(d.image)} alt={d.title} className='whe-thumb' /> },
          { key: 'title', header: 'Titulo', field: 'title', render: (d) => <span className='fw-semibold'>{d.title}</span> },
          { key: 'segment', header: 'Lleva al segmento', filterable: false, sortable: false, render: (d) => <span>{d.product_segment?.name || '-'}</span> },
          { key: 'sort_order', header: 'Orden', field: 'sort_order', align: 'center', width: 90 },
          {
            key: 'status', header: 'Estado', field: 'status', align: 'center', width: 110,
            filterOptions: [{ value: '1', label: 'Activo' }, { value: '0', label: 'Inactivo' }],
            render: (d) => {
              const isActive = d.status === true || d.status === 1 || d.status === '1'
              return <SwitchFormGroup id={`switch-home-expert-${d.id}`} checked={isActive} refreshable={isActive} noMargin onChange={async (event) => { await rest.status({ id: d.id, status: !event.currentTarget.checked }); tableRef.current?.reload() }} />
            },
          },
          {
            key: 'actions', header: 'Acciones', align: 'center', filterable: false, sortable: false,
            render: (d) => (
              <div className='d-flex align-items-center justify-content-center gap-1'>
                <button className='whe-act edit' title='Editar' onClick={() => openForm(d)}><i className='mdi mdi-square-edit-outline'></i></button>
                <button className='whe-act del' title='Eliminar' onClick={(e) => { e.stopPropagation(); setConfirmTarget(d) }}><i className='mdi mdi-trash-can'></i></button>
              </div>
            ),
          },
        ]}
      />

      <div className='whe-modal-ovl' style={{ display: formOpen ? 'flex' : 'none' }} onMouseDown={closeForm}>
        <div className='whe-modal' onMouseDown={(event) => event.stopPropagation()}>
          <form onSubmit={save}>
            <div className='whe-modal-head'>
              <h3 className='whe-h2' style={{ fontSize: 16 }}>
                <i className={`mdi ${dataLoaded ? 'mdi-square-edit-outline' : 'mdi-plus-box'} me-1`} style={{ color: '#004991' }}></i>
                {dataLoaded ? 'Editar card' : 'Nuevo card'}
              </h3>
              <button type='button' className='whe-close' onClick={closeForm}><i className='mdi mdi-close'></i></button>
            </div>
            <div className='whe-modal-body'>
              {formError && <div className='whe-err'><i className='mdi mdi-alert-circle-outline'></i>{formError}</div>}
              <div className='row'>
                <div className='col-md-6'>
                  <InputFormGroup eRef={titleRef} label='Titulo' required />
                  <div className='row'>
                    <FieldSelect label='Lleva al segmento' value={segmentId} options={segmentOptions} onChange={setSegmentId} required />
                    <InputFormGroup col='col-md-6' eRef={sortOrderRef} label='Orden' type='number' min='0' />
                  </div>
                  <SwitchFormGroup label='Activo' checked={status} onChange={() => setStatus((current) => !current)} />
                </div>
                <div className='col-md-6'>
                  <ImageFormGroup eRef={imageRef} label='Imagen' required={!dataLoaded} aspect='4/5' fit='cover' onError={FALLBACK_IMAGE} />
                </div>
              </div>
            </div>
            <div className='whe-modal-foot'>
              <button type='button' className='whe-btn outline foot' onClick={closeForm} disabled={loading}>Cancelar</button>
              <button type='submit' className='whe-btn foot' disabled={loading}>
                {loading ? <><span className='spinner-border spinner-border-sm'></span> Guardando...</> : <><i className='mdi mdi-content-save'></i> Guardar</>}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        open={!!confirmTarget}
        title='Eliminar card'
        message={confirmTarget ? `Se eliminara "${confirmTarget.title}". Esta accion no se puede deshacer.` : ''}
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
  createRoot(el).render(<HomeExpertCategories {...properties} />)
})
