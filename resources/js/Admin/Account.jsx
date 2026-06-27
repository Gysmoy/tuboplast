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

const ACCOUNT_CSS = `
.wac{--pri:#004991;}
.wac .wac-card{background:#fff;border:1px solid #eef2f8;border-radius:16px;box-shadow:0 1px 2px rgba(15,37,64,.04),0 6px 16px rgba(0,73,145,.06);overflow:hidden;}
.wac-hero{background:radial-gradient(circle at top right,rgba(255,255,255,.12),transparent 38%),linear-gradient(135deg,#003b7a,#004e9b);padding:26px 20px 56px;text-align:center;}
.wac-ava-wrap{position:relative;display:inline-block;margin-top:6px;}
.wac-ava{width:118px;height:118px;border-radius:50%;object-fit:cover;border:4px solid #fff;box-shadow:0 8px 24px rgba(0,0,0,.18);background:#e6effa;}
.wac-cam{position:absolute;right:4px;bottom:4px;width:36px;height:36px;border-radius:50%;background:#F7DD00;color:#003b7a;display:inline-flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.2);}
.wac-cam.dis{opacity:.6;cursor:default;}
.wac-body{padding:0 20px 20px;text-align:center;margin-top:-34px;}
.wac-name{font-size:18px;font-weight:700;color:#0f2540;margin:0;}
.wac-mail{font-size:13px;color:#8a93a6;margin:2px 0 0;}
.wac-role{display:inline-flex;align-items:center;gap:6px;margin-top:10px;padding:4px 12px;border-radius:50rem;background:#e6effa;color:#004991;font-size:12px;font-weight:700;}
.wac .form-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#8a93a6;margin-bottom:4px;}
.wac .form-control{border:1px solid #dce5f0;border-radius:10px;font-size:13.5px;color:#1f2a44;}
.wac .form-control:focus{border-color:var(--pri);box-shadow:0 0 0 .18rem rgba(0,73,145,.12);}
.wac-btn{height:42px;padding:0 18px;border-radius:10px;font-weight:600;font-size:13px;border:0;display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:.15s;cursor:pointer;}
.wac-btn.primary{background:var(--pri);color:#fff;}.wac-btn.primary:hover{background:#003b7a;}
.wac-btn.primary:disabled{opacity:.6;cursor:default;}
.wac-btn.danger{background:#fff;border:1px solid #f3c6c6;color:#e24b4a;width:100%;}.wac-btn.danger:hover{background:#fcebeb;}
.wac-tabs{display:flex;gap:6px;padding:14px 18px 0;}
.wac-tab{height:40px;padding:0 16px;border-radius:10px;border:0;background:#f4f8fd;color:#5b6577;font-weight:600;font-size:13px;display:inline-flex;align-items:center;gap:6px;cursor:pointer;transition:.15s;}
.wac-tab.active{background:var(--pri);color:#fff;}
.wac-tab:not(.active):hover{background:#e6effa;color:var(--pri);}
.wac-sec-title{font-size:15px;font-weight:700;color:#0f2540;margin:0 0 4px;}
.wac-sec-sub{font-size:12.5px;color:#8a93a6;margin:0 0 16px;}
.wac-warn{background:#fff4d6;color:#854f0b;border-radius:10px;padding:9px 12px;font-size:12px;font-weight:500;}
`

