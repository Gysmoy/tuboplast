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

const SEGMENT_OPTIONS = ['Edificaciones', 'Saneamiento', 'Minería', 'Agricultura', 'Industria']
const TYPE_OPTIONS = ['Tubos', 'Conexiones', 'Accesorios']

const formatPrice = (value) => {
  const number = Number(value)
  return Number.isFinite(number) ? `S/ ${number.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'
}

const Items = ({ categories = [] }) => {
  const gridRef = useRef()
  const modalRef = useRef()
  const titleRef = useRef()
  const skuRef = useRef()
  const categoryRef = useRef()
  const segmentRef = useRef()
  const typeRef = useRef()
  const classificationRef = useRef()
  const priceRef = useRef()
  const pressureRef = useRef()
  const diametersRef = useRef()
  const descriptionRef = useRef()
  const imageRef = useRef()

  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(null)

  const refreshGrid = () => $(gridRef.current).dxDataGrid('instance').refresh()

  const setFormValues = (data = null) => {
    titleRef.current.value = data?.title || ''
    skuRef.current.value = data?.sku || ''
    priceRef.current.value = data?.price ?? ''
    pressureRef.current.value = data?.pressure || ''
    classificationRef.current.value = data?.classification || ''
    diametersRef.current.value = Array.isArray(data?.diameters) ? data.diameters.join(', ') : (data?.diameters || '')
    descriptionRef.current.value = data?.description || ''
    $(categoryRef.current).val(data?.category_id ? String(data.category_id) : '').trigger('change')
    $(segmentRef.current).val(data?.segment || '').trigger('change')
    $(typeRef.current).val(data?.type || '').trigger('change')

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

    const item = {
      id: dataLoaded?.id,
      title: titleRef.current.value,
      sku: skuRef.current.value,
      category_id: categoryRef.current.value || '',
      segment: segmentRef.current.value || '',
      type: typeRef.current.value || '',
      classification: classificationRef.current.value,
      price: priceRef.current.value,
      pressure: pressureRef.current.value,
      diameters: diametersRef.current.value,
      description: descriptionRef.current.value,
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
            caption: 'Categoria / Tipo',
            minWidth: 160,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <div>
                <span className='d-block'>{data.category?.name || '-'}</span>
                <small className='text-muted'>{[data.segment, data.type].filter(Boolean).join(' · ') || 'Sin clasificar'}</small>
              </div>)
            }
          },
          {
            dataField: 'price',
            caption: 'Precio',
            width: 120,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <span>{data.price != null ? formatPrice(data.price) : '-'}</span>)
            }
          },
          {
            dataField: 'pressure',
            caption: 'Presion / Diametros',
            width: 200,
            allowSorting: false,
            cellTemplate: (container, { data }) => {
              const count = Array.isArray(data.diameters) ? data.diameters.length : 0
              ReactAppend(container, <div>
                <small className='d-block text-muted text-truncate' style={{ maxWidth: 190 }}>Presion: {data.pressure || '-'}</small>
                <small className='d-block text-muted'>{count} diametros</small>
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
            <InputFormGroup eRef={titleRef} label='Titulo' required />
            <div className='row'>
              <InputFormGroup col='col-6' eRef={skuRef} label='SKU' />
              <InputFormGroup col='col-6' eRef={priceRef} label='Precio (S/)' type='number' step='0.01' />
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
              <SelectFormGroup col='col-6' eRef={typeRef} label='Tipo' dropdownParent='#itemModalSelectParent'>
                <option value=''>Sin tipo</option>
                {TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </SelectFormGroup>
            </div>
            <InputFormGroup eRef={classificationRef} label='Clasificacion' placeholder='Ej. Sistema Simple Presion' />
            <InputFormGroup eRef={pressureRef} label='Presion' placeholder='Ej. 10 bar (PN-10)' />
          </div>
          <div className='col-md-6'>
            <ImageFormGroup
              eRef={imageRef}
              label='Imagen'
              required={!dataLoaded}
              aspect='4/3'
              fit='cover'
            />
            <TextareaFormGroup eRef={diametersRef} label='Diametros (separados por coma)' rows={2} />
            <TextareaFormGroup eRef={descriptionRef} label='Descripcion' rows={3} />
          </div>
        </div>
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
