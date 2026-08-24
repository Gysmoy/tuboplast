import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'
import AdminTable from '../Components/AdminTable.jsx'
import ConfirmModal from '../Components/ConfirmModal.jsx'
import CustomDropdown from '../Components/CustomDropdown.jsx'
import InputFormGroup from '../Components/Form/InputFormGroup.jsx'
import TextareaFormGroup from '../Components/Form/TextareaFormGroup.jsx'
import ImageFormGroup from '../Components/Form/ImageFormGroup.jsx'
import SwitchFormGroup from '../Components/Form/SwitchFormGroup.jsx'
import SlidersRest from '../Actions/Admin/SlidersRest.js'

const slidersRest = new SlidersRest()
const FALLBACK_SLIDER_IMAGE = '/assets/img/sliders/hero-home.webp'
const FALLBACK_ITEM_IMAGE = '/assets/img/items/item-1.png'
const DISPLAY_MODE_OPTIONS = [
  { value: 'image_only', label: 'Solo imagen' },
  { value: 'image_with_text', label: 'Imagen con texto' },
]
const PLACEMENT_OPTIONS = [
  { value: 'home', label: 'Inicio' },
  { value: 'blog', label: 'Blog' },
  { value: 'about_family', label: 'Nosotros - Familia' },
  { value: 'about_policy', label: 'Nosotros - Política SGI' },
  { value: 'distributors', label: 'Distribuidores' },
  { value: 'club_primary', label: 'Club experto - Principal' },
  { value: 'club_secondary', label: 'Club experto - Secundario' },
]

const SLIDERS_CSS = `
.wfs-act{width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;border:0;font-size:13px;transition:filter .15s;}
.wfs-act:hover{filter:brightness(.95);}
.wfs-act.edit{background:#e8f0ff;color:#3b82f6;}
.wfs-act.del{background:#fcebeb;color:#e24b4a;}
.wfs-thumb{width:70px;height:46px;object-fit:cover;border-radius:8px;border:1px solid #eef2f8;}
.wfs-chip{display:inline-flex;align-items:center;padding:3px 10px;border-radius:50rem;font-size:11px;font-weight:600;background:#e6effa;color:#004991;}
.wfs-muted{color:#5b6577;}
.wfs-btn{height:40px;padding:0 14px;border-radius:12px;background:#004991;color:#fff;font-weight:600;font-size:13px;border:0;display:inline-flex;align-items:center;gap:6px;transition:background .2s;}
.wfs-btn:hover{background:#003b7a;color:#fff;}
.wfs-btn.foot{height:38px;border-radius:10px;}
.wfs-btn:disabled{opacity:.65;cursor:default;}
.wfs-btn.outline{background:#fff;border:1px solid #dce5f0;color:#5b6577;}.wfs-btn.outline:hover{background:#f4f8fd;color:#0f2540;}
.wfs-h2{font-size:18px;font-weight:700;line-height:1.25;margin:0;color:#0f2540;}
.wfs-sec{border:1px solid #eef2f8;border-radius:12px;padding:16px;}
.wfs-sec h4{font-size:14px;font-weight:700;color:#0f2540;margin:0 0 14px;display:flex;align-items:center;}
.wfs-modal-ovl{position:fixed;inset:0;z-index:1100;background:rgba(15,23,42,.5);display:flex;align-items:flex-start;justify-content:center;padding:3vh 12px;}
.wfs-modal{position:relative;width:min(1000px,96vw);max-height:94vh;background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(15,37,64,.25);display:flex;flex-direction:column;overflow:hidden;}
.wfs-modal form{display:flex;flex-direction:column;min-height:0;flex:1;}
.wfs-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid #eef2f8;flex-shrink:0;}
.wfs-modal-body{overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:14px;flex:1;}
.wfs-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 20px;border-top:1px solid #eef2f8;flex-shrink:0;}
.wfs-close{width:36px;height:36px;border-radius:10px;border:0;background:none;color:#8a93a6;font-size:18px;}
.wfs-close:hover{background:#f4f8fd;color:#0f2540;}
.wfs-modal .form-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#8a93a6;margin-bottom:3px;}
.wfs-err{display:flex;align-items:center;gap:8px;background:#fcebeb;color:#b42318;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:500;}
.wfs-item-preview{border:1px solid #eef2f8;border-radius:12px;padding:12px;display:flex;gap:12px;align-items:center;background:#f8fbff;}
.wfs-item-preview img{width:74px;height:58px;object-fit:cover;border-radius:9px;background:#fff;border:1px solid #eef2f8;}
.wfs-range{width:100%;accent-color:#004991;}
.wfs-range-row{display:flex;align-items:center;gap:12px;padding-top:6px;}
.wfs-range-value{min-width:46px;text-align:center;border-radius:999px;background:#e6effa;color:#004991;font-size:12px;font-weight:700;padding:4px 8px;}
`

