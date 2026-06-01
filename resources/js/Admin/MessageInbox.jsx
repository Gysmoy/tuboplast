import React, { useRef, useState } from 'react'
import ReactAppend from '../Utils/ReactAppend.jsx'
import Modal from '../Components/Modal.jsx'
import Table from '../Components/Table.jsx'
import TippyButton from '../Components/Form/TippyButton.jsx'

const MessageInbox = ({ badgeEvent, rest, title }) => {
  const gridRef = useRef()
  const modalRef = useRef()
  const [selectedMessage, setSelectedMessage] = useState(null)

  const refreshGrid = () => $(gridRef.current).dxDataGrid('instance').refresh()

  const openDetails = async (message) => {
    setSelectedMessage(message)
    $(modalRef.current).modal('show')

    if (message.seen === true || message.seen === 1) return

    const ok = await rest.seen(message.id)
    if (!ok) return

    setSelectedMessage((current) => current?.id === message.id ? { ...current, seen: true } : current)
    window.dispatchEvent(new CustomEvent(badgeEvent, { detail: { id: message.id } }))
    refreshGrid()
  }

  const deleteMessage = async (message) => {
    const ok = await rest.delete(message.id)
    if (!ok) return
    if (message.seen !== true && message.seen !== 1) {
      window.dispatchEvent(new CustomEvent(badgeEvent, { detail: { id: message.id } }))
    }
    refreshGrid()
  }

  return (
    <>
      <Table
        gridRef={gridRef}
        title={title}
        rest={rest}
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
            caption: 'Contacto',
            minWidth: 220,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <div>
                <span className='d-block fw-semibold'>{data.name}</span>
                <small className='text-muted'>{data.business || 'Sin empresa'}</small>
              </div>)
            }
          },
          {
            dataField: 'email',
            caption: 'Correo',
            minWidth: 220
          },
          {
            dataField: 'service',
            caption: 'Motivo',
            minWidth: 180
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

              ReactAppend(container, <TippyButton className='btn btn-sm btn-soft-danger' title='Eliminar' onClick={() => deleteMessage(data)}>
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
        title='Detalle del registro'
        onClose={() => setSelectedMessage(null)}
        hideFooter
        size='lg'
      >
        <div className='row g-3'>
          <div className='col-md-6'>
            <h6 className='mt-0 mb-1'>Nombre del contacto</h6>
            <p className='mb-0 text-muted'>{selectedMessage?.name || '-'}</p>
          </div>
          <div className='col-md-6'>
            <h6 className='mt-0 mb-1'>Correo electrónico</h6>
            <p className='mb-0 text-muted'>{selectedMessage?.email || '-'}</p>
          </div>
          <div className='col-md-6'>
            <h6 className='mt-0 mb-1'>Empresa</h6>
            <p className='mb-0 text-muted'>{selectedMessage?.business || '-'}</p>
          </div>
          <div className='col-md-6'>
            <h6 className='mt-0 mb-1'>Motivo de consulta</h6>
            <p className='mb-0 text-muted'>{selectedMessage?.service || '-'}</p>
          </div>
          <div className='col-12'>
            <h6 className='mt-0 mb-1'>Mensaje</h6>
            <p className='mb-0 text-muted' style={{ whiteSpace: 'pre-wrap' }}>{selectedMessage?.message || '-'}</p>
          </div>
          <div className='col-12'><hr className='my-1' /></div>
          <div className='col-md-4'>
            <h6 className='mt-0 mb-1'>Dirección IP</h6>
            <p className='mb-0 text-muted'>{selectedMessage?.ip_address || '-'}</p>
          </div>
          <div className='col-md-4'>
            <h6 className='mt-0 mb-1'>Dispositivo</h6>
            <p className='mb-0 text-muted'>{selectedMessage?.device_type || '-'}</p>
          </div>
          <div className='col-md-4'>
            <h6 className='mt-0 mb-1'>Origen</h6>
            <p className='mb-0 text-muted'>{selectedMessage?.source || '-'}</p>
          </div>
          <div className='col-md-6'>
            <h6 className='mt-0 mb-1'>Navegador</h6>
            <p className='mb-0 text-muted'>{selectedMessage?.browser || '-'}</p>
          </div>
          <div className='col-md-6'>
            <h6 className='mt-0 mb-1'>Sistema operativo</h6>
            <p className='mb-0 text-muted'>{selectedMessage?.operating_system || '-'}</p>
          </div>
          <div className='col-12'>
            <h6 className='mt-0 mb-1'>User agent</h6>
            <code className='d-block text-wrap small'>{selectedMessage?.user_agent || '-'}</code>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default MessageInbox