const Account = ({ session: sessionProp, accountCanUploadAvatar = false }) => {
  const [session, setSession] = useState(sessionProp)
  const [tab, setTab] = useState('profile')
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarVersion, setAvatarVersion] = useState(0)
  const [profileForm, setProfileForm] = useState({ name: sessionProp?.name ?? '', lastname: sessionProp?.lastname ?? '' })
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' })

  const jsEncrypt = useMemo(() => {
    const instance = new JSEncrypt()
    instance.setPublicKey(Global.PUBLIC_RSA_KEY)
    return instance
  }, [])

  const fullName = `${session?.name ?? ''} ${session?.lastname ?? ''}`.trim()
  const mainRole = LaravelSession.roles?.[0]?.name || 'Usuario'

  const avatarUrl = useMemo(() => {
    if (session?.image) return `/storage/images/user/${session.image}?v=${avatarVersion}`
    const encodedName = encodeURIComponent(fullName || 'Usuario')
    return `https://ui-avatars.com/api/?name=${encodedName}&color=FFFFFF&background=004991`
  }, [session?.image, fullName, avatarVersion])

  const onProfileInput = (e) => { const { name, value } = e.target; setProfileForm((old) => ({ ...old, [name]: value })) }
  const onPasswordInput = (e) => { const { name, value } = e.target; setPasswordForm((old) => ({ ...old, [name]: value })) }

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
      if (result?.status !== 200) throw new Error(result?.message || 'No se pudo actualizar el perfil')
      applySessionPatch({ name: result?.data?.name ?? profileForm.name, lastname: result?.data?.lastname ?? profileForm.lastname })
      toast.success('Perfil actualizado', { description: 'Tus datos fueron guardados correctamente.' })
    } catch (error) {
      toast.error('Error', { description: error.message || 'Ocurrió un error inesperado.' })
    } finally {
      setProfileLoading(false)
    }
  }

  const onPasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordLoading) return
    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      toast.error('Error', { description: 'La confirmación de la nueva contraseña no coincide.' })
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
      if (result?.status !== 200) throw new Error(result?.message || 'No se pudo actualizar la contraseña')
      toast.success('Contraseña actualizada', { description: 'Por seguridad cerraremos tu sesión.' })
      setTimeout(() => Logout(), 900)
    } catch (error) {
      toast.error('Error', { description: error.message || 'Ocurrió un error inesperado.' })
    } finally {
      setPasswordLoading(false)
    }
  }

  const onAvatarChange = async (e) => {
    if (!accountCanUploadAvatar) {
      toast.error('No disponible', { description: 'La carga de avatar no está habilitada en este entorno.' })
      return
    }
    const file = e.target.files?.[0]
    if (!file || avatarLoading) return
    setAvatarLoading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const result = await AccountRest.updateAvatar(formData)
      if (result?.status !== 200) throw new Error(result?.message || 'No se pudo actualizar el avatar')
      applySessionPatch({ image: result?.data?.image ?? session?.image })
      setAvatarVersion((old) => old + 1)
      toast.success('Foto actualizada', { description: 'Tu imagen de perfil se actualizó correctamente.' })
    } catch (error) {
      toast.error('Error', { description: error.message || 'Ocurrió un error inesperado.' })
    } finally {
      setAvatarLoading(false)
      e.target.value = ''
    }
  }

  return (
    <div className='wac'>
      <style>{ACCOUNT_CSS}</style>
      <div className='row g-3 g-lg-4'>
        <div className='col-12 col-lg-4'>
          <div className='wac-card h-100'>
            <div className='wac-hero'>
              <div className='wac-ava-wrap'>
                <img
                  src={avatarUrl}
                  alt={fullName || 'Usuario'}
                  className='wac-ava'
                  onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'Usuario')}&color=FFFFFF&background=004991` }}
                />
                <label htmlFor='account-avatar' className={`wac-cam ${avatarLoading ? 'dis' : ''}`} title='Cambiar foto'>
                  <i className={`ti ${avatarLoading ? 'ti-loader-2 ti-spin' : 'ti-camera'}`}></i>
                </label>
                <input id='account-avatar' type='file' className='d-none' accept='image/*' onChange={onAvatarChange} disabled={avatarLoading || !accountCanUploadAvatar} />
              </div>
            </div>

            <div className='wac-body'>
              <h4 className='wac-name'>{fullName || 'Usuario'}</h4>
              <p className='wac-mail'>{session?.email}</p>
              <div><span className='wac-role'><i className='ti ti-shield-check'></i>{mainRole}</span></div>

              <div className='mt-4'>
                <button type='button' className='wac-btn danger' onClick={Logout}><i className='ti ti-logout'></i>Cerrar sesión</button>
              </div>

              {!accountCanUploadAvatar && (
                <div className='wac-warn mt-3'>La carga de avatar no está habilitada (falta la columna <b>image</b> en <b>users</b>).</div>
              )}
            </div>
          </div>
        </div>

        <div className='col-12 col-lg-8'>
          <div className='wac-card h-100'>
            <div className='wac-tabs'>
              <button type='button' className={`wac-tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}><i className='ti ti-user'></i>Perfil</button>
              <button type='button' className={`wac-tab ${tab === 'security' ? 'active' : ''}`} onClick={() => setTab('security')}><i className='ti ti-lock'></i>Seguridad</button>
            </div>

            <div className='p-4'>
              {tab === 'profile' ? (
                <>
                  <h5 className='wac-sec-title'>Mi perfil</h5>
                  <p className='wac-sec-sub'>Actualiza tu nombre y apellidos.</p>
                  <form className='row g-3' onSubmit={onProfileSubmit}>
                    <div className='col-12 col-md-6'>
                      <label className='form-label'>Nombres</label>
                      <input name='name' className='form-control' value={profileForm.name} onChange={onProfileInput} required />
                    </div>
                    <div className='col-12 col-md-6'>
                      <label className='form-label'>Apellidos</label>
                      <input name='lastname' className='form-control' value={profileForm.lastname} onChange={onProfileInput} required />
                    </div>
                    <div className='col-12 d-flex justify-content-end'>
                      <button type='submit' className='wac-btn primary' disabled={profileLoading}>
                        {profileLoading ? <><span className='spinner-border spinner-border-sm'></span> Guardando...</> : <><i className='ti ti-device-floppy'></i> Guardar cambios</>}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <h5 className='wac-sec-title'>Seguridad de la cuenta</h5>
                  <p className='wac-sec-sub'>Cambia tu contraseña. Se cerrará la sesión por seguridad.</p>
                  <form className='row g-3' onSubmit={onPasswordSubmit}>
                    <div className='col-12'>
                      <label className='form-label'>Contraseña actual</label>
                      <input type='password' name='current_password' className='form-control' value={passwordForm.current_password} onChange={onPasswordInput} required />
                    </div>
                    <div className='col-12 col-md-6'>
                      <label className='form-label'>Nueva contraseña</label>
                      <input type='password' name='new_password' className='form-control' minLength={8} value={passwordForm.new_password} onChange={onPasswordInput} required />
                    </div>
                    <div className='col-12 col-md-6'>
                      <label className='form-label'>Confirmar nueva contraseña</label>
                      <input type='password' name='new_password_confirmation' className='form-control' minLength={8} value={passwordForm.new_password_confirmation} onChange={onPasswordInput} required />
                    </div>
                    <div className='col-12 d-flex justify-content-end'>
                      <button type='submit' className='wac-btn primary' disabled={passwordLoading}>
                        {passwordLoading ? <><span className='spinner-border spinner-border-sm'></span> Actualizando...</> : <><i className='ti ti-shield-lock'></i> Actualizar contraseña</>}
                      </button>
                    </div>
                  </form>
                </>
              )}
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
