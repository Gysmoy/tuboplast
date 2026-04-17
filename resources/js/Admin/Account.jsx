import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { toast } from 'sonner'
import JSEncrypt from 'jsencrypt'
import Adminto from '../Components/Adminto'
import CreateReactScript from '../Utils/CreateReactScript'
import AccountRest from '../Actions/Admin/AccountRest'
import Global from '../Utils/Global'
import LaravelSession from '../Utils/LaravelSession'
import Logout from '../Actions/Logout'

const Account = ({ session: sessionProp, accountCanUploadAvatar = false }) => {
  const [session, setSession] = useState(sessionProp)
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarVersion, setAvatarVersion] = useState(0)
  const [profileForm, setProfileForm] = useState({
    name: sessionProp?.name ?? '',
    lastname: sessionProp?.lastname ?? '',
  })
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  })

  const jsEncrypt = useMemo(() => {
    const instance = new JSEncrypt()
    instance.setPublicKey(Global.PUBLIC_RSA_KEY)
    return instance
  }, [])

  const fullName = `${session?.name ?? ''} ${session?.lastname ?? ''}`.trim()

  const avatarUrl = useMemo(() => {
    if (session?.image) {
      return `/storage/images/user/${session.image}?v=${avatarVersion}`
    }
    const encodedName = encodeURIComponent(fullName || 'Usuario')
    return `https://ui-avatars.com/api/?name=${encodedName}&color=FFFFFF&background=252630`
  }, [session?.image, fullName, avatarVersion])

  const onProfileInput = (e) => {
    const { name, value } = e.target
    setProfileForm((old) => ({ ...old, [name]: value }))
  }

  const onPasswordInput = (e) => {
    const { name, value } = e.target
    setPasswordForm((old) => ({ ...old, [name]: value }))
  }

  const applySessionPatch = (patch) => {
    const newSession = { ...session, ...patch }
    setSession(newSession)
    Object.entries(patch).forEach(([key, value]) => LaravelSession.set(key, value))
  }

  const onProfileSubmit = async (e) => {
    e.preventDefault()
    if (profileLoading) return

    setProfileLoading(true)
    try {
      const result = await AccountRest.updateProfile(profileForm)
      if (result?.status !== 200) {
        throw new Error(result?.message || 'No se pudo actualizar el perfil')
      }

      applySessionPatch({
        name: result?.data?.name ?? profileForm.name,
        lastname: result?.data?.lastname ?? profileForm.lastname,
      })

      toast.success('Perfil actualizado', { description: 'Tus datos fueron guardados correctamente.' })
    } catch (error) {
      toast.error('Error', { description: error.message || 'Ocurrio un error inesperado.' })
    } finally {
      setProfileLoading(false)
    }
  }

  const onPasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordLoading) return

    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      toast.error('Error', { description: 'La confirmacion de la nueva contrasena no coincide.' })
      return
    }

    setPasswordLoading(true)
    try {
      const payload = {
        current_password: jsEncrypt.encrypt(passwordForm.current_password),
        new_password: jsEncrypt.encrypt(passwordForm.new_password),
        new_password_confirmation: jsEncrypt.encrypt(passwordForm.new_password_confirmation),
      }

      const result = await AccountRest.updatePassword(payload)
      if (result?.status !== 200) {
        throw new Error(result?.message || 'No se pudo actualizar la contrasena')
      }

      toast.success('Contrasena actualizada', { description: 'Por seguridad cerraremos tu sesion.' })
      setTimeout(() => Logout(), 900)
    } catch (error) {
      toast.error('Error', { description: error.message || 'Ocurrio un error inesperado.' })
    } finally {
      setPasswordLoading(false)
    }
  }

  const onAvatarChange = async (e) => {
    if (!accountCanUploadAvatar) {
      toast.error('No disponible', { description: 'La carga de avatar no esta habilitada en este entorno.' })
      return
    }

    const file = e.target.files?.[0]
    if (!file || avatarLoading) return

    setAvatarLoading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const result = await AccountRest.updateAvatar(formData)
      if (result?.status !== 200) {
        throw new Error(result?.message || 'No se pudo actualizar el avatar')
      }

      applySessionPatch({
        image: result?.data?.image ?? session?.image,
      })
      setAvatarVersion((old) => old + 1)
      toast.success('Foto actualizada', { description: 'Tu imagen de perfil se actualizo correctamente.' })
    } catch (error) {
      toast.error('Error', { description: error.message || 'Ocurrio un error inesperado.' })
    } finally {
      setAvatarLoading(false)
      e.target.value = ''
    }
  }

  return (
    <div className='row g-3 g-lg-4'>
      <div className='col-12 col-lg-4'>
        <div className='card h-100 border-0 shadow-sm'>
          <div className='card-body p-4 text-center'>
            <div className='position-relative d-inline-block mb-3'>
              <img
                src={avatarUrl}
                alt={fullName || 'Usuario'}
                className='rounded-circle border border-3 border-light shadow'
                style={{ width: 120, height: 120, objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'Usuario')}&color=FFFFFF&background=252630`
                }}
              />
              <label
                htmlFor='account-avatar'
                className={`btn btn-primary btn-sm rounded-circle position-absolute end-0 bottom-0 ${avatarLoading ? 'disabled' : ''}`}
                style={{ width: 34, height: 34, lineHeight: '20px' }}
                title='Cambiar foto'
              >
                <i className={`ti ${avatarLoading ? 'ti-loader-2 ti-spin' : 'ti-camera'}`}></i>
              </label>
              <input
                id='account-avatar'
                type='file'
                className='d-none'
                accept='image/*'
                onChange={onAvatarChange}
                disabled={avatarLoading || !accountCanUploadAvatar}
              />
            </div>

            <h4 className='mb-1'>{fullName || 'Usuario'}</h4>
            <p className='text-muted mb-3'>{session?.email}</p>

            <div className='d-grid gap-2'>
              <button type='button' className='btn btn-outline-danger' onClick={Logout}>
                <i className='ti ti-logout me-1'></i>
                Cerrar sesion
              </button>
            </div>

            {!accountCanUploadAvatar && (
              <div className='alert alert-warning py-2 mt-3 mb-0 small'>
                La carga de avatar no esta habilitada porque falta la columna `image` en `users`.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='col-12 col-lg-8'>
        <div className='card border-0 shadow-sm'>
          <div className='card-header bg-white border-0 pt-4 px-4'>
            <ul className='nav nav-pills gap-2' id='account-tabs' role='tablist'>
              <li className='nav-item' role='presentation'>
                <button className='nav-link active' id='profile-tab' data-bs-toggle='pill' data-bs-target='#profile-pane' type='button' role='tab'>
                  <i className='ti ti-user me-1'></i>
                  Perfil
                </button>
              </li>
              <li className='nav-item' role='presentation'>
                <button className='nav-link' id='security-tab' data-bs-toggle='pill' data-bs-target='#security-pane' type='button' role='tab'>
                  <i className='ti ti-lock me-1'></i>
                  Seguridad
                </button>
              </li>
            </ul>
          </div>

          <div className='card-body p-4'>
            <div className='tab-content'>
              <div className='tab-pane fade show active' id='profile-pane' role='tabpanel' aria-labelledby='profile-tab'>
                <h5 className='mb-3'>Mi perfil</h5>
                <form className='row g-3' onSubmit={onProfileSubmit}>
                  <div className='col-12 col-md-6'>
                    <label className='form-label'>Nombres</label>
                    <input
                      name='name'
                      className='form-control'
                      value={profileForm.name}
                      onChange={onProfileInput}
                      required
                    />
                  </div>
                  <div className='col-12 col-md-6'>
                    <label className='form-label'>Apellidos</label>
                    <input
                      name='lastname'
                      className='form-control'
                      value={profileForm.lastname}
                      onChange={onProfileInput}
                      required
                    />
                  </div>
                  <div className='col-12 d-flex justify-content-end'>
                    <button type='submit' className='btn btn-primary px-4' disabled={profileLoading}>
                      <i className={`ti ${profileLoading ? 'ti-loader-2 ti-spin' : 'ti-device-floppy'} me-1`}></i>
                      {profileLoading ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </div>
                </form>
              </div>

              <div className='tab-pane fade' id='security-pane' role='tabpanel' aria-labelledby='security-tab'>
                <h5 className='mb-3'>Seguridad de la cuenta</h5>
                <form className='row g-3' onSubmit={onPasswordSubmit}>
                  <div className='col-12'>
                    <label className='form-label'>Contrasena actual</label>
                    <input
                      type='password'
                      name='current_password'
                      className='form-control'
                      value={passwordForm.current_password}
                      onChange={onPasswordInput}
                      required
                    />
                  </div>
                  <div className='col-12 col-md-6'>
                    <label className='form-label'>Nueva contrasena</label>
                    <input
                      type='password'
                      name='new_password'
                      className='form-control'
                      minLength={8}
                      value={passwordForm.new_password}
                      onChange={onPasswordInput}
                      required
                    />
                  </div>
                  <div className='col-12 col-md-6'>
                    <label className='form-label'>Confirmar nueva contrasena</label>
                    <input
                      type='password'
                      name='new_password_confirmation'
                      className='form-control'
                      minLength={8}
                      value={passwordForm.new_password_confirmation}
                      onChange={onPasswordInput}
                      required
                    />
                  </div>
                  <div className='col-12 d-flex justify-content-end'>
                    <button type='submit' className='btn btn-dark px-4' disabled={passwordLoading}>
                      <i className={`ti ${passwordLoading ? 'ti-loader-2 ti-spin' : 'ti-shield-lock'} me-1`}></i>
                      {passwordLoading ? 'Actualizando...' : 'Actualizar contrasena'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Adminto {...properties} title='Mi cuenta'>
      <Account {...properties} />
    </Adminto>
  )
})
