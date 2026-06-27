import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'
import AdminTable from '../Components/AdminTable.jsx'
import ConfirmModal from '../Components/ConfirmModal.jsx'
import InputFormGroup from '../Components/Form/InputFormGroup.jsx'
import RolesRest from '../Actions/Admin/RolesRest.js'

const rolesRest = new RolesRest()

const ROLES_CSS = `
.wfr-act{width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;border:0;font-size:13px;cursor:pointer;transition:filter .15s;}
.wfr-act:hover{filter:brightness(.95);}
.wfr-act.edit{background:#e8f0ff;color:#3b82f6;}
.wfr-act.del{background:#fcebeb;color:#e24b4a;}
.wfr-act.lock{background:#eef1f6;color:#8a93a6;cursor:default;}
.wfr-chip{display:inline-flex;align-items:center;padding:3px 10px;border-radius:50rem;font-size:11px;font-weight:600;background:#e6effa;color:#004991;}
.wfr-lock{display:inline-flex;align-items:center;padding:2px 8px;border-radius:50rem;font-size:10px;font-weight:700;background:#0f2540;color:#fff;}
.wfr-btn{height:40px;padding:0 14px;border-radius:12px;background:#004991;color:#fff;font-weight:600;font-size:13px;border:0;display:inline-flex;align-items:center;gap:6px;transition:background .2s;}
.wfr-btn:hover{background:#003b7a;color:#fff;}
.wfr-btn.foot{height:38px;border-radius:10px;}
.wfr-btn:disabled{opacity:.65;cursor:default;}
.wfr-btn.outline{background:#fff;border:1px solid #dce5f0;color:#5b6577;}.wfr-btn.outline:hover{background:#f4f8fd;color:#0f2540;}
.wfr-h2{font-size:16px;font-weight:700;color:#0f2540;margin:0;}
.wfr-modal-ovl{position:fixed;inset:0;z-index:1100;background:rgba(15,23,42,.5);display:flex;align-items:flex-start;justify-content:center;padding:3vh 12px;}
.wfr-modal{position:relative;width:min(820px,96vw);max-height:94vh;background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(15,37,64,.25);display:flex;flex-direction:column;overflow:hidden;}
.wfr-modal form{display:flex;flex-direction:column;min-height:0;flex:1;}
.wfr-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid #eef2f8;flex-shrink:0;}
.wfr-modal-body{overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:14px;flex:1;}
.wfr-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 20px;border-top:1px solid #eef2f8;flex-shrink:0;}
.wfr-close{width:36px;height:36px;border-radius:10px;border:0;background:none;color:#8a93a6;font-size:18px;cursor:pointer;}
.wfr-close:hover{background:#f4f8fd;color:#0f2540;}
.wfr-modal .form-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#8a93a6;}
.wfr-modal .form-control{border:1px solid #dce5f0;border-radius:10px;font-size:13.5px;}
.wfr-modal .form-control:focus{border-color:#004991;box-shadow:0 0 0 .18rem rgba(0,73,145,.12);}
.wfr-err{display:flex;align-items:center;gap:8px;background:#fcebeb;color:#b42318;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:500;}
.wfr-permbox{border:1px solid #eef2f8;border-radius:12px;padding:10px;max-height:340px;overflow-y:auto;}
.wfr-perm{display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid #eef2f8;border-radius:9px;font-size:13px;color:#1f2a44;cursor:pointer;transition:.15s;}
.wfr-perm:hover{background:#f9fbfe;}
.wfr-perm.on{background:#e6effa;border-color:#bcd4ef;color:#004991;font-weight:600;}
.wfr-perm input{accent-color:#004991;width:15px;height:15px;}
.wfr-search{height:36px;border:1px solid #dce5f0;border-radius:10px;padding:0 12px;font-size:13px;width:100%;outline:none;}
.wfr-search:focus{border-color:#004991;}
`

