import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'
import AdminTable from '../Components/AdminTable.jsx'
import ConfirmModal from '../Components/ConfirmModal.jsx'
import InputFormGroup from '../Components/Form/InputFormGroup.jsx'
import TextareaFormGroup from '../Components/Form/TextareaFormGroup.jsx'
import ImageFormGroup from '../Components/Form/ImageFormGroup.jsx'
import SwitchFormGroup from '../Components/Form/SwitchFormGroup.jsx'
import CategoriesRest from '../Actions/Admin/CategoriesRest.js'

const categoriesRest = new CategoriesRest()
const FALLBACK_IMG = '/assets/img/items/item-1.png'

const CATEGORIES_CSS = `
.wfca-act{width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;border:0;font-size:13px;transition:filter .15s;}
.wfca-act:hover{filter:brightness(.95);}
.wfca-act.edit{background:#e8f0ff;color:#3b82f6;}
.wfca-act.del{background:#fcebeb;color:#e24b4a;}
.wfca-thumb{width:72px;height:48px;object-fit:cover;border-radius:8px;border:1px solid #eef2f8;}
.wfca-btn{height:40px;padding:0 14px;border-radius:12px;background:#004991;color:#fff;font-weight:600;font-size:13px;border:0;display:inline-flex;align-items:center;gap:6px;transition:background .2s;}
.wfca-btn:hover{background:#003b7a;color:#fff;}
.wfca-btn.foot{height:38px;border-radius:10px;}
.wfca-btn:disabled{opacity:.65;cursor:default;}
.wfca-btn.outline{background:#fff;border:1px solid #dce5f0;color:#5b6577;}.wfca-btn.outline:hover{background:#f4f8fd;color:#0f2540;}
.wfca-h2{font-size:18px;font-weight:700;line-height:1.25;margin:0;color:#0f2540;}
.wfca-sec{border:1px solid #eef2f8;border-radius:12px;padding:16px;}
.wfca-sec h4{font-size:14px;font-weight:700;color:#0f2540;margin:0 0 14px;display:flex;align-items:center;}
.wfca-modal-ovl{position:fixed;inset:0;z-index:1100;background:rgba(15,23,42,.5);display:flex;align-items:flex-start;justify-content:center;padding:3vh 12px;}
.wfca-modal{position:relative;width:min(820px,96vw);max-height:94vh;background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(15,37,64,.25);display:flex;flex-direction:column;overflow:hidden;}
.wfca-modal form{display:flex;flex-direction:column;min-height:0;flex:1;}
.wfca-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid #eef2f8;flex-shrink:0;}
.wfca-modal-body{overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:14px;flex:1;}
.wfca-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 20px;border-top:1px solid #eef2f8;flex-shrink:0;}
.wfca-close{width:36px;height:36px;border-radius:10px;border:0;background:none;color:#8a93a6;font-size:18px;}
.wfca-close:hover{background:#f4f8fd;color:#0f2540;}
.wfca-modal .form-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#8a93a6;margin-bottom:3px;}
.wfca-err{display:flex;align-items:center;gap:8px;background:#fcebeb;color:#b42318;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:500;}
`

