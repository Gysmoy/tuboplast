import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import ReactAppend from '../Utils/ReactAppend.jsx'
import Adminto from '../Components/Adminto.jsx'
import Modal from '../Components/Modal.jsx'
import Table from '../Components/Table.jsx'
import TippyButton from '../Components/Form/TippyButton.jsx'
import ContactsRest from '../Actions/Admin/ContactsRest.js'

const contactsRest = new ContactsRest()

const Contacts = ({ can }) => {
  const gridRef = useRef()
  const modalRef = useRef()

  const [dataLoaded, setDataLoaded] = useState(null)

  const onModalOpen = (data) => {
    setDataLoaded(data)
    $(modalRef.current).modal('show')
  }

  const onDeleteClicked = async (id) => {
    const result = await contactsRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  return (<>
    <Table gridRef={gridRef} title='Contactos' rest={contactsRest}
      toolBar={(container) => {
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'refresh',
            hint: 'Refrescar tabla',
            onClick: () => $(gridRef.current).dxDataGrid('instance').refresh()
          }
        });
      }}
      columns={[
        {
          dataField: 'name',
          caption: 'Nombre',
          sortOrder: 'asc',
          width: '260px'
        },
        {
          dataField: 'email',
          caption: 'Correo'
        },
        {
          caption: 'Acciones',
          cellTemplate: (container, { data }) => {
            container.attr('style', 'display: flex; gap: 4px; overflow: unset')

            ReactAppend(container, <TippyButton className='btn btn-sm btn-soft-primary' title='Ver' onClick={() => onModalOpen(data)}>
              <i className='mdi mdi-eye'></i>
            </TippyButton>)

            can('permissions', 'root', 'all', 'delete') && ReactAppend(container, <TippyButton className='btn btn-sm btn-soft-danger' title='Eliminar' onClick={() => onDeleteClicked(data.id)}>
              <i className='mdi mdi-trash-can'></i>
            </TippyButton>)
          },
          allowFiltering: false,
          allowExporting: false
        }
      ]} />
    <Modal modalRef={modalRef} title='Detalles del contacto' onClose={() => setDataLoaded(null)} hideFooter>
      <div className='mb-2'>
        <h6 className='mt-0 mb-1'>Nombre del contacto</h6>
        <p className='mb-0 text-muted'>{dataLoaded?.name || ''}</p>
      </div>
      <div className='mb-2'>
        <h6 className='mt-0 mb-1'>Correo electronico</h6>
        <p className='mb-0 text-muted'>{dataLoaded?.email || ''}</p>
      </div>
      <div className='mb-2'>
        <h6 className='mt-0 mb-1'>Empresa</h6>
        <p className='mb-0 text-muted'>{dataLoaded?.business || '-'}</p>
      </div>
      <div className='mb-2'>
        <h6 className='mt-0 mb-1'>Motivo de consulta</h6>
        <p className='mb-0 text-muted'>{dataLoaded?.service || '-'}</p>
      </div>
      <div>
        <h6 className='mt-0 mb-1'>Mensaje</h6>
        <p className='mb-0 text-muted' style={{ whiteSpace: 'pre-wrap' }}>{dataLoaded?.message || ''}</p>
      </div>
    </Modal>
  </>)
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Adminto {...properties} title='Leads'>
      <Contacts {...properties} />
    </Adminto>
  );
})
