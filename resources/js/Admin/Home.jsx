import React from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'

const Home = () => {
  document.title = 'Inicio | Admin'

  return (
    <div className='row'>
      <div className='col-12'>
        <div className='card'>
          <div className='card-body'>
            <h4 className='header-title mb-3'>Panel Administrativo</h4>
            <p className='text-muted mb-0'>Selecciona una opcion del menu lateral o usa los accesos rapidos.</p>
          </div>
        </div>
      </div>

      <div className='col-md-6'>
        <div className='card'>
          <div className='card-body'>
            <h5 className='mb-2'>Leads</h5>
            <p className='text-muted mb-3'>Revisa y gestiona los contactos recibidos desde la landing.</p>
            <a href='/admin/contacts' className='btn btn-primary btn-sm'>Ver contactos</a>
          </div>
        </div>
      </div>

      <div className='col-md-6'>
        <div className='card'>
          <div className='card-body'>
            <h5 className='mb-2'>Proyectos</h5>
            <p className='text-muted mb-3'>Administra el bloque "Mira nuestro trabajo" de la landing.</p>
            <a href='/admin/projects' className='btn btn-primary btn-sm'>Gestionar proyectos</a>
          </div>
        </div>
      </div>
    </div>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Adminto {...properties} title='Inicio'>
      <Home />
    </Adminto>
  )
})
