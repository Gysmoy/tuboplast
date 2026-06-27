import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import ReactAppend from '../Utils/ReactAppend.jsx'
import Adminto from '../Components/Adminto.jsx'
import Modal from '../Components/Modal.jsx'
import Table from '../Components/Table.jsx'
import InputFormGroup from '../Components/Form/InputFormGroup.jsx'
import TextareaFormGroup from '../Components/Form/TextareaFormGroup.jsx'
import SelectFormGroup from '../Components/Form/SelectFormGroup.jsx'
import ImageFormGroup from '../Components/Form/ImageFormGroup.jsx'
import SwitchFormGroup from '../Components/Form/SwitchFormGroup.jsx'
import TippyButton from '../Components/Form/TippyButton.jsx'
import ItemsRest from '../Actions/Admin/ItemsRest.js'

const itemsRest = new ItemsRest()

const SEGMENT_OPTIONS = ['PREDIAL', 'INFRAESTRUCTURA']
const TYPE_OPTIONS = ['Tubos', 'Conexiones', 'Accesorios', 'Anillos']
const USE_OPTIONS = ['AGUA FRIA', 'AGUA POTABLE', 'DESAGUE', 'ALCANTARILLADO', 'ELECTRICO']
const CURRENCY_OPTIONS = [{ value: 'PEN', label: 'PEN (S/)' }, { value: 'USD', label: 'USD ($)' }]

