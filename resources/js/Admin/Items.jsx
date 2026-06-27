import React, { useEffect, useRef, useState } from 'react'
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
import ItemsRest from '../Actions/Admin/ItemsRest.js'

const itemsRest = new ItemsRest()

const ITEMS_CSS = `
.wfi-act{width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;border:0;font-size:13px;transition:filter .15s;}
.wfi-act:hover{filter:brightness(.95);}
.wfi-act.edit{background:#e8f0ff;color:#3b82f6;}
.wfi-act.del{background:#fcebeb;color:#e24b4a;}
.wfi-thumb{width:54px;height:42px;object-fit:cover;border-radius:8px;border:1px solid #eef2f8;}
.wfi-h2{font-size:18px;font-weight:700;line-height:1.25;margin:0;color:#0f2540;}
.wfi-btn{height:38px;padding:0 16px;border-radius:10px;background:#004991;color:#fff;font-weight:600;font-size:13px;border:0;display:inline-flex;align-items:center;gap:6px;transition:background .2s;}
.wfi-btn:hover{background:#003b7a;color:#fff;}
.wfi-btn:disabled{opacity:.65;cursor:default;}
.wfi-btn.outline{background:#fff;border:1px solid #dce5f0;color:#5b6577;}.wfi-btn.outline:hover{background:#f4f8fd;color:#0f2540;}
.wfi-btn.add{height:40px;border-radius:12px;}
.wfi-sec{border:1px solid #eef2f8;border-radius:12px;padding:16px;}
.wfi-sec h4{font-size:14px;font-weight:700;color:#0f2540;margin:0 0 14px;display:flex;align-items:center;}
.wfi-modal-ovl{position:fixed;inset:0;z-index:1100;background:rgba(15,23,42,.5);display:flex;align-items:flex-start;justify-content:center;padding:3vh 12px;}
.wfi-modal{position:relative;width:min(1000px,96vw);max-height:94vh;background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(15,37,64,.25);display:flex;flex-direction:column;overflow:hidden;}
.wfi-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid #eef2f8;flex-shrink:0;}
.wfi-modal form{display:flex;flex-direction:column;min-height:0;flex:1;}
.wfi-modal-body{overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:14px;flex:1;}
.wfi-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 20px;border-top:1px solid #eef2f8;flex-shrink:0;}
.wfi-close{width:36px;height:36px;border-radius:10px;border:0;background:none;color:#8a93a6;font-size:18px;}
.wfi-close:hover{background:#f4f8fd;color:#0f2540;}
.wfi-modal .form-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#8a93a6;margin-bottom:3px;}
.wfi-err{display:flex;align-items:center;gap:8px;background:#fcebeb;color:#b42318;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:500;}
`

const SEGMENT_OPTIONS = ['PREDIAL', 'INFRAESTRUCTURA']
const TYPE_OPTIONS = ['Tubos', 'Conexiones', 'Accesorios', 'Anillos']
const USE_OPTIONS = ['AGUA FRIA', 'AGUA POTABLE', 'DESAGUE', 'ALCANTARILLADO', 'ELECTRICO']
const CURRENCY_OPTIONS = [{ value: 'PEN', label: 'PEN (S/)' }, { value: 'USD', label: 'USD ($)' }]

const toOptions = (values, emptyLabel) => [{ value: '', label: emptyLabel }, ...values.map((v) => ({ value: v, label: v }))]

