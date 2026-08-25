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
.wfi-btn.soft{background:#e6effa;color:#004991;}.wfi-btn.soft:hover{background:#d6e6f7;color:#003b7a;}
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
.wfi-import-modal{width:min(720px,96vw);}
.wfi-drop{border:1.5px dashed #b9c8da;border-radius:14px;background:#f8fbff;min-height:150px;padding:22px;display:flex;align-items:center;justify-content:center;text-align:center;cursor:pointer;transition:border-color .2s,background .2s;}
.wfi-drop.drag{border-color:#004991;background:#eef6ff;}
.wfi-drop i{font-size:34px;color:#004991;}
.wfi-drop strong{display:block;color:#0f2540;font-size:14px;margin-top:8px;}
.wfi-drop span{display:block;color:#7d8798;font-size:12px;margin-top:4px;}
.wfi-file-pill{display:inline-flex;align-items:center;gap:8px;margin-top:10px;padding:8px 10px;border-radius:10px;background:#fff;border:1px solid #dce5f0;color:#0f2540;font-size:12px;font-weight:600;max-width:100%;}
.wfi-file-pill span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.wfi-drop-grid{display:grid;grid-template-columns:1fr;gap:12px;}
@media(min-width:640px){.wfi-drop-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
.wfi-mode-grid{display:grid;grid-template-columns:1fr;gap:10px;}
@media(min-width:640px){.wfi-mode-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
.wfi-mode{position:relative;border:1px solid #e2eaf4;border-radius:12px;padding:12px 12px 12px 42px;cursor:pointer;min-height:106px;transition:border-color .2s,box-shadow .2s,background .2s;}
.wfi-mode:hover{border-color:#b9c8da;background:#fbfdff;}
.wfi-mode.on{border-color:#004991;box-shadow:0 0 0 3px rgba(0,73,145,.08);background:#f8fbff;}
.wfi-mode input{position:absolute;left:14px;top:16px;}
.wfi-mode b{display:block;color:#0f2540;font-size:13px;margin-bottom:4px;}
.wfi-mode span{display:block;color:#6c7789;font-size:12px;line-height:1.45;}
.wfi-warn{display:flex;gap:8px;background:#fff7ed;color:#9a3412;border:1px solid #fed7aa;border-radius:10px;padding:10px 12px;font-size:12px;line-height:1.45;}
.wfi-multi{display:grid;grid-template-columns:1fr;gap:6px;max-height:150px;overflow-y:auto;border:1px solid #dce5f0;border-radius:10px;background:#fff;padding:8px;}
.wfi-multi label{display:flex;align-items:center;gap:7px;margin:0;padding:5px 6px;border-radius:7px;color:#0f2540;font-size:12.5px;font-weight:600;cursor:pointer;}
.wfi-multi label:hover{background:#f4f8fd;}
.wfi-multi input{accent-color:#004991;}
`

const ARCHIVE_PATTERN = /\.(zip|rar)$/i
const ARCHIVE_MAX_MB = 100
const USE_OPTIONS = ['AGUA FRIA', 'AGUA POTABLE', 'DESAGUE', 'ALCANTARILLADO', 'ELECTRICO']
const CURRENCY_OPTIONS = [{ value: 'PEN', label: 'PEN (S/)' }, { value: 'USD', label: 'USD ($)' }]
const ITEM_FALLBACK_IMAGE = '/assets/img/items/item-1.png'

const itemImagePath = (item) => item?.image || item?.images?.[0]?.path || ''
const itemImageUrl = (item) => {
  const image = itemImagePath(item)
  if (!image) return ITEM_FALLBACK_IMAGE
  if (/^(https?:)?\/\//.test(image) || image.startsWith('/')) return image
  return `/storage/${image}`
}
const onItemImageError = (event) => {
  if (!event.target.src.endsWith(ITEM_FALLBACK_IMAGE)) event.target.src = ITEM_FALLBACK_IMAGE
}

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

const FieldMultiSegment = ({ col = 'col-6', label, value = [], options, onChange }) => {
  const selected = Array.isArray(value) ? value.map(String) : []
  const toggle = (id) => {
    const key = String(id)
    onChange(selected.includes(key) ? selected.filter((item) => item !== key) : [...selected, key])
  }

  return (
    <div className={`form-group ${col} mb-2`}>
      <label className='form-label'>{label}</label>
      <div className='wfi-multi'>
        {options.map((option) => (
          <label key={option.value}>
            <input type='checkbox' checked={selected.includes(String(option.value))} onChange={() => toggle(option.value)} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

const Items = ({ categories = [], segments = [], lines = [], classifications = [], families = [], types = [] }) => {
  const tableRef = useRef(null)
  const importInputRef = useRef(null)
  const importZipInputRef = useRef(null)
  const importSheetsZipInputRef = useRef(null)

  // Básicos
  const titleRef = useRef()
  const skuRef = useRef()
  const priceRef = useRef()
  const imageRef = useRef()
  const galleryImagesRef = useRef()
  const technicalSheetRef = useRef()
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
  const [importOpen, setImportOpen] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [importImagesZip, setImportImagesZip] = useState(null)
  const [importSheetsZip, setImportSheetsZip] = useState(null)
  const [importMode, setImportMode] = useState('upsert')
  const [importDragging, setImportDragging] = useState(null)
  const [importLoading, setImportLoading] = useState(false)
  const [importError, setImportError] = useState('')
  const [selects, setSelects] = useState({
    category_id: '',
    product_segment_id: '',
    product_segment_ids: [],
    product_line_id: '',
    product_classification_id: '',
    product_family_id: '',
    product_type_id: '',
    use_type: '',
    currency: 'PEN',
  })

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
      product_segment_id: data?.product_segment_id ? String(data.product_segment_id) : '',
      product_segment_ids: Array.isArray(data?.product_segments) && data.product_segments.length
        ? data.product_segments.map((row) => String(row.id))
        : (data?.product_segment_id ? [String(data.product_segment_id)] : []),
      product_line_id: data?.product_line_id ? String(data.product_line_id) : '',
      product_classification_id: data?.product_classification_id ? String(data.product_classification_id) : '',
      product_family_id: data?.product_family_id ? String(data.product_family_id) : '',
      product_type_id: data?.product_type_id ? String(data.product_type_id) : '',
      use_type: data?.use_type || '',
      currency: data?.currency || 'PEN',
    })

    if (imageRef.current) imageRef.current.value = ''
    if (galleryImagesRef.current) galleryImagesRef.current.value = ''
    if (imageRef.current?.image) {
      imageRef.current.image.src = itemImageUrl(data)
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
    document.body.style.overflow = (formOpen || importOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [formOpen, importOpen])

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

  const openImport = () => {
    setImportFile(null)
    setImportImagesZip(null)
    setImportSheetsZip(null)
    setImportMode('upsert')
    setImportError('')
    setImportDragging(null)
    setImportOpen(true)
    if (importInputRef.current) importInputRef.current.value = ''
    if (importZipInputRef.current) importZipInputRef.current.value = ''
    if (importSheetsZipInputRef.current) importSheetsZipInputRef.current.value = ''
  }

  const closeImport = () => {
    if (importLoading) return
    setImportOpen(false)
    setImportError('')
    setImportDragging(null)
  }

  const selectImportFile = (file) => {
    if (!file) return
    const name = file.name || ''
    const allowed = /\.(xlsx|csv)$/i.test(name)
    if (!allowed) {
      setImportFile(null)
      setImportError('Selecciona un archivo .xlsx o .csv.')
      return
    }
    setImportError('')
    setImportFile(file)
  }

  const selectArchive = (file, setter, subject) => {
    if (!file) return
    if (!ARCHIVE_PATTERN.test(file.name || '')) {
      setter(null)
      setImportError(`Selecciona un archivo .zip o .rar para ${subject}.`)
      return
    }
    if (file.size > ARCHIVE_MAX_MB * 1024 * 1024) {
      setter(null)
      setImportError(`El comprimido de ${subject} supera los ${ARCHIVE_MAX_MB} MB permitidos.`)
      return
    }
    setImportError('')
    setter(file)
  }

  const selectImagesZip = (file) => selectArchive(file, setImportImagesZip, 'las imágenes')

  const selectSheetsZip = (file) => selectArchive(file, setImportSheetsZip, 'las fichas técnicas')

  const onImportSubmit = async (e) => {
    e.preventDefault()
    if (importLoading) return

    if (!importFile) {
      setImportError('Selecciona o arrastra un archivo Excel antes de importar.')
      return
    }

    setImportError('')
    setImportLoading(true)
    const result = await itemsRest.import({ file: importFile, mode: importMode, imagesZip: importImagesZip, sheetsZip: importSheetsZip })
    setImportLoading(false)

    if (!result) return
    setImportOpen(false)
    refreshGrid()
  }

  const onSaveSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    const family = families.find((row) => String(row.id) === selects.product_family_id)?.name || ''
    const nominal = nominalDiameterRef.current.value
    const segmentIds = selects.product_segment_ids || []
    const primarySegmentId = segmentIds[0] || selects.product_segment_id || ''

    const item = {
      id: dataLoaded?.id,
      title: titleRef.current.value,
      sku: skuRef.current.value,
      category_id: selects.category_id || '',
      product_segment_id: primarySegmentId,
      product_segment_ids: segmentIds,
      product_line_id: selects.product_line_id || '',
      product_classification_id: selects.product_classification_id || '',
      product_family_id: selects.product_family_id || '',
      product_type_id: selects.product_type_id || '',
      segment: segments.find((row) => String(row.id) === primarySegmentId)?.name || '',
      type: types.find((row) => String(row.id) === selects.product_type_id)?.name || '',
      use_type: selects.use_type || '',
      family,
      classification: classifications.find((row) => String(row.id) === selects.product_classification_id)?.name || '',
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
      image: imageRef.current.files?.[0] ?? null,
      gallery_images: Array.from(galleryImagesRef.current?.files || []),
      technical_sheet: technicalSheetRef.current.files?.[0] ?? null
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
        headerActions={(
          <>
            <button type='button' className='wfi-btn soft' onClick={openImport}><i className='mdi mdi-upload'></i> Carga másiva</button>
            <button type='button' className='wfi-btn' onClick={() => onModalOpen(null)}><i className='mdi mdi-plus'></i> Nuevo item</button>
          </>
        )}
        columns={[
          {
            key: 'image', header: 'Imagen', filterable: false, sortable: false, width: 90,
            render: (d) => <img src={itemImageUrl(d)} alt={d.title} className='wfi-thumb' onError={onItemImageError} />,
          },
          {
            key: 'title', header: 'Producto', field: 'title', filterFields: ['title', 'sku'], width: 280,
            render: (d) => (<><span className='fw-semibold d-block'>{d.title}</span><small className='text-muted'>{d.sku || 'Sin SKU'}</small></>),
          },
          {
            key: 'segment', header: 'Categoría / Clasificación', field: 'segment', filterFields: ['segment', 'type', 'use_type'], nowrap: true,
            render: (d) => {
              const segmentLabel = Array.isArray(d.product_segments) && d.product_segments.length
                ? d.product_segments.map((row) => row.name).filter(Boolean).join(' · ')
                : (d.product_segment?.name || d.segment)

              return (<><span className='d-block'>{d.product_line?.name || d.category?.name || '-'}</span><small className='text-muted'>{[segmentLabel, d.product_classification?.name || d.classification, d.product_type?.name || d.type].filter(Boolean).join(' · ') || 'Sin clasificar'}</small></>)
            },
          },
          {
            key: 'family', header: 'Familia', field: 'family', filterFields: ['family', 'product_family.name'], nowrap: true,
            render: (d) => <span className='fw-semibold'>{d.product_family?.name || d.family || '-'}</span>,
          },
          {
            key: 'price', header: 'Precio', field: 'price', filterable: false, align: 'right', nowrap: true,
            render: (d) => <span className='fw-semibold' style={{ color: '#004991' }}>{d.price != null ? formatPrice(d.price, d.currency) : '-'}</span>,
          },
          {
            key: 'technical_sheet', header: 'Ficha', field: 'technical_sheet', filterable: false, sortable: false, align: 'center', width: 80,
            render: (d) => d.technical_sheet
              ? <a href={`/storage/${d.technical_sheet}`} target='_blank' rel='noreferrer' className='text-danger fs-4' title='Ver ficha técnica'><i className='mdi mdi-file-pdf-box'></i></a>
              : <span className='text-muted'>-</span>,
          },
          {
            key: 'use_type', header: 'Uso / Diámetro', field: 'use_type', filterFields: ['use_type', 'nominal_diameter'], nowrap: true,
            render: (d) => (<><small className='d-block text-muted'>{d.use_type || '-'}</small><small className='d-block text-muted'>{d.nominal_diameter || d.diameter || '-'}</small></>),
          },
          {
            key: 'status', header: 'Estado', field: 'status', align: 'center',
            filterOptions: [{ value: '1', label: 'Activo' }, { value: '0', label: 'Inactivo' }],
            render: (d) => {
              const isActive = d.status === true || d.status === 1 || d.status === '1'
              return (
                <SwitchFormGroup id={`switch-item-${d.id}`} checked={isActive} refreshable={isActive} noMargin
                  onChange={async (event) => { await itemsRest.status({ id: d.id, status: !event.currentTarget.checked }); tableRef.current?.reload() }} />
              )
            },
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
                      <FieldSelect label='Tipo' value={selects.product_type_id} placeholder='Sin tipo'
                        options={[{ value: '', label: 'Sin tipo' }, ...types.map((c) => ({ value: String(c.id), label: c.name }))]}
                        onChange={(v) => setSelect('product_type_id', v)} />
                    </div>
                    <FieldSelect col='col-12' label='Categoría / Línea' value={selects.category_id} placeholder='Sin categoría'
                      options={[{ value: '', label: 'Sin categoría' }, ...categories.map((c) => ({ value: String(c.id), label: c.name }))]}
                      onChange={(v) => setSelect('category_id', v)} />
                    <div className='row'>
                      <FieldMultiSegment label='Segmentos' value={selects.product_segment_ids}
                        options={segments.map((c) => ({ value: String(c.id), label: c.name }))}
                        onChange={(v) => setSelects((cur) => ({ ...cur, product_segment_ids: v, product_segment_id: v[0] || '' }))} />
                      <FieldSelect label='Uso' value={selects.use_type} placeholder='Sin uso' options={toOptions(USE_OPTIONS, 'Sin uso')} onChange={(v) => setSelect('use_type', v)} />
                    </div>
                    <div className='row'>
                      <FieldSelect label='Línea de producto' value={selects.product_line_id} placeholder='Sin línea'
                        options={[{ value: '', label: 'Sin línea' }, ...lines.map((c) => ({ value: String(c.id), label: c.name }))]}
                        onChange={(v) => setSelect('product_line_id', v)} />
                      <FieldSelect label='Clasificación' value={selects.product_classification_id} placeholder='Sin clasificación'
                        options={[{ value: '', label: 'Sin clasificación' }, ...classifications.map((c) => ({ value: String(c.id), label: c.name }))]}
                        onChange={(v) => setSelect('product_classification_id', v)} />
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <ImageFormGroup eRef={imageRef} label='Imagen' required={!dataLoaded} aspect='4/3' fit='cover' onError={ITEM_FALLBACK_IMAGE} />
                    <div className='form-group mb-2'>
                      <label className='form-label'>Galería de imágenes</label>
                      <input ref={galleryImagesRef} type='file' className='form-control' accept='image/*' multiple />
                      <small className='text-muted'>Puedes seleccionar varias fotos. La primera quedará como imagen principal.</small>
                    </div>
                    <div className='form-group mb-2'>
                      <label className='form-label'>Ficha técnica PDF</label>
                      <input ref={technicalSheetRef} type='file' className='form-control' accept='application/pdf' />
                      {dataLoaded?.technical_sheet && (
                        <a href={`/storage/${dataLoaded.technical_sheet}`} target='_blank' rel='noreferrer' className='small text-primary d-inline-flex align-items-center gap-1 mt-2'>
                          <i className='mdi mdi-file-pdf-box'></i> Ver ficha actual
                        </a>
                      )}
                    </div>
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
                  <FieldSelect col='col-md-4' label='Familia (FAMILIA)' value={selects.product_family_id} placeholder='Sin familia'
                    options={[{ value: '', label: 'Sin familia' }, ...families.map((c) => ({ value: String(c.id), label: c.name }))]}
                    onChange={(v) => setSelect('product_family_id', v)} />
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

      <div className='wfi-modal-ovl' style={{ display: importOpen ? 'flex' : 'none' }} onMouseDown={closeImport}>
        <div className='wfi-modal wfi-import-modal' onMouseDown={(e) => e.stopPropagation()}>
          <form onSubmit={onImportSubmit}>
            <div className='wfi-modal-head'>
              <h3 className='wfi-h2' style={{ fontSize: 16 }}>
                <i className='mdi mdi-file-excel-outline me-1' style={{ color: '#004991' }}></i>
                Carga másiva de items
              </h3>
              <button type='button' className='wfi-close' onClick={closeImport}><i className='mdi mdi-close'></i></button>
            </div>

            <div className='wfi-modal-body'>
              {importError && <div className='wfi-err'><i className='mdi mdi-alert-circle-outline'></i>{importError}</div>}

              <input
                ref={importInputRef}
                type='file'
                accept='.xlsx,.csv'
                hidden
                onChange={(e) => selectImportFile(e.target.files?.[0])}
              />

              <input
                ref={importZipInputRef}
                type='file'
                accept='.zip,.rar'
                hidden
                onChange={(e) => selectImagesZip(e.target.files?.[0])}
              />

              <input
                ref={importSheetsZipInputRef}
                type='file'
                accept='.zip,.rar'
                hidden
                onChange={(e) => selectSheetsZip(e.target.files?.[0])}
              />

              <button
                type='button'
                className={`wfi-drop ${importDragging === 'excel' ? 'drag' : ''}`}
                onClick={() => importInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setImportDragging('excel') }}
                onDragLeave={() => setImportDragging(null)}
                onDrop={(e) => {
                  e.preventDefault()
                  setImportDragging(null)
                  selectImportFile(e.dataTransfer.files?.[0])
                }}
              >
                <div>
                  <i className='mdi mdi-cloud-upload-outline'></i>
                  <strong>Arrastra tu Excel aquí o haz clic para seleccionarlo</strong>
                  <span>Formatos soportados: .xlsx y .csv. Usa Código Producto y, opcionalmente, CÓDIGO IMAGEN.</span>
                  {importFile && (
                    <div className='wfi-file-pill'>
                      <i className='mdi mdi-file-check-outline' style={{ color: '#16a34a' }}></i>
                      <span>{importFile.name}</span>
                    </div>
                  )}
                </div>
              </button>

              <div className='wfi-drop-grid'>
                <button
                  type='button'
                  className={`wfi-drop ${importDragging === 'images' ? 'drag' : ''}`}
                  style={{ minHeight: 128, padding: 18 }}
                  onClick={() => importZipInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setImportDragging('images') }}
                  onDragLeave={() => setImportDragging(null)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setImportDragging(null)
                    selectImagesZip(e.dataTransfer.files?.[0])
                  }}
                >
                  <div>
                    <i className='mdi mdi-folder-zip-outline'></i>
                    <strong>Comprimido de imágenes opcional</strong>
                    <span>.zip o .rar hasta {ARCHIVE_MAX_MB} MB. Nombres esperados: CODIGO.png o CODIGO-1.jpg. CODIGO puede ser Código Producto o CÓDIGO IMAGEN.</span>
                    {importImagesZip && (
                      <div className='wfi-file-pill'>
                        <i className='mdi mdi-file-check-outline' style={{ color: '#16a34a' }}></i>
                        <span>{importImagesZip.name}</span>
                      </div>
                    )}
                  </div>
                </button>

                <button
                  type='button'
                  className={`wfi-drop ${importDragging === 'sheets' ? 'drag' : ''}`}
                  style={{ minHeight: 128, padding: 18 }}
                  onClick={() => importSheetsZipInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setImportDragging('sheets') }}
                  onDragLeave={() => setImportDragging(null)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setImportDragging(null)
                    selectSheetsZip(e.dataTransfer.files?.[0])
                  }}
                >
                  <div>
                    <i className='mdi mdi-file-pdf-box'></i>
                    <strong>Comprimido de fichas técnicas opcional</strong>
                    <span>.zip o .rar hasta {ARCHIVE_MAX_MB} MB. Nombres esperados: CODIGO.pdf. CODIGO puede ser Código Producto o CÓDIGO IMAGEN.</span>
                    {importSheetsZip && (
                      <div className='wfi-file-pill'>
                        <i className='mdi mdi-file-check-outline' style={{ color: '#16a34a' }}></i>
                        <span>{importSheetsZip.name}</span>
                      </div>
                    )}
                  </div>
                </button>
              </div>

              <div>
                <label className='form-label'>Tipo de carga</label>
                <div className='wfi-mode-grid'>
                  <label className={`wfi-mode ${importMode === 'replace' ? 'on' : ''}`}>
                    <input type='radio' name='import-mode' value='replace' checked={importMode === 'replace'} onChange={(e) => setImportMode(e.target.value)} />
                    <b>Actualizar por completo</b>
                    <span>Elimina los items actuales y crea nuevamente todos los productos del archivo.</span>
                  </label>
                  <label className={`wfi-mode ${importMode === 'upsert' ? 'on' : ''}`}>
                    <input type='radio' name='import-mode' value='upsert' checked={importMode === 'upsert'} onChange={(e) => setImportMode(e.target.value)} />
                    <b>Agregado parcial</b>
                    <span>Busca por SKU: si existe lo actualiza, si no existe lo agrega como nuevo item.</span>
                  </label>
                </div>
              </div>

              {importMode === 'replace' && (
                <div className='wfi-warn'>
                  <i className='mdi mdi-alert-outline'></i>
                  <span>Esta opción reemplaza el catálogo de items. Si el archivo no puede procesarse, la operación se revierte automáticamente.</span>
                </div>
              )}
            </div>

            <div className='wfi-modal-foot'>
              <button type='button' className='wfi-btn outline' onClick={closeImport} disabled={importLoading}>Cancelar</button>
              <button type='submit' className='wfi-btn' disabled={importLoading}>
                {importLoading
                  ? <><span className='spinner-border spinner-border-sm'></span> Importando...</>
                  : <><i className='mdi mdi-upload'></i> Importar items</>}
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

