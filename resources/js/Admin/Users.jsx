import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'
import AdminTable from '../Components/AdminTable.jsx'
import ConfirmModal from '../Components/ConfirmModal.jsx'
import CustomDropdown from '../Components/CustomDropdown.jsx'
import InputFormGroup from '../Components/Form/InputFormGroup.jsx'
import PasswordFormGroup from '../Components/Form/PasswordFormGroup.jsx'
import UsersRest from '../Actions/Admin/UsersRest.js'

const usersRest = new UsersRest()

const USERS_CSS = `
.wfu-act{width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;border:0;font-size:13px;cursor:pointer;transition:filter .15s;}
.wfu-act:hover{filter:brightness(.95);}
.wfu-act.edit{background:#e8f0ff;color:#3b82f6;}
.wfu-act.toggle{background:#fff4d6;color:#9a6b00;}
.wfu-act.del{background:#fcebeb;color:#e24b4a;}
.wfu-act.lock{background:#eef1f6;color:#8a93a6;cursor:default;}
.wfu-lock{display:inline-flex;align-items:center;padding:2px 8px;border-radius:50rem;font-size:10px;font-weight:700;background:#0f2540;color:#fff;}
.wfu-role{display:inline-flex;align-items:center;padding:2px 9px;border-radius:50rem;font-size:11px;font-weight:600;background:#e6effa;color:#004991;}
.wfu-st{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:50rem;font-size:11px;font-weight:600;}
.wfu-st .dot{width:6px;height:6px;border-radius:50%;}
.wfu-st.on{background:#e1f5ee;color:#0f6e56;}.wfu-st.on .dot{background:#16c784;}
.wfu-st.off{background:#fff4d6;color:#854f0b;}.wfu-st.off .dot{background:#caa12a;}
.wfu-st.del{background:#fcebeb;color:#b42318;}.wfu-st.del .dot{background:#e24b4a;}
.wfu-btn{height:40px;padding:0 14px;border-radius:12px;background:#004991;color:#fff;font-weight:600;font-size:13px;border:0;display:inline-flex;align-items:center;gap:6px;transition:background .2s;}
.wfu-btn:hover{background:#003b7a;color:#fff;}
.wfu-btn.foot{height:38px;border-radius:10px;}
.wfu-btn:disabled{opacity:.65;cursor:default;}
.wfu-btn.outline{background:#fff;border:1px solid #dce5f0;color:#5b6577;}.wfu-btn.outline:hover{background:#f4f8fd;color:#0f2540;}
.wfu-h2{font-size:16px;font-weight:700;color:#0f2540;margin:0;}
.wfu-modal-ovl{position:fixed;inset:0;z-index:1100;background:rgba(15,23,42,.5);display:flex;align-items:flex-start;justify-content:center;padding:3vh 12px;}
.wfu-modal{position:relative;width:min(860px,96vw);max-height:94vh;background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(15,37,64,.25);display:flex;flex-direction:column;overflow:hidden;}
.wfu-modal form{display:flex;flex-direction:column;min-height:0;flex:1;}
.wfu-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid #eef2f8;flex-shrink:0;}
.wfu-modal-body{overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:14px;flex:1;}
.wfu-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 20px;border-top:1px solid #eef2f8;flex-shrink:0;}
.wfu-close{width:36px;height:36px;border-radius:10px;border:0;background:none;color:#8a93a6;font-size:18px;cursor:pointer;}
.wfu-close:hover{background:#f4f8fd;color:#0f2540;}
.wfu-modal .form-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#8a93a6;}
.wfu-modal .form-control{border:1px solid #dce5f0;border-radius:10px;font-size:13.5px;}
.wfu-modal .form-control:focus{border-color:#004991;box-shadow:0 0 0 .18rem rgba(0,73,145,.12);}
.wfu-err{display:flex;align-items:center;gap:8px;background:#fcebeb;color:#b42318;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:500;}
.wfu-rolebox{border:1px solid #eef2f8;border-radius:12px;padding:10px;max-height:220px;overflow-y:auto;}
.wfu-rolechk{display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid #eef2f8;border-radius:9px;font-size:13px;color:#1f2a44;cursor:pointer;transition:.15s;}
.wfu-rolechk:hover{background:#f9fbfe;}
.wfu-rolechk.on{background:#e6effa;border-color:#bcd4ef;color:#004991;font-weight:600;}
.wfu-rolechk input{accent-color:#004991;width:15px;height:15px;}
`