const formatPrice = (value, currency = 'PEN') => {
  const number = Number(value)
  if (!Number.isFinite(number)) return '-'
  const symbol = String(currency).toUpperCase() === 'USD' ? '$' : 'S/'
  return `${symbol} ${number.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const FieldSelect = ({ col = 'col-6', label, value, options, placeholder, onChange }) => (
  <div className={`form-group ${col} mb-2`}>
    <label className='form-label'>{label}</label>
    <CustomDropdown value={value} options={options} onChange={onChange} placeholder={placeholder} />
  </div>
)

const Items = ({ categories = [] }) => {
  const tableRef = useRef(null)

  // Básicos
  const titleRef = useRef()
  const skuRef = useRef()
  const priceRef = useRef()
  const imageRef = useRef()
  const descriptionRef = useRef()
  const diametersRef = useRef()

  // Especificaciones
  const materialRef = useRef()
  const colorRef = useRef()
  const brandRef = useRef()
  const unitRef = useRef()
  const masterpackRef = useRef()
  const piecesRef = useRef()
  const originCountryRef = useRef()
  const nominalDiameterRef = useRef()
  const pressureRef = useRef()
  const famconsRef = useRef()
  const familyRef = useRef()

  // Logística
  const packageTypeRef = useRef()
  const perishableRef = useRef()
  const hazardousRef = useRef()
  const productHeightRef = useRef()
  const productWidthRef = useRef()
  const productDepthRef = useRef()
  const productWeightRef = useRef()
  const logisticHeightRef = useRef()
  const logisticWidthRef = useRef()
  const logisticDepthRef = useRef()
  const logisticWeightRef = useRef()

  // Avisos / uso
  const warrantyRef = useRef()
  const featuresRef = useRef()
  const usageRecommendationsRef = useRef()
  const observationsRef = useRef()
  const usageWarningRef = useRef()

  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(null)
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [selects, setSelects] = useState({ category_id: '', segment: '', type: '', use_type: '', currency: 'PEN' })

  const setSelect = (key, value) => setSelects((cur) => ({ ...cur, [key]: value }))
  const refreshGrid = () => tableRef.current?.reload()

  const setFormValues = (data = null) => {
    const set = (ref, value) => { if (ref.current) ref.current.value = value ?? '' }

    set(titleRef, data?.title)
    set(skuRef, data?.sku)
    set(priceRef, data?.price)
    set(pressureRef, data?.pressure)
    set(materialRef, data?.material)
    set(colorRef, data?.color)
    set(brandRef, data?.brand)
    set(unitRef, data?.unit)
    set(masterpackRef, data?.masterpack)
    set(piecesRef, data?.pieces)
    set(originCountryRef, data?.origin_country)
    set(nominalDiameterRef, data?.nominal_diameter || data?.diameter)
    set(famconsRef, data?.famcons)
    set(familyRef, data?.family || data?.classification)
    set(diametersRef, Array.isArray(data?.diameters) ? data.diameters.join(', ') : (data?.diameters || ''))
    set(descriptionRef, data?.description)
    set(packageTypeRef, data?.package_type)
    set(perishableRef, data?.perishable)
    set(hazardousRef, data?.hazardous)
    set(productHeightRef, data?.product_height)
    set(productWidthRef, data?.product_width)
    set(productDepthRef, data?.product_depth)
    set(productWeightRef, data?.product_weight)
    set(logisticHeightRef, data?.logistic_height)
    set(logisticWidthRef, data?.logistic_width)
    set(logisticDepthRef, data?.logistic_depth)
    set(logisticWeightRef, data?.logistic_weight)
    set(warrantyRef, data?.warranty)
    set(featuresRef, data?.features)
    set(usageRecommendationsRef, data?.usage_recommendations)
    set(observationsRef, data?.observations)
    set(usageWarningRef, data?.usage_warning)

    setSelects({
      category_id: data?.category_id ? String(data.category_id) : '',
      segment: data?.segment || '',
      type: data?.type || '',
      use_type: data?.use_type || '',
      currency: data?.currency || 'PEN',
    })

    if (imageRef.current) imageRef.current.value = ''
    if (imageRef.current?.image) {
      imageRef.current.image.src = data?.image
        ? `/storage/${data.image}`
        : '/assets/img/items/item-1.png'
    }
  }

  const onModalOpen = (data = null) => {
    setDataLoaded(data)
    setFormError('')
    setFormOpen(true)
    setTimeout(() => setFormValues(data), 30)
  }

  const closeForm = () => { if (loading) return; setFormOpen(false); setDataLoaded(null); setFormError('') }

  useEffect(() => {
    document.body.style.overflow = formOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [formOpen])

  const askDelete = (item, event) => { if (event) event.stopPropagation(); setConfirmTarget(item) }

  const performDelete = async () => {
    const item = confirmTarget
    if (!item) return
    setDeleting(true)
    const ok = await itemsRest.delete(item.id)
    setDeleting(false)
    if (!ok) return
    setConfirmTarget(null)
    tableRef.current?.reload()
  }

  const onSaveSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    const family = familyRef.current.value
    const nominal = nominalDiameterRef.current.value

    const item = {
      id: dataLoaded?.id,
      title: titleRef.current.value,
      sku: skuRef.current.value,
      category_id: selects.category_id || '',
      segment: selects.segment || '',
      type: selects.type || '',
      use_type: selects.use_type || '',
      family,
      classification: family,
      famcons: famconsRef.current.value,
      material: materialRef.current.value,
      color: colorRef.current.value,
      brand: brandRef.current.value,
      unit: unitRef.current.value,
      masterpack: masterpackRef.current.value,
      pieces: piecesRef.current.value,
      origin_country: originCountryRef.current.value,
      price: priceRef.current.value,
      currency: selects.currency || 'PEN',
      pressure: pressureRef.current.value,
      diameter: nominal,
      nominal_diameter: nominal,
      diameters: diametersRef.current.value,
      description: descriptionRef.current.value,
      package_type: packageTypeRef.current.value,
      perishable: perishableRef.current.value,
      hazardous: hazardousRef.current.value,
      product_height: productHeightRef.current.value,
      product_width: productWidthRef.current.value,
      product_depth: productDepthRef.current.value,
      product_weight: productWeightRef.current.value,
      logistic_height: logisticHeightRef.current.value,
      logistic_width: logisticWidthRef.current.value,
      logistic_depth: logisticDepthRef.current.value,
      logistic_weight: logisticWeightRef.current.value,
      warranty: warrantyRef.current.value,
      features: featuresRef.current.value,
      usage_recommendations: usageRecommendationsRef.current.value,
      observations: observationsRef.current.value,
      usage_warning: usageWarningRef.current.value,
      status: true,
      image: imageRef.current.files?.[0] ?? null
    }

    if (!item.id && !item.image) {
      setFormError('La imagen es obligatoria para registrar un item.')
      return
    }

    setFormError('')
    setLoading(true)
    const result = await itemsRest.save(item)
    setLoading(false)

    if (!result) return
    setFormOpen(false)
    setDataLoaded(null)
    refreshGrid()
  }

  return (
    <>
      <style>{ITEMS_CSS}</style>
      <AdminTable
        ref={tableRef}
        rest={itemsRest}
        title='Lista de items'
        icon='ti ti-package'
        countSuffix='items'
        defaultSort={[{ selector: 'title', desc: false }]}
        minWidth={1080}
        headerActions={<button type='button' className='wfi-btn' onClick={() => onModalOpen(null)}><i className='mdi mdi-plus'></i> Nuevo item</button>}
        columns={[
          {
            key: 'image', header: 'Imagen', filterable: false, sortable: false, width: 90,
            render: (d) => <img src={d.image ? `/storage/${d.image}` : '/assets/img/items/item-1.png'} alt={d.title} className='wfi-thumb' />,
          },
          {
            key: 'title', header: 'Producto', field: 'title', filterFields: ['title', 'sku'], width: 280,
            render: (d) => (<><span className='fw-semibold d-block'>{d.title}</span><small className='text-muted'>{d.sku || 'Sin SKU'}</small></>),
          },
          {
            key: 'segment', header: 'Categoría / Clasificación', field: 'segment', filterFields: ['segment', 'type', 'use_type'], nowrap: true,
            render: (d) => (<><span className='d-block'>{d.category?.name || '-'}</span><small className='text-muted'>{[d.segment, d.type, d.use_type].filter(Boolean).join(' · ') || 'Sin clasificar'}</small></>),
          },
          {
            key: 'price', header: 'Precio', field: 'price', filterable: false, align: 'right', nowrap: true,
            render: (d) => <span className='fw-semibold' style={{ color: '#004991' }}>{d.price != null ? formatPrice(d.price, d.currency) : '-'}</span>,
          },
          {
            key: 'use_type', header: 'Uso / Diámetro', field: 'use_type', filterFields: ['use_type', 'nominal_diameter'], nowrap: true,
            render: (d) => (<><small className='d-block text-muted'>{d.use_type || '-'}</small><small className='d-block text-muted'>{d.nominal_diameter || d.diameter || '-'}</small></>),
          },
          {
            key: 'status', header: 'Estado', field: 'status', align: 'center',
            filterOptions: [{ value: '1', label: 'Activo' }, { value: '0', label: 'Inactivo' }],
            render: (d) => (
              <SwitchFormGroup id={`switch-item-${d.id}`} checked={Boolean(d.status)} noMargin
                onChange={async () => { await itemsRest.status({ id: d.id, status: d.status }); tableRef.current?.reload() }} />
            ),
          },
          {
            key: 'actions', header: 'Acciones', align: 'center', filterable: false, sortable: false,
            render: (d) => (
              <div className='d-flex align-items-center justify-content-center gap-1'>
                <button className='wfi-act edit' title='Editar' onClick={() => onModalOpen(d)}><i className='mdi mdi-square-edit-outline'></i></button>
                <button className='wfi-act del' title='Eliminar' onClick={(e) => askDelete(d, e)}><i className='mdi mdi-trash-can'></i></button>
              </div>
            ),
          },
        ]}
      />

      <div className='wfi-modal-ovl' style={{ display: formOpen ? 'flex' : 'none' }} onMouseDown={closeForm}>
        <div className='wfi-modal' onMouseDown={(e) => e.stopPropagation()}>
          <form onSubmit={onSaveSubmit}>
            <div className='wfi-modal-head'>
              <h3 className='wfi-h2' style={{ fontSize: 16 }}>
                <i className={`mdi ${dataLoaded ? 'mdi-square-edit-outline' : 'mdi-plus-box'} me-1`} style={{ color: '#004991' }}></i>
                {dataLoaded ? 'Editar item' : 'Nuevo item'}
              </h3>
              <button type='button' className='wfi-close' onClick={closeForm}><i className='mdi mdi-close'></i></button>
            </div>

            <div className='wfi-modal-body'>
              {formError && <div className='wfi-err'><i className='mdi mdi-alert-circle-outline'></i>{formError}</div>}

              <div className='wfi-sec'>
                <h4><i className='mdi mdi-cube-outline me-1' style={{ color: '#004991' }}></i>Datos generales</h4>
                <div className='row'>
                  <div className='col-md-6'>
                    <InputFormGroup eRef={titleRef} label='Título' required />
                    <div className='row'>
                      <InputFormGroup col='col-6' eRef={skuRef} label='SKU (Código)' />
                      <FieldSelect label='Moneda' value={selects.currency} options={CURRENCY_OPTIONS} onChange={(v) => setSelect('currency', v)} />
                    </div>
                    <div className='row'>
                      <InputFormGroup col='col-6' eRef={priceRef} label='Precio unitario' type='number' step='0.001' />
                      <FieldSelect label='Tipo' value={selects.type} placeholder='Sin tipo' options={toOptions(TYPE_OPTIONS, 'Sin tipo')} onChange={(v) => setSelect('type', v)} />
                    </div>
                    <FieldSelect col='col-12' label='Categoría / Línea' value={selects.category_id} placeholder='Sin categoría'
                      options={[{ value: '', label: 'Sin categoría' }, ...categories.map((c) => ({ value: String(c.id), label: c.name }))]}
                      onChange={(v) => setSelect('category_id', v)} />
                    <div className='row'>
                      <FieldSelect label='Segmento' value={selects.segment} placeholder='Sin segmento' options={toOptions(SEGMENT_OPTIONS, 'Sin segmento')} onChange={(v) => setSelect('segment', v)} />
                      <FieldSelect label='Uso' value={selects.use_type} placeholder='Sin uso' options={toOptions(USE_OPTIONS, 'Sin uso')} onChange={(v) => setSelect('use_type', v)} />
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <ImageFormGroup eRef={imageRef} label='Imagen' required={!dataLoaded} aspect='4/3' fit='cover' onError='/assets/img/items/item-1.png' />
                    <TextareaFormGroup eRef={descriptionRef} label='Descripción' rows={3} />
                    <TextareaFormGroup eRef={diametersRef} label='Diámetros disponibles (separados por coma)' rows={2} />
                  </div>
                </div>
              </div>

              <div className='wfi-sec'>
                <h4><i className='mdi mdi-format-list-checks me-1' style={{ color: '#004991' }}></i>Especificaciones</h4>
                <div className='row'>
                  <InputFormGroup col='col-md-3' eRef={materialRef} label='Material' placeholder='PVC-U' />
                  <InputFormGroup col='col-md-3' eRef={colorRef} label='Color' placeholder='Gris' />
                  <InputFormGroup col='col-md-3' eRef={brandRef} label='Marca' placeholder='TUBOPLAST' />
                  <InputFormGroup col='col-md-3' eRef={nominalDiameterRef} label='Diámetro nominal' placeholder='1 1/2"' />
                </div>
                <div className='row'>
                  <InputFormGroup col='col-md-3' eRef={unitRef} label='Unidad de medida' placeholder='UN' />
                  <InputFormGroup col='col-md-3' eRef={masterpackRef} label='Masterpack' type='number' />
                  <InputFormGroup col='col-md-3' eRef={piecesRef} label='N° de piezas' />
                  <InputFormGroup col='col-md-3' eRef={originCountryRef} label='País de origen' placeholder='Perú' />
                </div>
                <div className='row'>
                  <InputFormGroup col='col-md-4' eRef={famconsRef} label='Familia (FAMCONS)' />
                  <InputFormGroup col='col-md-4' eRef={familyRef} label='Familia detallada (FAMILIA)' />
                  <InputFormGroup col='col-md-4' eRef={pressureRef} label='Presión (opcional)' placeholder='Ej. PN-10' />
                </div>
              </div>

              <div className='wfi-sec'>
                <h4><i className='mdi mdi-truck-outline me-1' style={{ color: '#004991' }}></i>Logística</h4>
                <div className='row'>
                  <InputFormGroup col='col-md-4' eRef={packageTypeRef} label='Tipo de empaque' placeholder='Caja' />
                  <InputFormGroup col='col-md-4' eRef={perishableRef} label='Perecible' placeholder='No es perecible (NO)' />
                  <InputFormGroup col='col-md-4' eRef={hazardousRef} label='Producto peligroso' placeholder='No es producto peligroso (NO)' />
                </div>
                <div className='row'>
                  <InputFormGroup col='col-md-3' eRef={productHeightRef} label='Alto producto' type='number' step='0.01' />
                  <InputFormGroup col='col-md-3' eRef={productWidthRef} label='Ancho producto' type='number' step='0.01' />
                  <InputFormGroup col='col-md-3' eRef={productDepthRef} label='Prof. producto' type='number' step='0.01' />
                  <InputFormGroup col='col-md-3' eRef={productWeightRef} label='Peso producto (Kg)' type='number' step='0.001' />
                </div>
                <div className='row'>
                  <InputFormGroup col='col-md-3' eRef={logisticHeightRef} label='Alto u. logística' type='number' step='0.01' />
                  <InputFormGroup col='col-md-3' eRef={logisticWidthRef} label='Ancho u. logística' type='number' step='0.01' />
                  <InputFormGroup col='col-md-3' eRef={logisticDepthRef} label='Prof. u. logística' type='number' step='0.01' />
                  <InputFormGroup col='col-md-3' eRef={logisticWeightRef} label='Peso u. logística (Kg)' type='number' step='0.001' />
                </div>
              </div>

              <div className='wfi-sec'>
                <h4><i className='mdi mdi-alert-outline me-1' style={{ color: '#004991' }}></i>Avisos y recomendaciones de uso</h4>
                <div className='row'>
                  <TextareaFormGroup col='col-md-6' eRef={warrantyRef} label='Garantía' rows={2} />
                  <TextareaFormGroup col='col-md-6' eRef={featuresRef} label='Características' rows={2} />
                </div>
                <div className='row'>
                  <TextareaFormGroup col='col-md-6' eRef={usageRecommendationsRef} label='Recomendaciones de uso' rows={2} />
                  <TextareaFormGroup col='col-md-6' eRef={observationsRef} label='Observaciones' rows={2} />
                </div>
                <TextareaFormGroup eRef={usageWarningRef} label='Advertencia de uso' rows={2} />
              </div>
            </div>

            <div className='wfi-modal-foot'>
              <button type='button' className='wfi-btn outline' onClick={closeForm} disabled={loading}>Cancelar</button>
              <button type='submit' className='wfi-btn' disabled={loading}>
                {loading
                  ? <><span className='spinner-border spinner-border-sm'></span> Guardando...</>
                  : <><i className='mdi mdi-content-save'></i> {dataLoaded ? 'Guardar cambios' : 'Crear item'}</>}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        open={!!confirmTarget}
        title='Eliminar item'
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
    <Adminto {...properties} title='Items'>
      <Items {...properties} />
    </Adminto>
  )
})
