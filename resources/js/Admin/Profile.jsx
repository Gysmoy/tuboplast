import { createRoot } from 'react-dom/client'
import React, { useEffect } from 'react'
import Adminto from '../Components/Adminto'
import CreateReactScript from '../Utils/CreateReactScript'

const Profile = () => {
  useEffect(() => {
    window.location.href = '/admin/account'
  }, [])

  return (
    <div className='card border-0 shadow-sm'>
      <div className='card-body p-4 text-center'>
        <h5 className='mb-2'>Redireccionando...</h5>
        <p className='text-muted mb-0'>Te estamos llevando a Mi cuenta.</p>
      </div>
    </div>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Adminto {...properties} title='Perfil de usuario'>
      <Profile />
    </Adminto>
  )
})