const formatPrice = (value, currency = 'PEN') => {
  const number = Number(value)
  if (!Number.isFinite(number)) return '-'
  const symbol = String(currency).toUpperCase() === 'USD' ? '$' : 'S/'
  return `${symbol} ${number.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const SectionTitle = ({ children }) => (
  <h6 className='text-uppercase fw-bold text-muted mt-2 mb-2' style={{ fontSize: '11px', letterSpacing: '0.06em' }}>{children}</h6>
)

const Items = ({ categories = [] }) => {
  const gridRef = useRef()
  const modalRef = useRef()

  // Básicos
  const titleRef = useRef()
  const skuRef = useRef()
  const categoryRef = useRef()
  const segmentRef = useRef()
  const typeRef = useRef()
  const priceRef = useRef()
  const currencyRef = useRef()
  const imageRef = useRef()
  const descriptionRef = useRef()
  const diametersRef = useRef()

  // Especificaciones
  const useTypeRef = useRef()
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

  const refreshGrid = () => $(gridRef.current).dxDataGrid('instance').refresh()

  const setFormValues = (data = null) => {
    const set = (ref, value) => { if (ref.current) ref.current.value = value ?? '' }

    set(titleRef, data?.title)
    set(skuRef, data?.sku)
    set(priceRef, data?.price)
    set(pressureRef, data?.pressure)
    set(useTypeRef, data?.use_type)
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

    $(categoryRef.current).val(data?.category_id ? String(data.category_id) : '').trigger('change')
    $(segmentRef.current).val(data?.segment || '').trigger('change')
    $(typeRef.current).val(data?.type || '').trigger('change')
    $(useTypeRef.current).val(data?.use_type || '').trigger('change')
    $(currencyRef.current).val(data?.currency || 'PEN').trigger('change')

    imageRef.current.value = ''
    if (imageRef.current?.image) {
      imageRef.current.image.src = data?.image
        ? `/storage/${data.image}`
        : '/assets/img/items/item-1.png'
    }
  }

  const onModalOpen = (data = null) => {
    setDataLoaded(data)
    $(modalRef.current).modal('show')
    setTimeout(() => setFormValues(data), 50)
  }

  const onDeleteClicked = async (id) => {
    const ok = await itemsRest.delete(id)
    if (!ok) return
    refreshGrid()
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
      category_id: categoryRef.current.value || '',
      segment: segmentRef.current.value || '',
      type: typeRef.current.value || '',
      use_type: useTypeRef.current.value || '',
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
      currency: currencyRef.current.value || 'PEN',
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
      alert('La imagen es obligatoria para registrar un item.')
      return
    }

    setLoading(true)
    const result = await itemsRest.save(item)
    setLoading(false)

    if (!result) return
    $(modalRef.current).modal('hide')
    refreshGrid()
  }

  return (
    <>
      <Table
        gridRef={gridRef}
        title='Items'
        rest={itemsRest}
        toolBar={(container) => {
          container.unshift({
            widget: 'dxButton',
            location: 'after',
            options: { icon: 'plus', hint: 'Nuevo item', onClick: () => onModalOpen(null) }
          })
          container.unshift({
            widget: 'dxButton',
            location: 'after',
            options: { icon: 'refresh', hint: 'Refrescar tabla', onClick: refreshGrid }
          })
        }}
        columns={[
          {
            dataField: 'image',
            caption: 'Imagen',
            width: 110,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <img
                src={data.image ? `/storage/${data.image}` : '/assets/img/items/item-1.png'}
                alt={data.title}
                style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
              />)
            }
          },
          {
            dataField: 'title',
            caption: 'Producto',
            minWidth: 240,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <div>
                <span className='d-block fw-semibold' style={{ whiteSpace: 'normal' }}>{data.title}</span>
                <small className='text-muted'>{data.sku || 'Sin SKU'}</small>
              </div>)
            }
          },
          {
            dataField: 'category_id',
            caption: 'Categoria / Clasificacion',
            minWidth: 180,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <div>
                <span className='d-block'>{data.category?.name || '-'}</span>
                <small className='text-muted'>{[data.segment, data.type, data.use_type].filter(Boolean).join(' · ') || 'Sin clasificar'}</small>
              </div>)
            }
          },
          {
            dataField: 'price',
            caption: 'Precio',
            width: 130,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <span>{data.price != null ? formatPrice(data.price, data.currency) : '-'}</span>)
            }
          },
          {
            dataField: 'use_type',
            caption: 'Uso / Diametro',
            width: 200,
            allowSorting: false,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <div>
                <small className='d-block text-muted text-truncate' style={{ maxWidth: 190 }}>{data.use_type || '-'}</small>
                <small className='d-block text-muted'>{data.nominal_diameter || data.diameter || '-'}</small>
              </div>)
            }
          },
          {
            dataField: 'status',
            caption: 'Estado',
            width: 100,
            allowFiltering: false,
            cellTemplate: (container, { data }) => {
              ReactAppend(container,
                <SwitchFormGroup
                  id={`switch-item-${data.id}`}
                  checked={Boolean(data.status)}
                  noMargin
                  onChange={async () => {
                    await itemsRest.status({ id: data.id, status: data.status })
                    refreshGrid()
                  }}
                />
              )
            }
          },
          {
            caption: 'Acciones',
            width: 120,
            cellTemplate: (container, { data }) => {
              container.attr('style', 'display: flex; gap: 4px; overflow: unset')
              ReactAppend(container, <TippyButton className='btn btn-sm btn-soft-primary' title='Editar' onClick={() => onModalOpen(data)}>
                <i className='mdi mdi-square-edit-outline'></i>
              </TippyButton>)
              ReactAppend(container, <TippyButton className='btn btn-sm btn-soft-danger' title='Eliminar' onClick={() => onDeleteClicked(data.id)}>
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
        title={dataLoaded ? 'Editar item' : 'Nuevo item'}
        onClose={() => setDataLoaded(null)}
        onSubmit={onSaveSubmit}
        loading={loading}
        size='lg'
      >
        <div className='row'>
          <div className='col-md-6'>
            <SectionTitle>Datos básicos</SectionTitle>
            <InputFormGroup eRef={titleRef} label='Titulo' required />
            <div className='row'>
              <InputFormGroup col='col-6' eRef={skuRef} label='SKU (Codigo)' />
              <SelectFormGroup col='col-6' eRef={currencyRef} label='Moneda' dropdownParent='#itemModalSelectParent'>
                {CURRENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </SelectFormGroup>
            </div>
            <div className='row'>
              <InputFormGroup col='col-6' eRef={priceRef} label='Precio unitario' type='number' step='0.001' />
              <SelectFormGroup col='col-6' eRef={typeRef} label='Tipo' dropdownParent='#itemModalSelectParent'>
                <option value=''>Sin tipo</option>
                {TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </SelectFormGroup>
            </div>
            <SelectFormGroup eRef={categoryRef} label='Categoria / Linea' dropdownParent='#itemModalSelectParent'>
              <option value=''>Sin categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </SelectFormGroup>
            <div className='row'>
              <SelectFormGroup col='col-6' eRef={segmentRef} label='Segmento' dropdownParent='#itemModalSelectParent'>
                <option value=''>Sin segmento</option>
                {SEGMENT_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </SelectFormGroup>
              <SelectFormGroup col='col-6' eRef={useTypeRef} label='Uso' dropdownParent='#itemModalSelectParent'>
                <option value=''>Sin uso</option>
                {USE_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </SelectFormGroup>
            </div>
          </div>
          <div className='col-md-6'>
            <SectionTitle>Imagen y descripción</SectionTitle>
            <ImageFormGroup
              eRef={imageRef}
              label='Imagen'
              required={!dataLoaded}
              aspect='4/3'
              fit='cover'
            />
            <TextareaFormGroup eRef={descriptionRef} label='Descripcion' rows={3} />
            <TextareaFormGroup eRef={diametersRef} label='Diametros disponibles (separados por coma)' rows={2} />
          </div>
        </div>

        <hr className='my-2' />
        <SectionTitle>Especificaciones</SectionTitle>
        <div className='row'>
          <InputFormGroup col='col-md-3' eRef={materialRef} label='Material' placeholder='PVC-U' />
          <InputFormGroup col='col-md-3' eRef={colorRef} label='Color' placeholder='Gris' />
          <InputFormGroup col='col-md-3' eRef={brandRef} label='Marca' placeholder='TUBOPLAST' />
          <InputFormGroup col='col-md-3' eRef={nominalDiameterRef} label='Diametro nominal' placeholder='1 1/2"' />
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
          <InputFormGroup col='col-md-4' eRef={pressureRef} label='Presion (opcional)' placeholder='Ej. PN-10' />
        </div>

        <hr className='my-2' />
        <SectionTitle>Logística</SectionTitle>
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

        <hr className='my-2' />
        <SectionTitle>Avisos y recomendaciones de uso</SectionTitle>
        <div className='row'>
          <TextareaFormGroup col='col-md-6' eRef={warrantyRef} label='Garantía' rows={2} />
          <TextareaFormGroup col='col-md-6' eRef={featuresRef} label='Características' rows={2} />
        </div>
        <div className='row'>
          <TextareaFormGroup col='col-md-6' eRef={usageRecommendationsRef} label='Recomendaciones de uso' rows={2} />
          <TextareaFormGroup col='col-md-6' eRef={observationsRef} label='Observaciones' rows={2} />
        </div>
        <TextareaFormGroup eRef={usageWarningRef} label='Advertencia de uso' rows={2} />

        <div id='itemModalSelectParent'></div>
      </Modal>
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
