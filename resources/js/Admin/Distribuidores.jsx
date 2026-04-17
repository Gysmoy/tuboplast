import React, { useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import ReactAppend from '../Utils/ReactAppend.jsx'
import Adminto from '../Components/Adminto.jsx'
import Modal from '../Components/Modal.jsx'
import Table from '../Components/Table.jsx'
import InputFormGroup from '../Components/Form/InputFormGroup.jsx'
import SelectFormGroup from '../Components/Form/SelectFormGroup.jsx'
import SwitchFormGroup from '../Components/Form/SwitchFormGroup.jsx'
import TippyButton from '../Components/Form/TippyButton.jsx'
import DistribuidoresRest from '../Actions/Admin/DistribuidoresRest.js'
import { getDepartments, getDistricts, getProvinces } from '../Utils/ubigeo.js'
import { loadGoogleMapsApi } from '../Utils/googleMaps.js'

const distribuidoresRest = new DistribuidoresRest()
const DEFAULT_CENTER = { lat: -12.046374, lng: -77.042793 }

const toCoordinate = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const formatCoordinate = (value) => {
  const parsed = toCoordinate(value)
  return parsed == null ? '' : parsed.toFixed(6)
}

const Distribuidores = ({ gmapsApiKey }) => {
  const gridRef = useRef()
  const modalRef = useRef()
  const mapRef = useRef()
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)
  const departmentRef = useRef()
  const provinceRef = useRef()
  const districtRef = useRef()
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
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mapLoading, setMapLoading] = useState(false)
  const [mapError, setMapError] = useState('')

  const departments = useMemo(() => getDepartments(ubigeoRows), [ubigeoRows])
  const provinces = useMemo(() => getProvinces(ubigeoRows, department), [ubigeoRows, department])
  const districts = useMemo(() => getDistricts(ubigeoRows, department, province), [ubigeoRows, department, province])

  const refreshGrid = () => $(gridRef.current).dxDataGrid('instance').refresh()

  React.useEffect(() => {
    distribuidoresRest.ubigeoOptions().then((data) => {
      if (!Array.isArray(data)) return
      setUbigeoRows(data)
    })
  }, [])

  React.useEffect(() => {
    if (departmentRef.current && departmentRef.current.value !== department) {
      $(departmentRef.current).val(department).trigger('change.select2')
    }
  }, [department])

  React.useEffect(() => {
    if (provinceRef.current && provinceRef.current.value !== province) {
      $(provinceRef.current).val(province).trigger('change.select2')
    }
  }, [province, provinces])

  React.useEffect(() => {
    if (districtRef.current && districtRef.current.value !== district) {
      $(districtRef.current).val(district).trigger('change.select2')
    }
  }, [district, districts])

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
      setMapError('No se encontro la llave de Google Maps en la configuracion.')
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
          title: 'Ubicacion seleccionada',
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

  React.useEffect(() => {
    if (!isModalOpen) return

    const fallbackDistrict = districts.find(x => x.district === district)
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
    setLatitude('')
    setLongitude('')
    setMapError('')
    setIsModalOpen(false)
    if (addressRef.current) addressRef.current.value = ''
    if (referenceRef.current) referenceRef.current.value = ''
  }

  const setFormValues = (data = null) => {
    setDepartment(data?.department || '')
    setProvince(data?.province || '')
    setDistrict(data?.district || '')
    setUbigeo(data?.ubigeo || '')
    setStatus(data?.status == null ? true : Boolean(data.status))
    setLatitude(formatCoordinate(data?.latitude))
    setLongitude(formatCoordinate(data?.longitude))
    if (addressRef.current) addressRef.current.value = data?.address || ''
    if (referenceRef.current) referenceRef.current.value = data?.reference || ''
  }

  const onModalOpen = (data = null) => {
    setDataLoaded(data)
    setIsModalOpen(true)
    $(modalRef.current).modal('show')
    setTimeout(() => setFormValues(data), 50)
  }

  const onDeleteClicked = async (id) => {
    const ok = await distribuidoresRest.delete(id)
    if (!ok) return
    refreshGrid()
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
    const selected = districts.find(x => x.district === value)
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
      alert('Selecciona departamento, provincia y distrito validos.')
      return
    }

    if (!latitude || !longitude) {
      alert('Selecciona un punto en el mapa para registrar coordenadas.')
      return
    }

    setLoading(true)
    const result = await distribuidoresRest.save({
      id: dataLoaded?.id,
      department,
      province,
      district,
      ubigeo,
      address: addressRef.current.value,
      reference: referenceRef.current.value,
      latitude: Number(latitude),
      longitude: Number(longitude),
      status,
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
        title='Distribuidores'
        rest={distribuidoresRest}
        toolBar={(container) => {
          container.unshift({
            widget: 'dxButton',
            location: 'after',
            options: {
              icon: 'plus',
              hint: 'Nuevo distribuidor',
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
          { dataField: 'department', caption: 'Departamento', width: 160 },
          { dataField: 'province', caption: 'Provincia', width: 160 },
          { dataField: 'district', caption: 'Distrito', width: 160 },
          { dataField: 'ubigeo', caption: 'Ubigeo', width: 100 },
          { dataField: 'address', caption: 'Direccion', minWidth: 260 },
          { dataField: 'reference', caption: 'Referencia', minWidth: 220 },
          {
            caption: 'Coordenadas',
            minWidth: 210,
            allowFiltering: false,
            cellTemplate: (container, { data }) => {
              ReactAppend(container, <span>{data.latitude ?? '-'}, {data.longitude ?? '-'}</span>)
            }
          },
          {
            dataField: 'status',
            caption: 'Estado',
            width: 100,
            allowFiltering: false,
            cellTemplate: (container, { data }) => {
              ReactAppend(container,
                <SwitchFormGroup
                  id={`switch-distributor-${data.id}`}
                  checked={Boolean(data.status)}
                  noMargin
                  onChange={async () => {
                    await distribuidoresRest.status({ id: data.id, status: data.status })
                    refreshGrid()
                  }}
                />
              )
            }
          },
          {
            caption: 'Acciones',
            width: 120,
            cellTemplate: (container, { data }) => {
              container.attr('style', 'display: flex; gap: 4px; overflow: unset')
              ReactAppend(container, <TippyButton className='btn btn-sm btn-soft-primary' title='Editar' onClick={() => onModalOpen(data)}>
                <i className='mdi mdi-square-edit-outline'></i>
              </TippyButton>)
              ReactAppend(container, <TippyButton className='btn btn-sm btn-soft-danger' title='Eliminar' onClick={() => onDeleteClicked(data.id)}>
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
        title={dataLoaded ? 'Editar distribuidor' : 'Nuevo distribuidor'}
        onClose={resetForm}
        onSubmit={onSaveSubmit}
        loading={loading}
        size='lg'
      >
        <div className='row'>
          <SelectFormGroup
            col='col-md-4'
            label='Departamento'
            required
            eRef={departmentRef}
            dropdownParent={modalRef.current}
            onChange={(e) => onDepartmentChange(e.target.value)}
          >
            <option value=''>Seleccionar</option>
            {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
          </SelectFormGroup>
          <SelectFormGroup
            col='col-md-4'
            label='Provincia'
            required
            eRef={provinceRef}
            dropdownParent={modalRef.current}
            onChange={(e) => onProvinceChange(e.target.value)}
          >
            <option value=''>Seleccionar</option>
            {provinces.map(prov => <option key={prov} value={prov}>{prov}</option>)}
          </SelectFormGroup>
          <SelectFormGroup
            col='col-md-4'
            label='Distrito'
            required
            eRef={districtRef}
            dropdownParent={modalRef.current}
            onChange={(e) => onDistrictChange(e.target.value)}
          >
            <option value=''>Seleccionar</option>
            {districts.map(item => <option key={item.ubigeo} value={item.district}>{item.district}</option>)}
          </SelectFormGroup>

          <InputFormGroup col='col-md-4' label='Ubigeo' value={ubigeo} disabled />
          <InputFormGroup col='col-md-8' eRef={addressRef} label='Direccion' required />
          <InputFormGroup col='col-md-6' eRef={referenceRef} label='Referencia' />

          <div className='col-12 mb-2'>
            <label className='form-label'>Ubicacion en mapa <b className='text-danger'>*</b></label>
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
          </div>

          <InputFormGroup col='col-md-3' label='Latitud' value={latitude} disabled />
          <InputFormGroup col='col-md-3' label='Longitud' value={longitude} disabled />

        </div>
      </Modal>
    </>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Adminto {...properties} title='Distribuidores'>
      <Distribuidores {...properties} />
    </Adminto>
  )
})
