import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import ReactAppend from '../Utils/ReactAppend.jsx'
import Adminto from '../Components/Adminto.jsx'
import Modal from '../Components/Modal.jsx'
import Table from '../Components/Table.jsx'
import TippyButton from '../Components/Form/TippyButton.jsx'
import ClubRest from '../Actions/Admin/ClubRest.js'

const clubRest = new ClubRest()

const Club = () => {
  const gridRef = useRef()
  const modalRef = useRef()
  const [selectedMember, setSelectedMember] = useState(null)

  const refreshGrid = () => $(gridRef.current).dxDataGrid('instance').refresh()

  const openDetails = async (member) => {
    setSelectedMember(member)
    $(modalRef.current).modal('show')

    if (member.seen === true || member.seen === 1) return

    const ok = await clubRest.seen(member.id)
    if (!ok) return

    setSelectedMember((current) => current?.id === member.id ? { ...current, seen: true } : current)
    window.dispatchEvent(new CustomEvent('club:seen', { detail: { id: member.id } }))
    refreshGrid()
  }

  const deleteMember = async (member) => {
    const ok = await clubRest.delete(member.id)
    if (!ok) return

    if (member.seen !== true && member.seen !== 1) {
      window.dispatchEvent(new CustomEvent('club:seen', { detail: { id: member.id } }))
    }
    refreshGrid()
  }

  return (
    <>
      <Table
        gridRef={gridRef}
        title='solicitudes del Club Experto'
        rest={clubRest}
        onRowPrepared={({ data, rowElement, rowType }) => {
          if (rowType !== 'data' || data.seen === true || data.seen === 1) return
          rowElement.find('td').css('background-color', '#eaf4ff')
        }}
        toolBar={(container) => {
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
            caption: 'Experto',
            minWidth: 220,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <div>
                <span className='d-block fw-semibold'>{data.name}</span>
                <small className='text-muted'>DNI / CE: {data.dni}</small>
              </div>)
            }
          },
          {
            dataField: 'email',
            caption: 'Correo',
            minWidth: 220
          },
          {
            dataField: 'specialty',
            caption: 'Especialidad',
            minWidth: 170
          },
          {
            dataField: 'district',
            caption: 'Ubicación',
            minWidth: 220,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <div>
                <span className='d-block fw-semibold'>{data.district}</span>
                <small className='text-muted'>{data.province}, {data.department}</small>
              </div>)
            }
          },
          {
            dataField: 'created_at',
            caption: 'Fecha',
            dataType: 'datetime',
            width: 180,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <span>{moment(data.created_at).format('LLL')}</span>)
            }
          },
          {
            caption: 'Acciones',
            width: 110,
            cellTemplate: (container, { data }) => {
              container.attr('style', 'display: flex; gap: 4px; overflow: unset')

              ReactAppend(container, <TippyButton className='btn btn-sm btn-soft-primary' title='Ver detalle' onClick={() => openDetails(data)}>
                <i className='mdi mdi-eye'></i>
              </TippyButton>)

              ReactAppend(container, <TippyButton className='btn btn-sm btn-soft-danger' title='Eliminar' onClick={() => deleteMember(data)}>
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
        title='Detalle de inscripción al Club Experto'
        onClose={() => setSelectedMember(null)}
        hideFooter
        size='lg'
      >
        <div className='row g-3'>
          <div className='col-md-6'>
            <h6 className='mt-0 mb-1'>Nombre completo</h6>
            <p className='mb-0 text-muted'>{selectedMember?.name || '-'}</p>
          </div>
          <div className='col-md-6'>
            <h6 className='mt-0 mb-1'>DNI / CE</h6>
            <p className='mb-0 text-muted'>{selectedMember?.dni || '-'}</p>
          </div>
          <div className='col-md-6'>
            <h6 className='mt-0 mb-1'>Correo electrónico</h6>
            <p className='mb-0 text-muted'>{selectedMember?.email || '-'}</p>
          </div>
          <div className='col-md-6'>
            <h6 className='mt-0 mb-1'>Especialidad</h6>
            <p className='mb-0 text-muted'>{selectedMember?.specialty || '-'}</p>
          </div>
          <div className='col-md-4'>
            <h6 className='mt-0 mb-1'>Departamento</h6>
            <p className='mb-0 text-muted'>{selectedMember?.department || '-'}</p>
          </div>
          <div className='col-md-4'>
            <h6 className='mt-0 mb-1'>Provincia</h6>
            <p className='mb-0 text-muted'>{selectedMember?.province || '-'}</p>
          </div>
          <div className='col-md-4'>
            <h6 className='mt-0 mb-1'>Distrito</h6>
            <p className='mb-0 text-muted'>{selectedMember?.district || '-'}</p>
          </div>
          <div className='col-12'>
            <h6 className='mt-0 mb-1'>Código ubigeo</h6>
            <p className='mb-0 text-muted'>{selectedMember?.ubigeo || '-'}</p>
          </div>
          <div className='col-12'><hr className='my-1' /></div>
          <div className='col-md-4'>
            <h6 className='mt-0 mb-1'>Dirección IP</h6>
            <p className='mb-0 text-muted'>{selectedMember?.ip_address || '-'}</p>
          </div>
          <div className='col-md-4'>
            <h6 className='mt-0 mb-1'>Dispositivo</h6>
            <p className='mb-0 text-muted'>{selectedMember?.device_type || '-'}</p>
          </div>
          <div className='col-md-4'>
            <h6 className='mt-0 mb-1'>Navegador</h6>
            <p className='mb-0 text-muted'>{selectedMember?.browser || '-'}</p>
          </div>
          <div className='col-md-6'>
            <h6 className='mt-0 mb-1'>Sistema operativo</h6>
            <p className='mb-0 text-muted'>{selectedMember?.operating_system || '-'}</p>
          </div>
          <div className='col-12'>
            <h6 className='mt-0 mb-1'>User agent</h6>
            <code className='d-block text-wrap small'>{selectedMember?.user_agent || '-'}</code>
          </div>
        </div>
      </Modal>
    </>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Adminto {...properties} title='Club experto'>
      <Club />
    </Adminto>
  )
})
