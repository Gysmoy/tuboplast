import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import ReactAppend from '../Utils/ReactAppend.jsx'
import Adminto from '../Components/Adminto.jsx'
import Modal from '../Components/Modal.jsx'
import Table from '../Components/Table.jsx'
import InputFormGroup from '../Components/Form/InputFormGroup.jsx'
import TextareaFormGroup from '../Components/Form/TextareaFormGroup.jsx'
import TippyButton from '../Components/Form/TippyButton.jsx'
import ProjectsRest from '../Actions/Admin/ProjectsRest.js'

const projectsRest = new ProjectsRest()

const Projects = ({ can }) => {
  const gridRef = useRef()
  const modalRef = useRef()

  const nameRef = useRef()
  const descriptionRef = useRef()
  const linkRef = useRef()
  const imageRef = useRef()
  const statusRef = useRef()

  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(null)

  const refreshGrid = () => $(gridRef.current).dxDataGrid('instance').refresh()

  const setFormValues = (data = null) => {
    nameRef.current.value = data?.name || ''
    descriptionRef.current.value = data?.short_description || ''
    linkRef.current.value = data?.link || ''
    statusRef.current.checked = data?.status == null ? true : Boolean(data.status)
    imageRef.current.value = ''
  }

  const onModalOpen = (data = null) => {
    setDataLoaded(data)
    $(modalRef.current).modal('show')

    setTimeout(() => {
      setFormValues(data)
    }, 50)
  }

  const onSaveSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    const project = {
      id: dataLoaded?.id,
      name: nameRef.current.value,
      short_description: descriptionRef.current.value,
      link: linkRef.current.value,
      status: statusRef.current.checked,
      image: imageRef.current.files?.[0] ?? null
    }

    if (!project.id && !project.image) {
      alert('La imagen es obligatoria para registrar un proyecto.')
      return
    }

    setLoading(true)
    const result = await projectsRest.save(project)
    setLoading(false)

    if (!result) return

    $(modalRef.current).modal('hide')
    refreshGrid()
  }

  const onDeleteClicked = async (id) => {
    const result = await projectsRest.delete(id)
    if (!result) return
    refreshGrid()
  }

  return (
    <>
      <Table gridRef={gridRef} title='Proyectos' rest={projectsRest}
        toolBar={(container) => {
          container.unshift({
            widget: 'dxButton', location: 'after',
            options: {
              icon: 'plus',
              hint: 'Nuevo proyecto',
              onClick: () => onModalOpen(null)
            }
          })

          container.unshift({
            widget: 'dxButton', location: 'after',
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
            width: '220px'
          },
          {
            dataField: 'short_description',
            caption: 'Descripcion breve',
            minWidth: 260,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <span style={{ whiteSpace: 'normal' }}>{data.short_description}</span>)
            }
          },
          {
            dataField: 'image',
            caption: 'Imagen',
            width: '160px',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <img
                src={`/api/projects/media/${data.image}`}
                alt={data.name}
                style={{ width: '120px', height: '68px', objectFit: 'cover', borderRadius: '8px' }}
              />)
            }
          },
          {
            dataField: 'link',
            caption: 'Enlace',
            minWidth: 220,
            cellTemplate: (container, { data }) => {
              if (!data.link) return ReactAppend(container, <span className='text-muted'>Sin enlace</span>)
              ReactAppend(container, <a href={data.link} target='_blank' rel='noreferrer'>{data.link}</a>)
            }
          },
          {
            dataField: 'status',
            caption: 'Estado',
            width: '90px',
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <span className={`badge ${data.status ? 'bg-success' : 'bg-secondary'}`}>{data.status ? 'Activo' : 'Inactivo'}</span>)
            }
          },
          {
            dataField: 'created_at',
            caption: 'Fecha',
            dataType: 'date',
            width: '130px',
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <span>{moment(data.created_at).format('LL')}</span>)
            }
          },
          {
            caption: 'Acciones',
            width: '120px',
            cellTemplate: (container, { data }) => {
              container.attr('style', 'display: flex; gap: 4px; overflow: unset')

              ReactAppend(container, <TippyButton className='btn btn-sm btn-soft-primary' title='Editar' onClick={() => onModalOpen(data)}>
                <i className='mdi mdi-square-edit-outline'></i>
              </TippyButton>)

              can('permissions', 'root', 'all', 'delete') && ReactAppend(container, <TippyButton className='btn btn-sm btn-soft-danger' title='Eliminar' onClick={() => onDeleteClicked(data.id)}>
                <i className='mdi mdi-trash-can'></i>
              </TippyButton>)
            },
            allowFiltering: false,
            allowExporting: false
          }
        ]} />

      <Modal
        modalRef={modalRef}
        title={dataLoaded ? 'Editar proyecto' : 'Nuevo proyecto'}
        onClose={() => setDataLoaded(null)}
        onSubmit={onSaveSubmit}
        loading={loading}
        size='lg'
      >
        <div className='row'>
          <InputFormGroup col='col-md-6' eRef={nameRef} label='Nombre' required />
          <InputFormGroup col='col-md-6' eRef={linkRef} label='Enlace' type='url' placeholder='https://...' />
          <TextareaFormGroup col='col-12' eRef={descriptionRef} label='Descripcion breve' required rows={4} />
          <InputFormGroup col='col-md-8' eRef={imageRef} label='Imagen' type='file' required={!dataLoaded} />
          <div className='form-group col-md-4 mb-2 d-flex align-items-end'>
            <div className='form-check form-switch'>
              <input className='form-check-input' type='checkbox' id='projectStatus' ref={statusRef} defaultChecked />
              <label className='form-check-label' htmlFor='projectStatus'>Activo</label>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Adminto {...properties} title='Proyectos'>
      <Projects {...properties} />
    </Adminto>
  )
})
