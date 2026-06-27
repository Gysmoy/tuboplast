import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'
import AdminTable from '../Components/AdminTable.jsx'
import ConfirmModal from '../Components/ConfirmModal.jsx'
import CustomDropdown from '../Components/CustomDropdown.jsx'
import InputFormGroup from '../Components/Form/InputFormGroup.jsx'
import SwitchFormGroup from '../Components/Form/SwitchFormGroup.jsx'
import DistribuidoresRest from '../Actions/Admin/DistribuidoresRest.js'
import { getDepartments, getDistricts, getProvinces } from '../Utils/ubigeo.js'
import { loadGoogleMapsApi } from '../Utils/googleMaps.js'

const distribuidoresRest = new DistribuidoresRest()
const DEFAULT_CENTER = { lat: -12.046374, lng: -77.042793 }

const PLACE_CSS = `
.wfd-act{width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;border:0;font-size:13px;transition:filter .15s;}
.wfd-act:hover{filter:brightness(.95);}
.wfd-act.edit{background:#e8f0ff;color:#3b82f6;}
.wfd-act.del{background:#fcebeb;color:#e24b4a;}
.wfd-chip{display:inline-flex;align-items:center;padding:3px 10px;border-radius:50rem;font-size:11px;font-weight:600;background:#e6effa;color:#004991;}
.wfd-btn{height:40px;padding:0 14px;border-radius:12px;background:#004991;color:#fff;font-weight:600;font-size:13px;border:0;display:inline-flex;align-items:center;gap:6px;transition:background .2s;}
.wfd-btn:hover{background:#003b7a;color:#fff;}
.wfd-btn.foot{height:38px;border-radius:10px;}
.wfd-btn:disabled{opacity:.65;cursor:default;}
.wfd-btn.outline{background:#fff;border:1px solid #dce5f0;color:#5b6577;}.wfd-btn.outline:hover{background:#f4f8fd;color:#0f2540;}
.wfd-h2{font-size:18px;font-weight:700;line-height:1.25;margin:0;color:#0f2540;}
.wfd-sec{border:1px solid #eef2f8;border-radius:12px;padding:16px;}
.wfd-sec h4{font-size:14px;font-weight:700;color:#0f2540;margin:0 0 14px;display:flex;align-items:center;}
.wfd-modal-ovl{position:fixed;inset:0;z-index:1100;background:rgba(15,23,42,.5);display:flex;align-items:flex-start;justify-content:center;padding:3vh 12px;}
.wfd-modal{position:relative;width:min(960px,96vw);max-height:94vh;background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(15,37,64,.25);display:flex;flex-direction:column;overflow:hidden;}
.wfd-modal form{display:flex;flex-direction:column;min-height:0;flex:1;}
.wfd-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid #eef2f8;flex-shrink:0;}
.wfd-modal-body{overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:14px;flex:1;}
.wfd-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 20px;border-top:1px solid #eef2f8;flex-shrink:0;}
.wfd-close{width:36px;height:36px;border-radius:10px;border:0;background:none;color:#8a93a6;font-size:18px;}
.wfd-close:hover{background:#f4f8fd;color:#0f2540;}
.wfd-modal .form-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#8a93a6;margin-bottom:3px;}
.wfd-err{display:flex;align-items:center;gap:8px;background:#fcebeb;color:#b42318;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:500;}
.wfd-tg{display:inline-flex;align-items:center;gap:10px;cursor:pointer;border:0;background:none;padding:0;}
.wfd-tg-track{width:42px;height:24px;border-radius:50rem;background:#cdd6e4;position:relative;transition:background .2s;flex-shrink:0;}
.wfd-tg-track.on{background:#16a34a;}
.wfd-tg-knob{position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 2px rgba(0,0,0,.2);}
.wfd-tg-track.on .wfd-tg-knob{left:21px;}
.wfd-tg-txt{font-size:13px;color:#1f2a44;font-weight:500;}
`

const toCoordinate = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const formatCoordinate = (value) => {
  const parsed = toCoordinate(value)
  return parsed == null ? '' : parsed.toFixed(6)
}

