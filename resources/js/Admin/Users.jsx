import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import ReactAppend from '../Utils/ReactAppend.jsx'
import Adminto from '../Components/Adminto.jsx'
import Modal from '../Components/Modal.jsx'
import Table from '../Components/Table.jsx'
import InputFormGroup from '../Components/Form/InputFormGroup.jsx'
import PasswordFormGroup from '../Components/Form/PasswordFormGroup.jsx'
import TippyButton from '../Components/Form/TippyButton.jsx'
import UsersRest from '../Actions/Admin/UsersRest.js'

const usersRest = new UsersRest()

const Users = () => {
  const gridRef = useRef()
  const modalRef = useRef()
  const nameRef = useRef()
  const lastnameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const confirmPasswordRef = useRef()
  const statusRef = useRef()

  const [loading, setLoading] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [rolesOptions, setRolesOptions] = useState([])
  const [selectedRoles, setSelectedRoles] = useState([])

  const refreshGrid = () => $(gridRef.current).dxDataGrid('instance').refresh()

  useEffect(() => {
    usersRest.rolesOptions().then((data) => {
      if (!Array.isArray(data)) return
      setRolesOptions(data)
    })
  }, [])

  const hasRootRole = (user) => (user?.roles || []).some((role) => String(role.name || '').toLowerCase() === 'root')

  const resetForm = () => {
    setEditingUser(null)
    setSelectedRoles([])
    if (nameRef.current) nameRef.current.value = ''
    if (lastnameRef.current) lastnameRef.current.value = ''
    if (emailRef.current) emailRef.current.value = ''
    if (passwordRef.current) passwordRef.current.value = ''
    if (confirmPasswordRef.current) confirmPasswordRef.current.value = ''
    if (statusRef.current) statusRef.current.value = 'true'
  }

  const onModalOpen = async (data = null) => {
    if (!data) {
      resetForm()
      $(modalRef.current).modal('show')
      return
    }

    if (hasRootRole(data)) return

    const user = await usersRest.simpleGet(`/api/users/${data.id}`)
    if (!user) return

    if (hasRootRole(user)) return

    setEditingUser(user)
    setSelectedRoles((user.roles || []).map((x) => x.id))
    $(modalRef.current).modal('show')
    setTimeout(() => {
      if (nameRef.current) nameRef.current.value = user.name || ''
      if (lastnameRef.current) lastnameRef.current.value = user.lastname || ''
      if (emailRef.current) emailRef.current.value = user.email || ''
      if (statusRef.current) {
        statusRef.current.value = user.status === null ? 'null' : (user.status ? 'true' : 'false')
      }
      if (passwordRef.current) passwordRef.current.value = ''
      if (confirmPasswordRef.current) confirmPasswordRef.current.value = ''
    }, 50)
  }

  const onRoleToggle = (roleId, checked) => {
    const id = Number(roleId)
    setSelectedRoles((old) => {
      if (checked) return Array.from(new Set([...old, id]))
      return old.filter((x) => x !== id)
    })
  }

  const parseStatusValue = (value) => {
    if (value === 'null') return null
    if (value === 'true') return true
    return false
  }

  const onSaveSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    const password = passwordRef.current.value || ''
    const confirm = confirmPasswordRef.current.value || ''

    if (!editingUser && !password) {
      alert('La contrasena es obligatoria para crear el usuario.')
      return
    }

    if (password || confirm) {
      if (password.length < 8) {
        alert('La contrasena debe tener al menos 8 caracteres.')
        return
      }
      if (password !== confirm) {
        alert('La confirmacion de la contrasena no coincide.')
        return
      }
    }

    if (selectedRoles.length === 0) {
      alert('Debes seleccionar al menos un rol.')
      return
    }

    const payload = {
      id: editingUser?.id,
      name: nameRef.current.value,
      lastname: lastnameRef.current.value,
      email: emailRef.current.value,
      status: parseStatusValue(statusRef.current.value),
      roles: selectedRoles,
    }

    if (password) payload.password = password

    setLoading(true)
    const result = await usersRest.save(payload)
    setLoading(false)

    if (!result) return

    $(modalRef.current).modal('hide')
    resetForm()
    refreshGrid()
  }

  const onChangeStatusClicked = async (data, status) => {
    if (hasRootRole(data)) return
    const ok = await usersRest.status({ id: data.id, status })
    if (!ok) return
    refreshGrid()
  }

  const onDeleteClicked = async (data) => {
    if (hasRootRole(data)) return
    const ok = await usersRest.delete(data.id)
    if (!ok) return
    refreshGrid()
  }

  return (
    <>
      <Table
        gridRef={gridRef}
        title='Usuarios'
        rest={usersRest}
        toolBar={(container) => {
          container.unshift({
            widget: 'dxButton',
            location: 'after',
            options: {
              icon: 'plus',
              hint: 'Nuevo usuario',
              onClick: () => onModalOpen(null)
            }
          })
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
            caption: 'Usuario',
            minWidth: 220,
            cellTemplate: (container, { data }) => {
              const fullName = `${data.name || ''} ${data.lastname || ''}`.trim()
              ReactAppend(container, <div className='d-flex align-items-center gap-2'>
                <span>{fullName || 'Sin nombre'}</span>
                {hasRootRole(data) && <span className='badge bg-dark'>Intocable</span>}
              </div>)
            }
          },
          {
            dataField: 'email',
            caption: 'Correo',
            minWidth: 220
          },
          {
            caption: 'Roles',
            minWidth: 220,
            allowFiltering: false,
            cellTemplate: (container, { data }) => {
              const roles = data.roles || []
              if (!roles.length) {
                ReactAppend(container, <span className='text-muted'>Sin roles</span>)
                return
              }
              ReactAppend(container, <div className='d-flex flex-wrap gap-1'>
                {roles.map((role) => <span key={role.id} className='badge bg-info-subtle text-info'>{role.name}</span>)}
              </div>)
            }
          },
          {
            dataField: 'status',
            caption: 'Estado',
            width: 120,
            cellTemplate: (container, { data }) => {
              const status = data.status
              let label = 'Eliminado'
              let cls = 'bg-danger'
              if (status === true || status === 1) {
                label = 'Activo'
                cls = 'bg-success'
              } else if (status === false || status === 0) {
                label = 'Inactivo'
                cls = 'bg-warning'
              }
              ReactAppend(container, <span className={`badge ${cls}`}>{label}</span>)
            }
          },
          {
            dataField: 'created_at',
            caption: 'Fecha',
            dataType: 'date',
            width: 130,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <span>{moment(data.created_at).format('LL')}</span>)
            }
          },
          {
            caption: 'Acciones',
            width: 180,
            cellTemplate: (container, { data }) => {
              container.attr('style', 'display: flex; gap: 4px; overflow: unset')
              const locked = hasRootRole(data)

              if (locked) {
                ReactAppend(container, <TippyButton className='btn btn-sm btn-secondary disabled' title='Usuario intocable'>
                  <i className='mdi mdi-lock-outline'></i>
                </TippyButton>)
                return
              }

              ReactAppend(container, <TippyButton className='btn btn-sm btn-soft-primary' title='Editar' onClick={() => onModalOpen(data)}>
                <i className='mdi mdi-square-edit-outline'></i>
              </TippyButton>)

              ReactAppend(container, <TippyButton
                className='btn btn-sm btn-soft-warning'
                title={data.status ? 'Desactivar' : 'Activar'}
                onClick={() => onChangeStatusClicked(data, !(data.status === true || data.status === 1))}
              >
                <i className='mdi mdi-swap-horizontal'></i>
              </TippyButton>)

              ReactAppend(container, <TippyButton className='btn btn-sm btn-soft-danger' title='Eliminar' onClick={() => onDeleteClicked(data)}>
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
        title={editingUser ? 'Editar usuario' : 'Nuevo usuario'}
        onClose={resetForm}
        onSubmit={onSaveSubmit}
        loading={loading}
        size='lg'
      >
        <div className='row'>
          <InputFormGroup col='col-md-6' eRef={nameRef} label='Nombres' required />
          <InputFormGroup col='col-md-6' eRef={lastnameRef} label='Apellidos' required />
          <InputFormGroup col='col-md-8' eRef={emailRef} label='Correo' type='email' required />
          <div className='form-group col-md-4 mb-2'>
            <label className='form-label'>Estado</label>
            <select ref={statusRef} className='form-control' defaultValue='true'>
              <option value='true'>Activo</option>
              <option value='false'>Inactivo</option>
              <option value='null'>Eliminado</option>
            </select>
          </div>
          <PasswordFormGroup
            col='col-md-6'
            eRef={passwordRef}
            label={editingUser ? 'Nueva contrasena (opcional)' : 'Contrasena'}
            required={!editingUser}
          />
          <PasswordFormGroup
            col='col-md-6'
            eRef={confirmPasswordRef}
            label={editingUser ? 'Confirmar nueva contrasena' : 'Confirmar contrasena'}
            required={!editingUser}
          />
          <div className='col-12 mt-2'>
            <label className='form-label mb-2'>Roles</label>
            <div className='border rounded p-2' style={{ maxHeight: '220px', overflowY: 'auto' }}>
              <div className='row g-2'>
                {rolesOptions.length === 0 && <div className='col-12 text-muted'>No hay roles disponibles</div>}
                {rolesOptions.map((role) => {
                  const checked = selectedRoles.includes(role.id)
                  const checkboxId = `role-${role.id}`
                  return (
                    <div className='col-md-6 col-lg-4' key={role.id}>
                      <div className='form-check'>
                        <input
                          id={checkboxId}
                          className='form-check-input'
                          type='checkbox'
                          checked={checked}
                          onChange={(e) => onRoleToggle(role.id, e.target.checked)}
                        />
                        <label className='form-check-label' htmlFor={checkboxId}>
                          {role.name}
                        </label>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <small className='text-muted d-block mt-2'>
              El rol Root no se puede asignar desde este modulo.
            </small>
          </div>
        </div>
      </Modal>
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
