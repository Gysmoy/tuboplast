import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import ReactAppend from '../Utils/ReactAppend.jsx'
import Adminto from '../Components/Adminto.jsx'
import Modal from '../Components/Modal.jsx'
import Table from '../Components/Table.jsx'
import InputFormGroup from '../Components/Form/InputFormGroup.jsx'
import TippyButton from '../Components/Form/TippyButton.jsx'
import RolesRest from '../Actions/Admin/RolesRest.js'

const rolesRest = new RolesRest()

const Roles = () => {
  const gridRef = useRef()
  const modalRef = useRef()
  const nameRef = useRef()

  const [loading, setLoading] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [selectedPermissions, setSelectedPermissions] = useState([])

  const refreshGrid = () => $(gridRef.current).dxDataGrid('instance').refresh()

  useEffect(() => {
    rolesRest.permissionsOptions().then((data) => {
      if (!Array.isArray(data)) return
      setPermissions(data)
    })
  }, [])

  const isLockedRole = (roleName) => String(roleName || '').toLowerCase() === 'root'

  const resetForm = () => {
    setEditingRole(null)
    setSelectedPermissions([])
    if (nameRef.current) nameRef.current.value = ''
  }

  const onModalOpen = async (data = null) => {
    if (!data) {
      resetForm()
      $(modalRef.current).modal('show')
      return
    }

    if (isLockedRole(data.name)) return

    const fullRole = await rolesRest.simpleGet(`/api/roles/${data.id}`)
    if (!fullRole) return

    setEditingRole(fullRole)
    setSelectedPermissions((fullRole.permissions || []).map((x) => x.id))
    $(modalRef.current).modal('show')
    setTimeout(() => {
      if (nameRef.current) nameRef.current.value = fullRole.name || ''
    }, 50)
  }

  const onPermissionToggle = (permissionId, checked) => {
    const id = Number(permissionId)
    setSelectedPermissions((old) => {
      if (checked) {
        return Array.from(new Set([...old, id]))
      }
      return old.filter((x) => x !== id)
    })
  }

  const onDeleteClicked = async (data) => {
    if (isLockedRole(data.name)) return
    const ok = await rolesRest.delete(data.id)
    if (!ok) return
    refreshGrid()
  }

  const onSaveSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    const result = await rolesRest.save({
      id: editingRole?.id,
      name: nameRef.current.value,
      permissions: selectedPermissions,
    })
    setLoading(false)

    if (!result) return

    $(modalRef.current).modal('hide')
    refreshGrid()
    resetForm()
  }

  return (
    <>
      <Table
        gridRef={gridRef}
        title='Roles'
        rest={rolesRest}
        toolBar={(container) => {
          container.unshift({
            widget: 'dxButton',
            location: 'after',
            options: {
              icon: 'plus',
              hint: 'Nuevo rol',
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
            caption: 'Rol',
            sortOrder: 'asc',
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <div className='d-flex align-items-center gap-2'>
                <span>{data.name}</span>
                {isLockedRole(data.name) && <span className='badge bg-dark'>Intocable</span>}
              </div>)
            }
          },
          {
            dataField: 'permissions_count',
            caption: 'Permisos',
            width: '120px',
            alignment: 'center'
          },
          {
            dataField: 'created_at',
            caption: 'Fecha',
            dataType: 'date',
            width: '140px',
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <span>{moment(data.created_at).format('LL')}</span>)
            }
          },
          {
            caption: 'Acciones',
            width: '130px',
            cellTemplate: (container, { data }) => {
              container.attr('style', 'display: flex; gap: 4px; overflow: unset')

              const locked = isLockedRole(data.name)
              if (locked) {
                ReactAppend(container, <TippyButton className='btn btn-sm btn-secondary disabled' title='Rol intocable'>
                  <i className='mdi mdi-lock-outline'></i>
                </TippyButton>)
                return
              }

              ReactAppend(container, <TippyButton className='btn btn-sm btn-soft-primary' title='Editar' onClick={() => onModalOpen(data)}>
                <i className='mdi mdi-square-edit-outline'></i>
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
        title={editingRole ? 'Editar rol' : 'Nuevo rol'}
        onClose={resetForm}
        onSubmit={onSaveSubmit}
        loading={loading}
        size='lg'
      >
        <div className='row'>
          <InputFormGroup
            col='col-12'
            eRef={nameRef}
            label='Nombre del rol'
            required
          />
          <div className='col-12 mt-2'>
            <label className='form-label mb-2'>Permisos</label>
            <div className='border rounded p-2' style={{ maxHeight: '320px', overflowY: 'auto' }}>
              <div className='row g-2'>
                {permissions.length === 0 && <div className='col-12 text-muted'>No hay permisos disponibles</div>}
                {permissions.map((permission) => {
                  const checked = selectedPermissions.includes(permission.id)
                  const checkboxId = `perm-${permission.id}`
                  return (
                    <div className='col-md-6 col-lg-4' key={permission.id}>
                      <div className='form-check'>
                        <input
                          id={checkboxId}
                          className='form-check-input'
                          type='checkbox'
                          checked={checked}
                          onChange={(e) => onPermissionToggle(permission.id, e.target.checked)}
                        />
                        <label className='form-check-label' htmlFor={checkboxId}>
                          {permission.name}
                        </label>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <small className='text-muted d-block mt-2'>
              El rol Root no se gestiona desde este modulo.
            </small>
          </div>
        </div>
      </Modal>
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