const FieldSelect = ({ col = 'col-md-4', label, required, value, options, onChange }) => (
  <div className={`form-group ${col} mb-2`}>
    <label className='form-label'>{label} {required && <b className='text-danger'>*</b>}</label>
    <CustomDropdown value={value} options={options} onChange={onChange} placeholder='Seleccionar' />
  </div>
)

// Campo de solo lectura controlado: InputFormGroup es uncontrolled (defaultValue) y el
// modal no se desmonta, así que no reflejaría los cambios de estado.
const ReadOnlyField = ({ col = 'col-md-4', label, value }) => (
  <div className={`form-group ${col} mb-2`}>
    <label className='form-label'>{label}</label>
    <input className='form-control' value={value ?? ''} readOnly disabled />
  </div>
)

const Distributors = ({ gmapsApiKey }) => {
  const tableRef = useRef(null)
  const mapRef = useRef()
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)
  const nameRef = useRef()
  const phoneRef = useRef()
  const businessHoursRef = useRef()
  const addressRef = useRef()
  const referenceRef = useRef()

  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(null)
  const [ubigeoRows, setUbigeoRows] = useState([])
  const [department, setDepartment] = useState('')
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [ubigeo, setUbigeo] = useState('')
  const [status, setStatus] = useState(true)
  const [featured, setFeatured] = useState(false)
  const [phonePrefix, setPhonePrefix] = useState('+51')
  const [prefixes, setPrefixes] = useState([])
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mapLoading, setMapLoading] = useState(false)
  const [mapError, setMapError] = useState('')
  const [formError, setFormError] = useState('')
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const departments = useMemo(() => getDepartments(ubigeoRows), [ubigeoRows])
  const provinces = useMemo(() => getProvinces(ubigeoRows, department), [ubigeoRows, department])
  const districts = useMemo(() => getDistricts(ubigeoRows, department, province), [ubigeoRows, department, province])

  const prefixOptions = useMemo(() => prefixes.map((p) => ({ value: p.beautyCode, label: `${p.flag} ${p.beautyCode}`, search: p.country })), [prefixes])
  const departmentOptions = useMemo(() => [{ value: '', label: 'Seleccionar' }, ...departments.map((d) => ({ value: d, label: d }))], [departments])
  const provinceOptions = useMemo(() => [{ value: '', label: 'Seleccionar' }, ...provinces.map((p) => ({ value: p, label: p }))], [provinces])
  const districtOptions = useMemo(() => [{ value: '', label: 'Seleccionar' }, ...districts.map((i) => ({ value: i.district, label: i.district }))], [districts])

  useEffect(() => {
    distribuidoresRest.ubigeoOptions().then((data) => {
      if (!Array.isArray(data)) return
      setUbigeoRows(data)
    })
    fetch('/phone_prefixes.json', { headers: { Accept: 'application/json' } })
      .then((r) => r.json())
      .then((data) => setPrefixes(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isModalOpen])

  const updatePoint = React.useCallback((lat, lng, pan = true) => {
    const normalizedLat = formatCoordinate(lat)
    const normalizedLng = formatCoordinate(lng)
    if (!normalizedLat || !normalizedLng) return

    setLatitude(normalizedLat)
    setLongitude(normalizedLng)

    if (!markerRef.current || !mapInstanceRef.current) return
    const nextPosition = { lat: Number(normalizedLat), lng: Number(normalizedLng) }
    markerRef.current.setPosition(nextPosition)
    if (pan) mapInstanceRef.current.panTo(nextPosition)
  }, [])

  const ensureMap = React.useCallback(async (lat, lng) => {
    if (!isModalOpen || !mapRef.current) return
    if (!gmapsApiKey) {
      setMapError('No se encontró la llave de Google Maps en la configuración.')
      return
    }

    try {
      setMapLoading(true)
      setMapError('')
      const maps = await loadGoogleMapsApi(gmapsApiKey)
      const center = { lat, lng }

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new maps.Map(mapRef.current, {
          center,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        })

        markerRef.current = new maps.Marker({
          position: center,
          map: mapInstanceRef.current,
          draggable: true,
          title: 'Ubicación seleccionada',
        })

        mapInstanceRef.current.addListener('click', (event) => {
          updatePoint(event.latLng.lat(), event.latLng.lng())
        })

        markerRef.current.addListener('dragend', (event) => {
          updatePoint(event.latLng.lat(), event.latLng.lng(), false)
        })
      } else {
        mapInstanceRef.current.setCenter(center)
        markerRef.current?.setPosition(center)
      }
    } catch (error) {
      setMapError(error?.message || 'No se pudo inicializar Google Maps.')
    } finally {
      setMapLoading(false)
    }
  }, [gmapsApiKey, isModalOpen, updatePoint])

  useEffect(() => {
    if (!isModalOpen) return

    const fallbackDistrict = districts.find((x) => x.district === district)
    const baseLat = toCoordinate(latitude) ?? toCoordinate(fallbackDistrict?.latitude) ?? DEFAULT_CENTER.lat
    const baseLng = toCoordinate(longitude) ?? toCoordinate(fallbackDistrict?.longitude) ?? DEFAULT_CENTER.lng

    const timer = setTimeout(() => {
      updatePoint(baseLat, baseLng, false)
      ensureMap(baseLat, baseLng)
    }, 180)

    return () => clearTimeout(timer)
  }, [isModalOpen, latitude, longitude, district, districts, updatePoint, ensureMap])

  const resetForm = () => {
    setDataLoaded(null)
    setDepartment('')
    setProvince('')
    setDistrict('')
    setUbigeo('')
    setStatus(true)
    setFeatured(false)
    setPhonePrefix('+51')
    setLatitude('')
    setLongitude('')
    setMapError('')
    setFormError('')
    setIsModalOpen(false)
    if (nameRef.current) nameRef.current.value = ''
    if (phoneRef.current) phoneRef.current.value = ''
    if (businessHoursRef.current) businessHoursRef.current.value = ''
    if (addressRef.current) addressRef.current.value = ''
    if (referenceRef.current) referenceRef.current.value = ''
  }

  const closeForm = () => { if (!loading) resetForm() }

  const setFormValues = (data = null) => {
    setDepartment(data?.department || '')
    setProvince(data?.province || '')
    setDistrict(data?.district || '')
    setUbigeo(data?.ubigeo || '')
    setStatus(data?.status == null ? true : Boolean(data.status))
    setFeatured(Boolean(data?.featured))
    setPhonePrefix(data?.phone_prefix || '+51')
    setLatitude(formatCoordinate(data?.latitude))
    setLongitude(formatCoordinate(data?.longitude))
    if (nameRef.current) nameRef.current.value = data?.name || ''
    if (phoneRef.current) phoneRef.current.value = data?.phone || ''
    if (businessHoursRef.current) businessHoursRef.current.value = data?.business_hours || ''
    if (addressRef.current) addressRef.current.value = data?.address || ''
    if (referenceRef.current) referenceRef.current.value = data?.reference || ''
  }

  const onModalOpen = (data = null) => {
    setDataLoaded(data)
    setFormError('')
    setIsModalOpen(true)
    setTimeout(() => setFormValues(data), 30)
  }

  const askDelete = (row, event) => { if (event) event.stopPropagation(); setConfirmTarget(row) }

  const performDelete = async () => {
    const row = confirmTarget
    if (!row) return
    setDeleting(true)
    const ok = await distribuidoresRest.delete(row.id)
    setDeleting(false)
    if (!ok) return
    setConfirmTarget(null)
    tableRef.current?.reload()
  }

  const onDepartmentChange = (value) => {
    setDepartment(value)
    setProvince('')
    setDistrict('')
    setUbigeo('')
  }

  const onProvinceChange = (value) => {
    setProvince(value)
    setDistrict('')
    setUbigeo('')
  }

  const onDistrictChange = (value) => {
    setDistrict(value)
    const selected = districts.find((x) => x.district === value)
    setUbigeo(selected?.ubigeo || '')

    if (selected?.latitude != null && selected?.longitude != null) {
      const nextLat = Number(selected.latitude)
      const nextLng = Number(selected.longitude)
      updatePoint(nextLat, nextLng)
      ensureMap(nextLat, nextLng)
    }
  }

  const onSaveSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    if (!department || !province || !district || !ubigeo) {
      setFormError('Selecciona departamento, provincia y distrito válidos.')
      return
    }

    if (!latitude || !longitude) {
      setFormError('Selecciona un punto en el mapa para registrar coordenadas.')
      return
    }

    setFormError('')
    setLoading(true)
    const result = await distribuidoresRest.save({
      id: dataLoaded?.id,
      name: nameRef.current.value,
      department,
      province,
      district,
      ubigeo,
      address: addressRef.current.value,
      reference: referenceRef.current.value,
      phone: phoneRef.current.value,
      phone_prefix: phonePrefix,
      business_hours: businessHoursRef.current.value,
      featured,
      latitude: Number(latitude),
      longitude: Number(longitude),
      status,
    })
    setLoading(false)

    if (!result) return
    tableRef.current?.reload()
    resetForm()
  }

  const columns = [
    {
      key: 'name', header: 'Distribuidor', field: 'name', filterFields: ['name', 'address'], nowrap: true,
      render: (d) => (<><span className='fw-semibold d-block'>{d.name || 'Sin nombre'}{d.featured ? <span className='wfd-chip ms-2' style={{ background: '#fff4d6', color: '#854f0b' }}>Destacado</span> : null}</span><small className='text-muted'>{[d.phone_prefix, d.phone].filter(Boolean).join(' ') || 'Sin teléfono'}</small></>),
    },
    { key: 'department', header: 'Departamento', field: 'department', nowrap: true, render: (d) => <span>{d.department}</span> },
    { key: 'province', header: 'Provincia', field: 'province', nowrap: true, render: (d) => <span>{d.province}</span> },
    { key: 'district', header: 'Distrito', field: 'district', nowrap: true, render: (d) => <span>{d.district}</span> },
    { key: 'ubigeo', header: 'Ubigeo', field: 'ubigeo', width: 92, render: (d) => <span className='wfd-chip'>{d.ubigeo || '-'}</span> },
    { key: 'address', header: 'Dirección', field: 'address', render: (d) => <span style={{ color: '#5b6577' }}>{d.address || '-'}</span> },
    {
      key: 'status', header: 'Estado', field: 'status', align: 'center',
      filterOptions: [{ value: '1', label: 'Activo' }, { value: '0', label: 'Inactivo' }],
      render: (d) => (
        <SwitchFormGroup id={`switch-distributor-${d.id}`} checked={Boolean(d.status)} noMargin
          onChange={async () => { await distribuidoresRest.status({ id: d.id, status: d.status }); tableRef.current?.reload() }} />
      ),
    },
    {
      key: 'actions', header: 'Acciones', align: 'center', filterable: false, sortable: false,
      render: (d) => (
        <div className='d-flex align-items-center justify-content-center gap-1'>
          <button className='wfd-act edit' title='Editar' onClick={() => onModalOpen(d)}><i className='mdi mdi-square-edit-outline'></i></button>
          <button className='wfd-act del' title='Eliminar' onClick={(e) => askDelete(d, e)}><i className='mdi mdi-trash-can'></i></button>
        </div>
      ),
    },
  ]

  return (
    <>
      <style>{PLACE_CSS}</style>
      <AdminTable
        ref={tableRef}
        rest={distribuidoresRest}
        title='Lista de distribuidores'
        icon='ti ti-truck-delivery'
        countSuffix='distribuidores'
        defaultSort={[{ selector: 'department', desc: false }]}
        minWidth={1100}
        headerActions={<button type='button' className='wfd-btn' onClick={() => onModalOpen(null)}><i className='mdi mdi-plus'></i> Nuevo distribuidor</button>}
        columns={columns}
      />

      <div className='wfd-modal-ovl' style={{ display: isModalOpen ? 'flex' : 'none' }} onMouseDown={closeForm}>
        <div className='wfd-modal' onMouseDown={(e) => e.stopPropagation()}>
          <form onSubmit={onSaveSubmit}>
            <div className='wfd-modal-head'>
              <h3 className='wfd-h2' style={{ fontSize: 16 }}>
                <i className={`mdi ${dataLoaded ? 'mdi-square-edit-outline' : 'mdi-plus-box'} me-1`} style={{ color: '#004991' }}></i>
                {dataLoaded ? 'Editar distribuidor' : 'Nuevo distribuidor'}
              </h3>
              <button type='button' className='wfd-close' onClick={closeForm}><i className='mdi mdi-close'></i></button>
            </div>

            <div className='wfd-modal-body'>
              {formError && <div className='wfd-err'><i className='mdi mdi-alert-circle-outline'></i>{formError}</div>}

              <div className='wfd-sec'>
                <h4><i className='mdi mdi-store me-1' style={{ color: '#004991' }}></i>Datos del distribuidor</h4>
                <div className='row'>
                  <InputFormGroup col='col-md-5' eRef={nameRef} label='Nombre comercial' placeholder='Ej. Comercial Marsano' />
                  <div className='form-group col-md-4 mb-2'>
                    <label className='form-label'>Teléfono</label>
                    <div className='d-flex gap-2'>
                      <div style={{ width: 118, flexShrink: 0 }}>
                        <CustomDropdown value={phonePrefix} options={prefixOptions} onChange={setPhonePrefix} placeholder='+51' menuWidth={260} searchable />
                      </div>
                      <input ref={phoneRef} className='form-control' placeholder='000 000 000' />
                    </div>
                  </div>
                  <InputFormGroup col='col-md-3' eRef={businessHoursRef} label='Horario' placeholder='Lun - Sáb: 08:00 - 19:00' />
                  <div className='col-md-12 mt-1'>
                    <label className='form-label d-block'>Destacado</label>
                    <button type='button' className='wfd-tg' onClick={() => setFeatured((v) => !v)}>
                      <span className={`wfd-tg-track ${featured ? 'on' : ''}`}><span className='wfd-tg-knob'></span></span>
                      <span className='wfd-tg-txt'>{featured ? 'Sí, aparece primero en la web' : 'No destacado'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className='wfd-sec'>
                <h4><i className='mdi mdi-map-marker me-1' style={{ color: '#004991' }}></i>Ubicación</h4>
                <div className='row'>
                  <FieldSelect label='Departamento' required value={department} options={departmentOptions} onChange={onDepartmentChange} />
                  <FieldSelect label='Provincia' required value={province} options={provinceOptions} onChange={onProvinceChange} />
                  <FieldSelect label='Distrito' required value={district} options={districtOptions} onChange={onDistrictChange} />

                  <ReadOnlyField col='col-md-4' label='Ubigeo' value={ubigeo} />
                  <InputFormGroup col='col-md-8' eRef={addressRef} label='Dirección' required />
                  <InputFormGroup col='col-md-12' eRef={referenceRef} label='Referencia' />
                </div>
              </div>

              <div className='wfd-sec'>
                <h4><i className='mdi mdi-google-maps me-1' style={{ color: '#004991' }}></i>Ubicación en mapa <b className='text-danger ms-1'>*</b></h4>
                <div className='border rounded position-relative overflow-hidden' style={{ minHeight: 320 }}>
                  {!mapError && <div ref={mapRef} style={{ width: '100%', height: 320 }}></div>}
                  {mapLoading && (
                    <div className='position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75'>
                      <span className='text-muted'>Cargando mapa...</span>
                    </div>
                  )}
                  {mapError && (
                    <div className='d-flex align-items-center justify-content-center p-3 text-center text-danger' style={{ minHeight: 320 }}>
                      {mapError}
                    </div>
                  )}
                </div>
                <small className='text-muted'>Haz clic en el mapa o arrastra el marcador para establecer latitud y longitud.</small>
                <div className='row mt-2'>
                  <ReadOnlyField col='col-md-3' label='Latitud' value={latitude} />
                  <ReadOnlyField col='col-md-3' label='Longitud' value={longitude} />
                </div>
              </div>
            </div>

            <div className='wfd-modal-foot'>
              <button type='button' className='wfd-btn outline foot' onClick={closeForm} disabled={loading}>Cancelar</button>
              <button type='submit' className='wfd-btn foot' disabled={loading}>
                {loading
                  ? <><span className='spinner-border spinner-border-sm'></span> Guardando...</>
                  : <><i className='mdi mdi-content-save'></i> {dataLoaded ? 'Guardar cambios' : 'Crear distribuidor'}</>}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        open={!!confirmTarget}
        title='Eliminar distribuidor'
        message={confirmTarget ? `Se eliminará el distribuidor de ${confirmTarget.district || confirmTarget.address || `#${confirmTarget.id}`}. Esta acción no se puede deshacer.` : ''}
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
    <Adminto {...properties} title='Distribuidores'>
      <Distributors {...properties} />
    </Adminto>
  )
})