const Categories = () => {
  const tableRef = useRef(null)
  const nameRef = useRef()
  const descriptionRef = useRef()
  const imageRef = useRef()

  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const setFormValues = (data = null) => {
    if (nameRef.current) nameRef.current.value = data?.name || ''
    if (descriptionRef.current) descriptionRef.current.value = data?.description || ''
    if (imageRef.current) imageRef.current.value = ''
    if (imageRef.current?.image) {
      imageRef.current.image.src = data?.image ? `/api/categories/media/${data.image}` : FALLBACK_IMG
    }
  }

  const onModalOpen = (data = null) => {
    setDataLoaded(data)
    setFormError('')
    setFormOpen(true)
    setTimeout(() => setFormValues(data), 30)
  }

  const closeForm = () => { if (loading) return; setFormOpen(false); setDataLoaded(null); setFormError('') }

  useEffect(() => {
    document.body.style.overflow = formOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [formOpen])

  const askDelete = (category, event) => { if (event) event.stopPropagation(); setConfirmTarget(category) }

  const performDelete = async () => {
    const category = confirmTarget
    if (!category) return
    setDeleting(true)
    const ok = await categoriesRest.delete(category.id)
    setDeleting(false)
    if (!ok) return
    setConfirmTarget(null)
    tableRef.current?.reload()
  }

  const onSaveSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    const category = {
      id: dataLoaded?.id,
      name: nameRef.current.value,
      description: descriptionRef.current.value,
      status: true,
      image: imageRef.current.files?.[0] ?? null,
    }

    if (!category.id && !category.image) {
      setFormError('La imagen es obligatoria para registrar una categoría.')
      return
    }

    setFormError('')
    setLoading(true)
    const result = await categoriesRest.save(category)
    setLoading(false)

    if (!result) return
    setFormOpen(false)
    setDataLoaded(null)
    tableRef.current?.reload()
  }

  const columns = [
    { key: 'name', header: 'Nombre', field: 'name', nowrap: true, render: (d) => <span className='fw-semibold'>{d.name}</span> },
    { key: 'description', header: 'Descripción', field: 'description', render: (d) => <span style={{ color: '#5b6577' }}>{d.description || '-'}</span> },
    {
      key: 'image', header: 'Imagen', filterable: false, sortable: false, width: 110,
      render: (d) => <img className='wfca-thumb' src={d.image ? `/api/categories/media/${d.image}` : FALLBACK_IMG} alt={d.name} onError={(e) => { if (!e.target.src.endsWith(FALLBACK_IMG)) e.target.src = FALLBACK_IMG }} />,
    },
    {
      key: 'status', header: 'Estado', field: 'status', align: 'center',
      filterOptions: [{ value: '1', label: 'Activo' }, { value: '0', label: 'Inactivo' }],
      render: (d) => {
        const isActive = d.status === true || d.status === 1 || d.status === '1'
        return (
          <SwitchFormGroup id={`switch-category-${d.id}`} checked={isActive} refreshable={isActive} noMargin
            onChange={async (event) => { await categoriesRest.status({ id: d.id, status: !event.currentTarget.checked }); tableRef.current?.reload() }} />
        )
      },
    },
    { key: 'created_at', header: 'Fecha', field: 'created_at', filterType: 'date', sortField: 'created_at', nowrap: true, width: 138, render: (d) => <span style={{ color: '#5b6577' }}>{d.created_at ? moment(d.created_at).format('DD/MM/YY') : '-'}</span> },
    {
      key: 'actions', header: 'Acciones', align: 'center', filterable: false, sortable: false,
      render: (d) => (
        <div className='d-flex align-items-center justify-content-center gap-1'>
          <button className='wfca-act edit' title='Editar' onClick={() => onModalOpen(d)}><i className='mdi mdi-square-edit-outline'></i></button>
          <button className='wfca-act del' title='Eliminar' onClick={(e) => askDelete(d, e)}><i className='mdi mdi-trash-can'></i></button>
        </div>
      ),
    },
  ]

  return (
    <>
      <style>{CATEGORIES_CSS}</style>
      <AdminTable
        ref={tableRef}
        rest={categoriesRest}
        title='Lista de categorías'
        icon='ti ti-category'
        countSuffix='categorías'
        defaultSort={[{ selector: 'name', desc: false }]}
        minWidth={820}
        headerActions={<button type='button' className='wfca-btn' onClick={() => onModalOpen(null)}><i className='mdi mdi-plus'></i> Nueva categoría</button>}
        columns={columns}
      />

      <div className='wfca-modal-ovl' style={{ display: formOpen ? 'flex' : 'none' }} onMouseDown={closeForm}>
        <div className='wfca-modal' onMouseDown={(e) => e.stopPropagation()}>
          <form onSubmit={onSaveSubmit}>
            <div className='wfca-modal-head'>
              <h3 className='wfca-h2' style={{ fontSize: 16 }}>
                <i className={`mdi ${dataLoaded ? 'mdi-square-edit-outline' : 'mdi-plus-box'} me-1`} style={{ color: '#004991' }}></i>
                {dataLoaded ? 'Editar categoría' : 'Nueva categoría'}
              </h3>
              <button type='button' className='wfca-close' onClick={closeForm}><i className='mdi mdi-close'></i></button>
            </div>

            <div className='wfca-modal-body'>
              {formError && <div className='wfca-err'><i className='mdi mdi-alert-circle-outline'></i>{formError}</div>}
              <div className='wfca-sec'>
                <h4><i className='mdi mdi-shape-outline me-1' style={{ color: '#004991' }}></i>Datos de la categoría</h4>
                <div className='row'>
                  <div className='col-md-6'>
                    <InputFormGroup eRef={nameRef} label='Nombre' required />
                    <TextareaFormGroup eRef={descriptionRef} label='Descripción' rows={4} />
                  </div>
                  <ImageFormGroup col='col-md-6' eRef={imageRef} label='Imagen' required={!dataLoaded} aspect='16/9' fit='cover' onError={FALLBACK_IMG} />
                </div>
              </div>
            </div>

            <div className='wfca-modal-foot'>
              <button type='button' className='wfca-btn outline foot' onClick={closeForm} disabled={loading}>Cancelar</button>
              <button type='submit' className='wfca-btn foot' disabled={loading}>
                {loading
                  ? <><span className='spinner-border spinner-border-sm'></span> Guardando...</>
                  : <><i className='mdi mdi-content-save'></i> {dataLoaded ? 'Guardar cambios' : 'Crear categoría'}</>}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        open={!!confirmTarget}
        title='Eliminar categoría'
        message={confirmTarget ? `Se eliminará "${confirmTarget.name}". Esta acción no se puede deshacer.` : ''}
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
    <Adminto {...properties} title='Categorias'>
      <Categories {...properties} />
    </Adminto>
  )
})