const isLockedRole = (name) => String(name || '').toLowerCase() === 'root'

const Roles = () => {
  const tableRef = useRef(null)
  const nameRef = useRef()

  const [loading, setLoading] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [permSearch, setPermSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    rolesRest.permissionsOptions().then((data) => { if (Array.isArray(data)) setPermissions(data) })
  }, [])

  useEffect(() => {
    document.body.style.overflow = formOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [formOpen])

  const openForm = async (data = null) => {
    setFormError('')
    setPermSearch('')
    if (!data) {
      setEditingRole(null)
      setSelectedPermissions([])
      setFormOpen(true)
      setTimeout(() => { if (nameRef.current) nameRef.current.value = '' }, 30)
      return
    }
    if (isLockedRole(data.name)) return
    const full = await rolesRest.simpleGet(`/api/roles/${data.id}`)
    if (!full) return
    setEditingRole(full)
    setSelectedPermissions((full.permissions || []).map((x) => x.id))
    setFormOpen(true)
    setTimeout(() => { if (nameRef.current) nameRef.current.value = full.name || '' }, 30)
  }

  const closeForm = () => { if (loading) return; setFormOpen(false); setEditingRole(null); setFormError('') }

  const togglePerm = (id, checked) => {
    const pid = Number(id)
    setSelectedPermissions((old) => (checked ? Array.from(new Set([...old, pid])) : old.filter((x) => x !== pid)))
  }
  const selectAllPerms = () => setSelectedPermissions(permissions.map((p) => p.id))
  const clearPerms = () => setSelectedPermissions([])

  const askDelete = (role, event) => { if (event) event.stopPropagation(); if (isLockedRole(role.name)) return; setConfirmTarget(role) }
  const performDelete = async () => {
    const role = confirmTarget
    if (!role) return
    setDeleting(true)
    const ok = await rolesRest.delete(role.id)
    setDeleting(false)
    if (!ok) return
    setConfirmTarget(null)
    tableRef.current?.reload()
  }

  const onSaveSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    if (!nameRef.current.value.trim()) { setFormError('El nombre del rol es obligatorio.'); return }
    setFormError('')
    setLoading(true)
    const result = await rolesRest.save({ id: editingRole?.id, name: nameRef.current.value, permissions: selectedPermissions })
    setLoading(false)
    if (!result) return
    setFormOpen(false)
    setEditingRole(null)
    tableRef.current?.reload()
  }

  const shownPerms = permSearch.trim()
    ? permissions.filter((p) => p.name.toLowerCase().includes(permSearch.trim().toLowerCase()))
    : permissions

  const columns = [
    {
      key: 'name', header: 'Rol', field: 'name', nowrap: true,
      render: (d) => (<span className='fw-semibold'>{d.name}{isLockedRole(d.name) && <span className='wfr-lock ms-2'>Intocable</span>}</span>),
    },
    {
      key: 'permissions_count', header: 'Permisos', field: 'permissions_count', align: 'center', filterable: false,
      render: (d) => <span className='wfr-chip'>{d.permissions_count ?? (d.permissions?.length || 0)}</span>,
    },
    { key: 'created_at', header: 'Fecha', field: 'created_at', filterType: 'date', sortField: 'created_at', nowrap: true, width: 138, render: (d) => <span style={{ color: '#5b6577' }}>{d.created_at ? moment(d.created_at).format('DD/MM/YY') : '-'}</span> },
    {
      key: 'actions', header: 'Acciones', align: 'center', filterable: false, sortable: false,
      render: (d) => (isLockedRole(d.name)
        ? <span className='wfr-act lock' title='Rol intocable'><i className='mdi mdi-lock-outline'></i></span>
        : (
          <div className='d-flex align-items-center justify-content-center gap-1'>
            <button className='wfr-act edit' title='Editar' onClick={() => openForm(d)}><i className='mdi mdi-square-edit-outline'></i></button>
            <button className='wfr-act del' title='Eliminar' onClick={(e) => askDelete(d, e)}><i className='mdi mdi-trash-can'></i></button>
          </div>
        )),
    },
  ]

  return (
    <>
      <style>{ROLES_CSS}</style>
      <AdminTable
        ref={tableRef}
        rest={rolesRest}
        title='Lista de roles'
        icon='ti ti-key'
        countSuffix='roles'
        defaultSort={[{ selector: 'name', desc: false }]}
        minWidth={720}
        headerActions={<button type='button' className='wfr-btn' onClick={() => openForm(null)}><i className='mdi mdi-plus'></i> Nuevo rol</button>}
        columns={columns}
      />

      <div className='wfr-modal-ovl' style={{ display: formOpen ? 'flex' : 'none' }} onMouseDown={closeForm}>
        <div className='wfr-modal' onMouseDown={(e) => e.stopPropagation()}>
          <form onSubmit={onSaveSubmit}>
            <div className='wfr-modal-head'>
              <h3 className='wfr-h2'>
                <i className={`mdi ${editingRole ? 'mdi-square-edit-outline' : 'mdi-plus-box'} me-1`} style={{ color: '#004991' }}></i>
                {editingRole ? 'Editar rol' : 'Nuevo rol'}
              </h3>
              <button type='button' className='wfr-close' onClick={closeForm}><i className='mdi mdi-close'></i></button>
            </div>

            <div className='wfr-modal-body'>
              {formError && <div className='wfr-err'><i className='mdi mdi-alert-circle-outline'></i>{formError}</div>}

              <InputFormGroup col='col-12' eRef={nameRef} label='Nombre del rol' required />

              <div>
                <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2'>
                  <label className='form-label mb-0'>Permisos <span className='wfr-chip ms-1'>{selectedPermissions.length}</span></label>
                  <div className='d-flex gap-2'>
                    <button type='button' className='wfr-btn outline foot' style={{ height: 30, padding: '0 10px' }} onClick={selectAllPerms}>Todos</button>
                    <button type='button' className='wfr-btn outline foot' style={{ height: 30, padding: '0 10px' }} onClick={clearPerms}>Ninguno</button>
                  </div>
                </div>
                <input className='wfr-search mb-2' placeholder='Buscar permiso...' value={permSearch} onChange={(e) => setPermSearch(e.target.value)} />
                <div className='wfr-permbox'>
                  <div className='row g-2'>
                    {shownPerms.length === 0 && <div className='col-12 text-muted small p-2'>Sin permisos.</div>}
                    {shownPerms.map((permission) => {
                      const checked = selectedPermissions.includes(permission.id)
                      return (
                        <div className='col-md-6 col-lg-4' key={permission.id}>
                          <label className={`wfr-perm ${checked ? 'on' : ''}`}>
                            <input type='checkbox' checked={checked} onChange={(e) => togglePerm(permission.id, e.target.checked)} />
                            <span className='text-truncate'>{permission.name}</span>
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <small className='text-muted d-block mt-2'>El rol Root no se gestiona desde este módulo.</small>
              </div>
            </div>

            <div className='wfr-modal-foot'>
              <button type='button' className='wfr-btn outline foot' onClick={closeForm} disabled={loading}>Cancelar</button>
              <button type='submit' className='wfr-btn foot' disabled={loading}>
                {loading ? <><span className='spinner-border spinner-border-sm'></span> Guardando...</> : <><i className='mdi mdi-content-save'></i> {editingRole ? 'Guardar cambios' : 'Crear rol'}</>}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        open={!!confirmTarget}
        title='Eliminar rol'
        message={confirmTarget ? `Se eliminará el rol "${confirmTarget.name}". Esta acción no se puede deshacer.` : ''}
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
    <Adminto {...properties} title='Roles'>
      <Roles {...properties} />
    </Adminto>
  )
})