const STATUS_OPTIONS = [
  { value: 'true', label: 'Activo' },
  { value: 'false', label: 'Inactivo' },
  { value: 'null', label: 'Eliminado' },
]
const parseStatusValue = (value) => (value === 'null' ? null : value === 'true')
const hasRootRole = (user) => (user?.roles || []).some((role) => String(role.name || '').toLowerCase() === 'root')
const isActive = (s) => s === true || s === 1

const StatusPill = ({ status }) => {
  if (status === null || status === undefined) return <span className='wfu-st del'><span className='dot'></span>Eliminado</span>
  if (isActive(status)) return <span className='wfu-st on'><span className='dot'></span>Activo</span>
  return <span className='wfu-st off'><span className='dot'></span>Inactivo</span>
}

const Users = () => {
  const tableRef = useRef(null)
  const nameRef = useRef()
  const lastnameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const confirmPasswordRef = useRef()

  const [loading, setLoading] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [rolesOptions, setRolesOptions] = useState([])
  const [selectedRoles, setSelectedRoles] = useState([])
  const [statusValue, setStatusValue] = useState('true')
  const [formOpen, setFormOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    usersRest.rolesOptions().then((data) => { if (Array.isArray(data)) setRolesOptions(data) })
  }, [])

  useEffect(() => {
    document.body.style.overflow = formOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [formOpen])

  const setFormValues = (user = null) => {
    if (nameRef.current) nameRef.current.value = user?.name || ''
    if (lastnameRef.current) lastnameRef.current.value = user?.lastname || ''
    if (emailRef.current) emailRef.current.value = user?.email || ''
    if (passwordRef.current) passwordRef.current.value = ''
    if (confirmPasswordRef.current) confirmPasswordRef.current.value = ''
    setStatusValue(user ? (user.status === null ? 'null' : (user.status ? 'true' : 'false')) : 'true')
    setSelectedRoles((user?.roles || []).map((x) => x.id))
  }

  const openForm = async (data = null) => {
    setFormError('')
    if (!data) {
      setEditingUser(null)
      setFormOpen(true)
      setTimeout(() => setFormValues(null), 30)
      return
    }
    if (hasRootRole(data)) return
    const user = await usersRest.simpleGet(`/api/users/${data.id}`)
    if (!user || hasRootRole(user)) return
    setEditingUser(user)
    setFormOpen(true)
    setTimeout(() => setFormValues(user), 30)
  }

  const closeForm = () => { if (loading) return; setFormOpen(false); setEditingUser(null); setFormError('') }

  const onRoleToggle = (roleId, checked) => {
    const id = Number(roleId)
    setSelectedRoles((old) => (checked ? Array.from(new Set([...old, id])) : old.filter((x) => x !== id)))
  }

  const onSaveSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    const password = passwordRef.current.value || ''
    const confirm = confirmPasswordRef.current.value || ''

    if (!nameRef.current.value.trim() || !lastnameRef.current.value.trim() || !emailRef.current.value.trim()) {
      setFormError('Nombres, apellidos y correo son obligatorios.'); return
    }
    if (!editingUser && !password) { setFormError('La contraseña es obligatoria para crear el usuario.'); return }
    if (password || confirm) {
      if (password.length < 8) { setFormError('La contraseña debe tener al menos 8 caracteres.'); return }
      if (password !== confirm) { setFormError('La confirmación de la contraseña no coincide.'); return }
    }
    if (selectedRoles.length === 0) { setFormError('Debes seleccionar al menos un rol.'); return }

    const payload = {
      id: editingUser?.id,
      name: nameRef.current.value,
      lastname: lastnameRef.current.value,
      email: emailRef.current.value,
      status: parseStatusValue(statusValue),
      roles: selectedRoles,
    }
    if (password) payload.password = password

    setFormError('')
    setLoading(true)
    const result = await usersRest.save(payload)
    setLoading(false)
    if (!result) return
    setFormOpen(false)
    setEditingUser(null)
    tableRef.current?.reload()
  }

  const toggleStatus = async (user) => {
    if (hasRootRole(user)) return
    const ok = await usersRest.status({ id: user.id, status: !isActive(user.status) })
    if (!ok) return
    tableRef.current?.reload()
  }

  const askDelete = (user, event) => { if (event) event.stopPropagation(); if (hasRootRole(user)) return; setConfirmTarget(user) }
  const performDelete = async () => {
    const user = confirmTarget
    if (!user) return
    setDeleting(true)
    const ok = await usersRest.delete(user.id)
    setDeleting(false)
    if (!ok) return
    setConfirmTarget(null)
    tableRef.current?.reload()
  }

  const columns = [
    {
      key: 'name', header: 'Usuario', field: 'name', filterFields: ['name', 'lastname'], nowrap: true,
      render: (d) => {
        const full = `${d.name || ''} ${d.lastname || ''}`.trim()
        return (<span className='fw-semibold'>{full || 'Sin nombre'}{hasRootRole(d) && <span className='wfu-lock ms-2'>Intocable</span>}</span>)
      },
    },
    { key: 'email', header: 'Correo', field: 'email', nowrap: true, render: (d) => <span style={{ color: '#5b6577' }}>{d.email}</span> },
    {
      key: 'roles', header: 'Roles', filterable: false, sortable: false,
      render: (d) => {
        const roles = d.roles || []
        if (!roles.length) return <span className='text-muted'>Sin roles</span>
        return <div className='d-flex flex-wrap gap-1'>{roles.map((r) => <span key={r.id} className='wfu-role'>{r.name}</span>)}</div>
      },
    },
    {
      key: 'status', header: 'Estado', field: 'status', align: 'center',
      filterOptions: [{ value: '1', label: 'Activo' }, { value: '0', label: 'Inactivo' }],
      render: (d) => <StatusPill status={d.status} />,
    },
    { key: 'created_at', header: 'Fecha', field: 'created_at', filterType: 'date', sortField: 'created_at', nowrap: true, width: 138, render: (d) => <span style={{ color: '#5b6577' }}>{d.created_at ? moment(d.created_at).format('DD/MM/YY') : '-'}</span> },
    {
      key: 'actions', header: 'Acciones', align: 'center', filterable: false, sortable: false,
      render: (d) => (hasRootRole(d)
        ? <span className='wfu-act lock' title='Usuario intocable'><i className='mdi mdi-lock-outline'></i></span>
        : (
          <div className='d-flex align-items-center justify-content-center gap-1'>
            <button className='wfu-act edit' title='Editar' onClick={() => openForm(d)}><i className='mdi mdi-square-edit-outline'></i></button>
            <button className='wfu-act toggle' title={isActive(d.status) ? 'Desactivar' : 'Activar'} onClick={() => toggleStatus(d)}><i className='mdi mdi-swap-horizontal'></i></button>
            <button className='wfu-act del' title='Eliminar' onClick={(e) => askDelete(d, e)}><i className='mdi mdi-trash-can'></i></button>
          </div>
        )),
    },
  ]

  return (
    <>
      <style>{USERS_CSS}</style>
      <AdminTable
        ref={tableRef}
        rest={usersRest}
        title='Lista de usuarios'
        icon='ti ti-users'
        countSuffix='usuarios'
        defaultSort={[{ selector: 'created_at', desc: true }]}
        minWidth={980}
        headerActions={<button type='button' className='wfu-btn' onClick={() => openForm(null)}><i className='mdi mdi-plus'></i> Nuevo usuario</button>}
        columns={columns}
      />

      <div className='wfu-modal-ovl' style={{ display: formOpen ? 'flex' : 'none' }} onMouseDown={closeForm}>
        <div className='wfu-modal' onMouseDown={(e) => e.stopPropagation()}>
          <form onSubmit={onSaveSubmit}>
            <div className='wfu-modal-head'>
              <h3 className='wfu-h2'>
                <i className={`mdi ${editingUser ? 'mdi-square-edit-outline' : 'mdi-plus-box'} me-1`} style={{ color: '#004991' }}></i>
                {editingUser ? 'Editar usuario' : 'Nuevo usuario'}
              </h3>
              <button type='button' className='wfu-close' onClick={closeForm}><i className='mdi mdi-close'></i></button>
            </div>

            <div className='wfu-modal-body'>
              {formError && <div className='wfu-err'><i className='mdi mdi-alert-circle-outline'></i>{formError}</div>}

              <div className='row g-2'>
                <InputFormGroup col='col-md-6' eRef={nameRef} label='Nombres' required />
                <InputFormGroup col='col-md-6' eRef={lastnameRef} label='Apellidos' required />
                <InputFormGroup col='col-md-8' eRef={emailRef} label='Correo' type='email' required />
                <div className='form-group col-md-4 mb-2'>
                  <label className='form-label'>Estado</label>
                  <CustomDropdown value={statusValue} options={STATUS_OPTIONS} onChange={setStatusValue} />
                </div>
                <PasswordFormGroup col='col-md-6' eRef={passwordRef} label={editingUser ? 'Nueva contraseña (opcional)' : 'Contraseña'} required={!editingUser} />
                <PasswordFormGroup col='col-md-6' eRef={confirmPasswordRef} label={editingUser ? 'Confirmar nueva contraseña' : 'Confirmar contraseña'} required={!editingUser} />
              </div>

              <div>
                <label className='form-label d-block mb-2'>Roles <span className='wfu-role ms-1'>{selectedRoles.length}</span></label>
                <div className='wfu-rolebox'>
                  <div className='row g-2'>
                    {rolesOptions.length === 0 && <div className='col-12 text-muted small p-2'>No hay roles disponibles.</div>}
                    {rolesOptions.map((role) => {
                      const checked = selectedRoles.includes(role.id)
                      return (
                        <div className='col-md-6 col-lg-4' key={role.id}>
                          <label className={`wfu-rolechk ${checked ? 'on' : ''}`}>
                            <input type='checkbox' checked={checked} onChange={(e) => onRoleToggle(role.id, e.target.checked)} />
                            <span className='text-truncate'>{role.name}</span>
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <small className='text-muted d-block mt-2'>El rol Root no se puede asignar desde este módulo.</small>
              </div>
            </div>

            <div className='wfu-modal-foot'>
              <button type='button' className='wfu-btn outline foot' onClick={closeForm} disabled={loading}>Cancelar</button>
              <button type='submit' className='wfu-btn foot' disabled={loading}>
                {loading ? <><span className='spinner-border spinner-border-sm'></span> Guardando...</> : <><i className='mdi mdi-content-save'></i> {editingUser ? 'Guardar cambios' : 'Crear usuario'}</>}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        open={!!confirmTarget}
        title='Eliminar usuario'
        message={confirmTarget ? `Se eliminará a ${`${confirmTarget.name || ''} ${confirmTarget.lastname || ''}`.trim() || 'este usuario'}. Esta acción no se puede deshacer.` : ''}
        confirmLabel='Eliminar'
        variant='danger'
        loading={deleting}
        onConfirm={performDelete}
        onCancel={() => { if (!deleting) setConfirmTarget(null) }}
      />
    </>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Adminto {...properties} title='Usuarios'>
      <Users {...properties} />
    </Adminto>
  )
})
