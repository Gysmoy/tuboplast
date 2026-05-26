import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import ReactAppend from '../Utils/ReactAppend.jsx'
import Adminto from '../Components/Adminto.jsx'
import Modal from '../Components/Modal.jsx'
import Table from '../Components/Table.jsx'
import InputFormGroup from '../Components/Form/InputFormGroup.jsx'
import TextareaFormGroup from '../Components/Form/TextareaFormGroup.jsx'
import ImageFormGroup from '../Components/Form/ImageFormGroup.jsx'
import SwitchFormGroup from '../Components/Form/SwitchFormGroup.jsx'
import TippyButton from '../Components/Form/TippyButton.jsx'
import CategoriesRest from '../Actions/Admin/CategoriesRest.js'

const categoriesRest = new CategoriesRest()

const Categories = () => {
  const gridRef = useRef()
  const modalRef = useRef()
  const nameRef = useRef()
  const descriptionRef = useRef()
  const imageRef = useRef()

  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(null)

  const refreshGrid = () => $(gridRef.current).dxDataGrid('instance').refresh()

  const setFormValues = (data = null) => {
    nameRef.current.value = data?.name || ''
    descriptionRef.current.value = data?.description || ''
    imageRef.current.value = ''

    if (imageRef.current?.image) {
      imageRef.current.image.src = data?.image
        ? `/api/categories/media/${data.image}`
        : '/api/categories/media/undefined'
    }
  }

  const onModalOpen = (data = null) => {
    setDataLoaded(data)
    $(modalRef.current).modal('show')
    setTimeout(() => setFormValues(data), 50)
  }

  const onDeleteClicked = async (id) => {
    const ok = await categoriesRest.delete(id)
    if (!ok) return
    refreshGrid()
  }

  const onSaveSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    const category = {
      id: dataLoaded?.id,
      name: nameRef.current.value,
      description: descriptionRef.current.value,
      status: true,
      image: imageRef.current.files?.[0] ?? null
    }

    if (!category.id && !category.image) {
      alert('La imagen es obligatoria para registrar una categoria.')
      return
    }

    setLoading(true)
    const result = await categoriesRest.save(category)
    setLoading(false)

    if (!result) return
    $(modalRef.current).modal('hide')
    refreshGrid()
  }

  return (
    <>
      <Table
        gridRef={gridRef}
        title='Categorias'
        rest={categoriesRest}
        toolBar={(container) => {
          container.unshift({
            widget: 'dxButton',
            location: 'after',
            options: {
              icon: 'plus',
              hint: 'Nueva categoria',
              onClick: () => onModalOpen(null)
            }
          })
          container.unshift({
            widget: 'dxButton',
            location: 'after',
            options: {
              icon: 'refresh',
              hint: 'Refrescar tabla',
              onClick: refreshGrid
            }
          })
        }}
        columns={[
          {
            dataField: 'name',
            caption: 'Nombre',
            sortOrder: 'asc',
            minWidth: 220
          },
          {
            dataField: 'description',
            caption: 'Descripcion',
            minWidth: 280,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <span style={{ whiteSpace: 'normal' }}>{data.description || '-'}</span>)
            }
          },
          {
            dataField: 'image',
            caption: 'Imagen',
            width: 130,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <img
                src={`/api/categories/media/${data.image}`}
                alt={data.name}
                style={{ width: '96px', height: '64px', objectFit: 'cover', borderRadius: '8px' }}
              />)
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
                  id={`switch-category-${data.id}`}
                  checked={Boolean(data.status)}
                  noMargin
                  onChange={async () => {
                    await categoriesRest.status({ id: data.id, status: data.status })
                    refreshGrid()
                  }}
                />
              )
            }
          },
          {
            dataField: 'created_at',
            caption: 'Fecha',
            dataType: 'date',
            width: 130,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <span>{moment(data.created_at).format('LL')}</span>)
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
        title={dataLoaded ? 'Editar categoria' : 'Nueva categoria'}
        onClose={() => setDataLoaded(null)}
        onSubmit={onSaveSubmit}
        loading={loading}
        size='lg'
      >
        <div className='row'>
          <div className="col-md-6">
          <InputFormGroup eRef={nameRef} label='Nombre' required />
          <TextareaFormGroup eRef={descriptionRef} label='Descripcion' rows={4} />
          </div>
          <ImageFormGroup
            col='col-md-6'
            eRef={imageRef}
            label='Imagen'
            required={!dataLoaded}
            aspect='16/9'
            fit='cover'
          />
        </div>
      </Modal>
    </>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Adminto {...properties} title='Categorias'>
      <Categories {...properties} />
    </Adminto>
  )
})