const itemImage = (item) => item?.image ? `/storage/${item.image}` : FALLBACK_ITEM_IMAGE
const sliderImage = (path) => {
  if (!path) return FALLBACK_SLIDER_IMAGE
  if (/^https?:\/\//.test(path) || path.startsWith('/')) return path
  if (path.startsWith('assets/')) return `/${path}`
  if (/^(blog|distributors|club|about|landing)\//.test(path)) return `/assets/img/${path}`
  return `/storage/${path}`
}

const FieldSelect = ({ col = 'col-md-6', label, value, options, onChange }) => (
  <div className={`form-group ${col} mb-2`}>
    <label className='form-label'>{label}</label>
    <CustomDropdown value={value} options={options} onChange={onChange} placeholder='Seleccionar' />
  </div>
)

const setRef = (ref, value) => {
  if (ref.current) ref.current.value = value ?? ''
}

const Sliders = ({ items = [] }) => {
  const tableRef = useRef(null)
  const titleRef = useRef()
  const descriptionRef = useRef()
  const imageRef = useRef()
  const primaryButtonTextRef = useRef()
  const primaryButtonLinkRef = useRef()
  const secondaryButtonTextRef = useRef()
  const secondaryButtonLinkRef = useRef()
  const metricOneValueRef = useRef()
  const metricOneLabelRef = useRef()
  const metricTwoValueRef = useRef()
  const metricTwoLabelRef = useRef()
  const sortOrderRef = useRef()

  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(null)
  const [placement, setPlacement] = useState('home')
  const [itemId, setItemId] = useState('')
  const [displayMode, setDisplayMode] = useState('image_with_text')
  const [overlayOpacity, setOverlayOpacity] = useState(85)
  const [status, setStatus] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const itemOptions = useMemo(() => [
    { value: '', label: 'Sin item asociado' },
    ...items.map((item) => ({
      value: String(item.id),
      label: [item.title, item.sku ? `SKU ${item.sku}` : null].filter(Boolean).join(' - '),
    }))
  ], [items])

  const selectedItem = useMemo(
    () => items.find((item) => String(item.id) === String(itemId)),
    [items, itemId]
  )

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isModalOpen])

  const resetForm = () => {
    setDataLoaded(null)
    setPlacement('home')
    setItemId('')
    setDisplayMode('image_with_text')
    setOverlayOpacity(85)
    setStatus(true)
    setFormError('')
    setIsModalOpen(false)
    ;[
      titleRef,
      descriptionRef,
      primaryButtonTextRef,
      primaryButtonLinkRef,
      secondaryButtonTextRef,
      secondaryButtonLinkRef,
      metricOneValueRef,
      metricOneLabelRef,
      metricTwoValueRef,
      metricTwoLabelRef,
      sortOrderRef,
    ].forEach((ref) => setRef(ref, ''))
    if (imageRef.current) imageRef.current.value = ''
    if (imageRef.current?.image) imageRef.current.image.src = FALLBACK_SLIDER_IMAGE
  }

  const closeForm = () => { if (!loading) resetForm() }

  const setFormValues = (data = null) => {
    setRef(titleRef, data?.title)
    setRef(descriptionRef, data?.description)
    setRef(primaryButtonTextRef, data?.primary_button_text)
    setRef(primaryButtonLinkRef, data?.primary_button_link)
    setRef(secondaryButtonTextRef, data?.secondary_button_text)
    setRef(secondaryButtonLinkRef, data?.secondary_button_link)
    setRef(metricOneValueRef, data?.metric_one_value)
    setRef(metricOneLabelRef, data?.metric_one_label)
    setRef(metricTwoValueRef, data?.metric_two_value)
    setRef(metricTwoLabelRef, data?.metric_two_label)
    setRef(sortOrderRef, data?.sort_order ?? 0)
    setPlacement(data?.placement || 'home')
    setItemId(data?.item_id ? String(data.item_id) : '')
    setDisplayMode(data?.display_mode || 'image_with_text')
    setOverlayOpacity(Number.isFinite(Number(data?.overlay_opacity)) ? Number(data.overlay_opacity) : 85)
    setStatus(data?.status == null ? true : data.status === true || data.status === 1 || data.status === '1')

    if (imageRef.current) imageRef.current.value = ''
    if (imageRef.current?.image) {
      imageRef.current.image.src = sliderImage(data?.image)
    }
  }

  const onModalOpen = (data = null) => {
    setDataLoaded(data)
    setFormError('')
    setIsModalOpen(true)
    setTimeout(() => setFormValues(data), 30)
  }

  const askDelete = (row, event) => { if (event) event.stopPropagation(); setConfirmTarget(row) }

  const performDelete = async () => {
    const row = confirmTarget
    if (!row) return
    setDeleting(true)
    const ok = await slidersRest.delete(row.id)
    setDeleting(false)
    if (!ok) return
    setConfirmTarget(null)
    tableRef.current?.reload()
  }

  const onSaveSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    const slider = {
      id: dataLoaded?.id,
      placement,
      item_id: itemId || '',
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      display_mode: displayMode,
      overlay_opacity: overlayOpacity,
      primary_button_text: primaryButtonTextRef.current.value,
      primary_button_link: primaryButtonLinkRef.current.value,
      secondary_button_text: secondaryButtonTextRef.current.value,
      secondary_button_link: secondaryButtonLinkRef.current.value,
      metric_one_value: metricOneValueRef.current.value,
      metric_one_label: metricOneLabelRef.current.value,
      metric_two_value: metricTwoValueRef.current.value,
      metric_two_label: metricTwoLabelRef.current.value,
      sort_order: sortOrderRef.current.value || 0,
      status,
      image: imageRef.current.files?.[0] ?? null,
    }

    if (!slider.id && !slider.image) {
      setFormError('La imagen es obligatoria para registrar un slider.')
      return
    }

    setFormError('')
    setLoading(true)
    const result = await slidersRest.save(slider)
    setLoading(false)

    if (!result) return
    tableRef.current?.reload()
    resetForm()
  }

  const columns = [
    {
      key: 'image', header: 'Imagen', filterable: false, sortable: false, width: 96,
      render: (d) => <img src={sliderImage(d.image)} alt={d.title} className='wfs-thumb' />,
    },
    {
      key: 'title', header: 'Contenido', field: 'title', filterFields: ['title', 'description'], width: 310,
      render: (d) => (
        <>
          <span className='fw-semibold d-block'>{d.title}</span>
          <small className='text-muted d-block line-clamp-2'>{d.description || 'Sin descripcion'}</small>
        </>
      ),
    },
    {
      key: 'placement', header: 'Ubicación', field: 'placement', width: 190,
      filterOptions: PLACEMENT_OPTIONS,
      render: (d) => (
        <span className='wfs-chip'>
          {PLACEMENT_OPTIONS.find((option) => option.value === (d.placement || 'home'))?.label || d.placement || 'Inicio'}
        </span>
      ),
    },
    {
      key: 'display_mode', header: 'Modo', filterable: false, sortable: false, width: 150,
      render: (d) => (
        <span className='wfs-chip'>
          {d.display_mode === 'image_only' ? 'Solo imagen' : 'Imagen con texto'}
        </span>
      ),
    },
    {
      key: 'buttons', header: 'Botones', filterable: false, sortable: false, width: 210,
      render: (d) => (
        <div className='d-flex flex-column gap-1'>
          <small className='wfs-muted'><b>1:</b> {d.primary_button_text || '-'} <span className='text-muted'>{d.primary_button_link || ''}</span></small>
          <small className='wfs-muted'><b>2:</b> {d.secondary_button_text || '-'} <span className='text-muted'>{d.secondary_button_link || ''}</span></small>
        </div>
      ),
    },
    {
      key: 'metrics', header: 'Metricas', filterable: false, sortable: false, width: 180,
      render: (d) => (
        <div className='d-flex flex-column gap-1'>
          <small className='wfs-muted'>{d.metric_one_value || '-'} <span className='text-muted'>{d.metric_one_label || ''}</span></small>
          <small className='wfs-muted'>{d.metric_two_value || '-'} <span className='text-muted'>{d.metric_two_label || ''}</span></small>
        </div>
      ),
    },
    {
      key: 'item', header: 'Item asociado', filterable: false, sortable: false, width: 240,
      render: (d) => d.item ? (
        <>
          <span className='fw-semibold d-block'>{d.item.title}</span>
          <small className='text-muted'>{d.item.category?.name || d.item.sku || 'Producto'}</small>
        </>
      ) : <span className='text-muted'>Sin item</span>,
    },
    {
      key: 'sort_order', header: 'Orden', field: 'sort_order', align: 'center', width: 90,
      render: (d) => <span className='wfs-chip'>{d.sort_order ?? 0}</span>,
    },
    {
      key: 'status', header: 'Estado', field: 'status', align: 'center', width: 110,
      filterOptions: [{ value: '1', label: 'Activo' }, { value: '0', label: 'Inactivo' }],
      render: (d) => {
        const isActive = d.status === true || d.status === 1 || d.status === '1'
        return (
          <SwitchFormGroup id={`switch-slider-${d.id}`} checked={isActive} refreshable={isActive} noMargin
            onChange={async (event) => { await slidersRest.status({ id: d.id, status: !event.currentTarget.checked }); tableRef.current?.reload() }} />
        )
      },
    },
    {
      key: 'actions', header: 'Acciones', align: 'center', filterable: false, sortable: false, width: 110,
      render: (d) => (
        <div className='d-flex align-items-center justify-content-center gap-1'>
          <button className='wfs-act edit' title='Editar' onClick={() => onModalOpen(d)}><i className='mdi mdi-square-edit-outline'></i></button>
          <button className='wfs-act del' title='Eliminar' onClick={(e) => askDelete(d, e)}><i className='mdi mdi-trash-can'></i></button>
        </div>
      ),
    },
  ]

  return (
    <>
      <style>{SLIDERS_CSS}</style>
      <AdminTable
        ref={tableRef}
        rest={slidersRest}
        title='Lista de sliders'
        icon='ti ti-slideshow'
        countSuffix='sliders'
        defaultSort={[{ selector: 'sort_order', desc: false }]}
        minWidth={1340}
        headerActions={<button type='button' className='wfs-btn' onClick={() => onModalOpen(null)}><i className='mdi mdi-plus'></i> Nuevo slider</button>}
        columns={columns}
      />

      <div className='wfs-modal-ovl' style={{ display: isModalOpen ? 'flex' : 'none' }} onMouseDown={closeForm}>
        <div className='wfs-modal' onMouseDown={(e) => e.stopPropagation()}>
          <form onSubmit={onSaveSubmit}>
            <div className='wfs-modal-head'>
              <h3 className='wfs-h2' style={{ fontSize: 16 }}>
                <i className={`mdi ${dataLoaded ? 'mdi-square-edit-outline' : 'mdi-plus-box'} me-1`} style={{ color: '#004991' }}></i>
                {dataLoaded ? 'Editar slider' : 'Nuevo slider'}
              </h3>
              <button type='button' className='wfs-close' onClick={closeForm}><i className='mdi mdi-close'></i></button>
            </div>

            <div className='wfs-modal-body'>
              {formError && <div className='wfs-err'><i className='mdi mdi-alert-circle-outline'></i>{formError}</div>}

              <div className='wfs-sec'>
                <h4><i className='mdi mdi-image-outline me-1' style={{ color: '#004991' }}></i>Contenido principal</h4>
                <div className='row'>
                  <div className='col-md-5'>
                    <ImageFormGroup eRef={imageRef} label='Imagen del slider' required={!dataLoaded} aspect='16/9' fit='cover' onError={FALLBACK_SLIDER_IMAGE} />
                  </div>
                  <div className='col-md-7'>
                    <div className='row'>
                      <InputFormGroup col='col-md-3' eRef={titleRef} label='Titulo' required />
                      <FieldSelect col='col-md-3' label='Ubicación' value={placement} options={PLACEMENT_OPTIONS} onChange={setPlacement} />
                      <FieldSelect col='col-md-3' label='Modo' value={displayMode} options={DISPLAY_MODE_OPTIONS} onChange={setDisplayMode} />
                      <InputFormGroup col='col-md-3' eRef={sortOrderRef} label='Orden' type='number' />
                    </div>
                    {displayMode === 'image_with_text' && (
                      <div className='form-group mb-2'>
                        <label className='form-label'>Desvanecimiento</label>
                        <div className='wfs-range-row'>
                          <input
                            className='wfs-range'
                            type='range'
                            min='0'
                            max='100'
                            step='5'
                            value={overlayOpacity}
                            onChange={(event) => setOverlayOpacity(Number(event.target.value))}
                          />
                          <span className='wfs-range-value'>{overlayOpacity}%</span>
                        </div>
                        <small className='text-muted'>0% muestra más imagen, 100% aclara más el lado del texto.</small>
                      </div>
                    )}
                    <TextareaFormGroup eRef={descriptionRef} label='Descripcion' rows={4} />
                    <div className='d-flex align-items-center gap-2 mt-1'>
                      <SwitchFormGroup id='slider-form-status' checked={status} noMargin onChange={() => setStatus((current) => !current)} />
                      <span className='text-muted' style={{ fontSize: 13 }}>Activo en la web</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='wfs-sec'>
                <h4><i className='mdi mdi-gesture-tap-button me-1' style={{ color: '#004991' }}></i>Botones</h4>
                <div className='row'>
                  <InputFormGroup col='col-md-3' eRef={primaryButtonTextRef} label='Texto botón 1' placeholder='Ver catálogo' />
                  <InputFormGroup col='col-md-3' eRef={primaryButtonLinkRef} label='Enlace botón 1' placeholder='/catalog' />
                  <InputFormGroup col='col-md-3' eRef={secondaryButtonTextRef} label='Texto botón 2' placeholder='Solicitar cotización' />
                  <InputFormGroup col='col-md-3' eRef={secondaryButtonLinkRef} label='Enlace botón 2' placeholder='/contact' />
                </div>
              </div>

              <div className='wfs-sec'>
                <h4><i className='mdi mdi-chart-box-outline me-1' style={{ color: '#004991' }}></i>Metricas</h4>
                <div className='row'>
                  <InputFormGroup col='col-md-3' eRef={metricOneValueRef} label='Valor metrica 1' placeholder='60+' />
                  <InputFormGroup col='col-md-3' eRef={metricOneLabelRef} label='Texto metrica 1' placeholder='Anos de trayectoria' />
                  <InputFormGroup col='col-md-3' eRef={metricTwoValueRef} label='Valor metrica 2' placeholder='ISO' />
                  <InputFormGroup col='col-md-3' eRef={metricTwoLabelRef} label='Texto metrica 2' placeholder='Calidad certificada' />
                </div>
              </div>

              <div className='wfs-sec'>
                <h4><i className='mdi mdi-package-variant-closed me-1' style={{ color: '#004991' }}></i>Item asociado</h4>
                <div className='row align-items-end'>
                  <FieldSelect col='col-md-7' label='Producto del lado derecho' value={itemId} options={itemOptions} onChange={setItemId} />
                  <div className='col-md-5 mb-2'>
                    <div className='wfs-item-preview'>
                      <img src={itemImage(selectedItem)} alt={selectedItem?.title || 'Item'} />
                      <div className='min-w-0'>
                        <span className='fw-semibold d-block text-truncate'>{selectedItem?.title || 'Sin item asociado'}</span>
                        <small className='text-muted d-block text-truncate'>{selectedItem?.category || selectedItem?.sku || 'El home usara el destacado por defecto.'}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='wfs-modal-foot'>
              <button type='button' className='wfs-btn outline foot' onClick={closeForm} disabled={loading}>Cancelar</button>
              <button type='submit' className='wfs-btn foot' disabled={loading}>
                {loading
                  ? <><span className='spinner-border spinner-border-sm'></span> Guardando...</>
                  : <><i className='mdi mdi-content-save'></i> {dataLoaded ? 'Guardar cambios' : 'Crear slider'}</>}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        open={!!confirmTarget}
        title='Eliminar slider'
        message={confirmTarget ? `Se eliminará "${confirmTarget.title}". Esta acción no se puede deshacer.` : ''}
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
    <Adminto {...properties} title='Sliders'>
      <Sliders {...properties} />
    </Adminto>
  )
})

