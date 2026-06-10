import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useState } from 'react'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'
import AboutRest from '../Actions/Admin/AboutRest.js'

const aboutRest = new AboutRest()
const PUBLIC_STORAGE = '/storage/'
const MAX_IMAGE_SIZE = 4 * 1024 * 1024
const MAX_CERT_PDF_SIZE = 50 * 1024 * 1024

const createCertification = () => ({
  title: '',
  description: '',
  image_path: '',
  file_path: '',
  file_delete: false,
  image_file: null,
  file_file: null,
  image_preview: '',
  file_label: '',
})

const normalizeCertifications = (items) => {
  const list = Array.isArray(items) ? items.slice(0, 3) : []
  while (list.length < 3) list.push(createCertification())

  return list.map((item) => ({
    ...createCertification(),
    ...item,
    image_preview: item?.image_url || (item?.image_path ? `${PUBLIC_STORAGE}${item.image_path}` : ''),
    file_label: item?.file_path ? item.file_path.split('/').pop() : '',
    file_delete: false,
  }))
}

const getFamilyImagePreview = (about) => about?.family_image_url || (about?.family_image ? `${PUBLIC_STORAGE}${about.family_image}` : '')
const getPolicyImagePreview = (about) => about?.policy_image_url || (about?.policy_image ? `${PUBLIC_STORAGE}${about.policy_image}` : '')

const About = ({ about: initialAbout = {} }) => {
  const initialForm = useMemo(() => ({
    ...initialAbout,
    family_image: initialAbout.family_image || '',
    family_image_file: null,
    family_image_preview: getFamilyImagePreview(initialAbout),
    policy_image: initialAbout.policy_image || '',
    policy_image_file: null,
    policy_image_preview: getPolicyImagePreview(initialAbout),
    family_values: Array.isArray(initialAbout.family_values) && initialAbout.family_values.length
      ? initialAbout.family_values
      : ['Integridad', 'Respeto', 'Responsabilidad', 'Puntualidad', 'Compromiso', 'Confianza', 'Perseverancia'],
    policy_bullets: Array.isArray(initialAbout.policy_bullets) && initialAbout.policy_bullets.length
      ? initialAbout.policy_bullets
      : [],
    certifications: normalizeCertifications(initialAbout.certifications),
  }), [initialAbout])

  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('family')
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    setForm(initialForm)
  }, [initialForm])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const showAlert = (message, type = 'danger') => {
    setAlert({ message, type })
  }

  const validateFile = (file, maxSize, label) => {
    if (file.size > maxSize) {
      showAlert(`${label} supera el tamaño permitido. El máximo es ${Math.round(maxSize / (1024 * 1024))} MB.`)
      return false
    }

    setAlert(null)
    return true
  }

  const updateListItem = (section, index, value) => {
    setForm((current) => {
      const next = [...(current[section] ?? [])]
      next[index] = value
      return { ...current, [section]: next }
    })
  }

  const updateCertification = (index, field, value) => {
    setForm((current) => {
      const next = [...(current.certifications ?? [])]
      next[index] = { ...next[index], [field]: value }
      return { ...current, certifications: next }
    })
  }

  const addValue = (section, factory) => {
    setForm((current) => ({ ...current, [section]: [...(current[section] ?? []), factory()] }))
  }

  const removeValue = (section, index, minimum, factory) => {
    setForm((current) => {
      const next = [...(current[section] ?? [])]
      if (next.length <= minimum) return current
      next.splice(index, 1)
      while (next.length < minimum) next.push(factory())
      return { ...current, [section]: next }
    })
  }

  const onFamilyImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!validateFile(file, MAX_IMAGE_SIZE, 'La imagen de Familia')) {
      event.target.value = ''
      return
    }

    setForm((current) => ({
      ...current,
      family_image_file: file,
      family_image_preview: URL.createObjectURL(file),
    }))
  }

  const onPolicyImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!validateFile(file, MAX_IMAGE_SIZE, 'La imagen de Política')) {
      event.target.value = ''
      return
    }

    setForm((current) => ({
      ...current,
      policy_image_file: file,
      policy_image_preview: URL.createObjectURL(file),
    }))
  }

  const onCertificationImageChange = (index, event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!validateFile(file, MAX_IMAGE_SIZE, `La imagen de la certificación ${index + 1}`)) {
      event.target.value = ''
      return
    }

    updateCertification(index, 'image_file', file)
    updateCertification(index, 'image_preview', URL.createObjectURL(file))
  }

  const onCertificationPdfChange = (index, event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!validateFile(file, MAX_CERT_PDF_SIZE, `El PDF de la certificación ${index + 1}`)) {
      event.target.value = ''
      return
    }

    updateCertification(index, 'file_file', file)
    updateCertification(index, 'file_label', file.name)
    updateCertification(index, 'file_delete', false)
  }

  const clearCertificationPdf = (index) => {
    updateCertification(index, 'file_path', '')
    updateCertification(index, 'file_file', null)
    updateCertification(index, 'file_label', '')
    updateCertification(index, 'file_delete', true)
  }

  const save = async () => {
    if (saving) return
    setSaving(true)
    setAlert(null)

    const previousForm = form
    const result = await aboutRest.save(form)
    if (result?.data) {
      const certifications = normalizeCertifications(result.data.certifications)

      certifications.forEach((certification, index) => {
        const previousCertification = previousForm.certifications?.[index] ?? {}
        if (previousCertification.image_file instanceof File && previousCertification.image_preview) {
          certification.image_preview = previousCertification.image_preview
        }
        if (previousCertification.file_file instanceof File && previousCertification.file_label) {
          certification.file_label = previousCertification.file_label
        }
      })

      setForm({
        ...result.data,
        family_image: result.data.family_image || '',
        family_image_file: null,
        family_image_preview:
          previousForm.family_image_file instanceof File && previousForm.family_image_preview
            ? previousForm.family_image_preview
            : getFamilyImagePreview(result.data),
        policy_image: result.data.policy_image || '',
        policy_image_file: null,
        policy_image_preview:
          previousForm.policy_image_file instanceof File && previousForm.policy_image_preview
            ? previousForm.policy_image_preview
            : getPolicyImagePreview(result.data),
        family_values: Array.isArray(result.data.family_values) ? result.data.family_values : [],
        policy_bullets: Array.isArray(result.data.policy_bullets) ? result.data.policy_bullets : [],
        certifications,
      })
    }

    setSaving(false)
  }

  return (
    <div className='row g-3'>
      <div className='col-12'>
        <div className='card border-0 shadow-sm'>
          <div className='card-body d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-lg-center'>
            <div>
              <h4 className='mb-1'>Modulo Nosotros</h4>
              <p className='text-muted mb-0'>
                Edita Familia, Mision, Vision, Valores, Politica y sus archivos adjuntos reales.
              </p>
            </div>
            <div className='d-flex gap-2'>
              <a href='/family' target='_blank' rel='noreferrer' className='btn btn-soft-primary'>
                Ver pagina publica
              </a>
              <button type='button' className='btn btn-primary' onClick={save} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
          {alert?.message ? (
            <div className='card-footer border-0 pt-0'>
              <div className={`alert alert-${alert.type || 'danger'} mb-0`} role='alert'>
                {alert.message}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className='col-12'>
        <div className='card border-0 shadow-sm'>
          <div className='card-body'>
            <div className='d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-lg-center mb-3'>
              <div>
                <h5 className='mb-1'>Organizacion del modulo</h5>
                <p className='text-muted mb-0'>
                  El contenido esta dividido en dos partes para editarlo con mas orden: Familia y Politica.
                </p>
              </div>
              <div className='btn-group' role='tablist' aria-label='Secciones de Nosotros'>
                <button
                  type='button'
                  className={`btn ${activeSection === 'family' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveSection('family')}
                >
                  Familia
                </button>
                <button
                  type='button'
                  className={`btn ${activeSection === 'policy' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveSection('policy')}
                >
                  Politica
                </button>
              </div>
            </div>
            <div className='alert alert-light border mb-0'>
              Estás editando la seccion <strong>{activeSection === 'family' ? 'Familia' : 'Politica'}</strong>. Los cambios se guardan en un solo clic para ambas partes del modulo.
            </div>
          </div>
        </div>
      </div>

      {activeSection === 'family' ? (
        <>
          <div className='col-12'>
            <div className='card border-0 shadow-sm'>
              <div className='card-body'>
                <h5 className='mb-3'>Imagen principal de Familia</h5>
                <div className='row g-3 align-items-start'>
                  <div className='col-lg-7'>
                    <div className='rounded-3 border bg-light p-3'>
                      <img
                        src={form.family_image_preview || '/assets/img/landing/bg-main.png'}
                        alt='Imagen principal de Nosotros'
                        className='w-100 rounded-3 object-fit-cover'
                        style={{ aspectRatio: '16/10', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                  <div className='col-lg-5'>
                <label className='form-label'>Cambiar imagen</label>
                <input type='file' className='form-control' accept='image/*' onChange={onFamilyImageChange} />
                <input type='hidden' value={form.family_image || ''} readOnly />
                <small className='text-muted d-block mt-2'>
                  Sube una imagen horizontal. Tamaño máximo: 4 MB.
                </small>
              </div>
                </div>
              </div>
            </div>
          </div>

          <div className='col-12'>
            <div className='card border-0 shadow-sm'>
              <div className='card-body'>
                <h5 className='mb-3'>Familia e historia</h5>
                <div className='row g-3'>
                  <div className='col-md-4'>
                    <label className='form-label'>Etiqueta</label>
                    <input className='form-control' value={form.family_eyebrow || ''} onChange={(event) => updateField('family_eyebrow', event.target.value)} />
                  </div>
                  <div className='col-md-8'>
                    <label className='form-label'>Titulo</label>
                    <input className='form-control' value={form.family_title || ''} onChange={(event) => updateField('family_title', event.target.value)} />
                  </div>
                  <div className='col-12'>
                    <label className='form-label'>Texto principal</label>
                    <textarea className='form-control' rows='3' value={form.family_lead || ''} onChange={(event) => updateField('family_lead', event.target.value)} />
                  </div>
                  <div className='col-12'>
                    <label className='form-label'>Primer parrafo</label>
                    <textarea className='form-control' rows='3' value={form.family_paragraph_1 || ''} onChange={(event) => updateField('family_paragraph_1', event.target.value)} />
                  </div>
                  <div className='col-12'>
                    <label className='form-label'>Segundo parrafo</label>
                    <textarea className='form-control' rows='3' value={form.family_paragraph_2 || ''} onChange={(event) => updateField('family_paragraph_2', event.target.value)} />
                  </div>
                  <div className='col-md-4'>
                    <label className='form-label'>Dato destacado</label>
                    <input className='form-control' value={form.family_metric_value || ''} onChange={(event) => updateField('family_metric_value', event.target.value)} />
                  </div>
                  <div className='col-md-8'>
                    <label className='form-label'>Texto del dato</label>
                    <input className='form-control' value={form.family_metric_label || ''} onChange={(event) => updateField('family_metric_label', event.target.value)} />
                  </div>
                  <div className='col-md-6'>
                    <label className='form-label'>Bloque 1 titulo</label>
                    <input className='form-control' value={form.family_aside_1_title || ''} onChange={(event) => updateField('family_aside_1_title', event.target.value)} />
                  </div>
                  <div className='col-md-6'>
                    <label className='form-label'>Bloque 1 texto</label>
                    <input className='form-control' value={form.family_aside_1_text || ''} onChange={(event) => updateField('family_aside_1_text', event.target.value)} />
                  </div>
                  <div className='col-md-6'>
                    <label className='form-label'>Bloque 2 titulo</label>
                    <input className='form-control' value={form.family_aside_2_title || ''} onChange={(event) => updateField('family_aside_2_title', event.target.value)} />
                  </div>
                  <div className='col-md-6'>
                    <label className='form-label'>Bloque 2 texto</label>
                    <input className='form-control' value={form.family_aside_2_text || ''} onChange={(event) => updateField('family_aside_2_text', event.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='col-12'>
            <div className='card border-0 shadow-sm'>
              <div className='card-body'>
                <h5 className='mb-3'>Mision y vision</h5>
                <div className='row g-3'>
                  <div className='col-md-4'>
                    <label className='form-label'>Etiqueta mision</label>
                    <input className='form-control' value={form.mission_eyebrow || ''} onChange={(event) => updateField('mission_eyebrow', event.target.value)} />
                  </div>
                  <div className='col-md-8'>
                    <label className='form-label'>Titulo mision</label>
                    <input className='form-control' value={form.mission_title || ''} onChange={(event) => updateField('mission_title', event.target.value)} />
                  </div>
                  <div className='col-12'>
                    <label className='form-label'>Texto mision</label>
                    <textarea className='form-control' rows='3' value={form.mission_text || ''} onChange={(event) => updateField('mission_text', event.target.value)} />
                  </div>
                  <div className='col-md-4'>
                    <label className='form-label'>Etiqueta vision</label>
                    <input className='form-control' value={form.vision_eyebrow || ''} onChange={(event) => updateField('vision_eyebrow', event.target.value)} />
                  </div>
                  <div className='col-md-8'>
                    <label className='form-label'>Titulo vision</label>
                    <input className='form-control' value={form.vision_title || ''} onChange={(event) => updateField('vision_title', event.target.value)} />
                  </div>
                  <div className='col-12'>
                    <label className='form-label'>Texto vision</label>
                    <textarea className='form-control' rows='3' value={form.vision_text || ''} onChange={(event) => updateField('vision_text', event.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='col-12'>
            <div className='card border-0 shadow-sm'>
              <div className='card-body'>
                <div className='d-flex align-items-center justify-content-between gap-3 mb-3'>
                  <h5 className='mb-0'>Valores</h5>
                  <button type='button' className='btn btn-soft-primary btn-sm' onClick={() => addValue('family_values', () => '')}>
                    Agregar valor
                  </button>
                </div>
                <div className='row g-2'>
                  {form.family_values.map((item, index) => (
                    <div className='col-md-6 col-lg-4' key={`family-value-${index}`}>
                      <div className='input-group'>
                        <input className='form-control' value={item} onChange={(event) => updateListItem('family_values', index, event.target.value)} />
                        <button type='button' className='btn btn-outline-danger' onClick={() => removeValue('family_values', index, 3, () => '')}>
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='col-12'>
            <div className='card border-0 shadow-sm'>
              <div className='card-body'>
                <h5 className='mb-3'>Imagen principal de Politica</h5>
                <div className='row g-3 align-items-start'>
                  <div className='col-lg-7'>
                    <div className='rounded-3 border bg-light p-3'>
                      <img
                        src={form.policy_image_preview || '/assets/img/landing/bg-main.png'}
                        alt='Imagen principal de Politica'
                        className='w-100 rounded-3 object-fit-cover'
                        style={{ aspectRatio: '16/10', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                  <div className='col-lg-5'>
                <label className='form-label'>Cambiar imagen</label>
                <input type='file' className='form-control' accept='image/*' onChange={onPolicyImageChange} />
                <input type='hidden' value={form.policy_image || ''} readOnly />
                <small className='text-muted d-block mt-2'>
                  Sube una imagen horizontal. Tamaño máximo: 4 MB.
                </small>
              </div>
                </div>
              </div>
            </div>
          </div>

          <div className='col-12'>
            <div className='card border-0 shadow-sm'>
              <div className='card-body'>
                <h5 className='mb-3'>Politica y certificaciones</h5>
                <div className='row g-3'>
                  <div className='col-md-4'>
                    <label className='form-label'>Etiqueta</label>
                    <input className='form-control' value={form.policy_eyebrow || ''} onChange={(event) => updateField('policy_eyebrow', event.target.value)} />
                  </div>
                  <div className='col-md-8'>
                    <label className='form-label'>Titulo</label>
                    <input className='form-control' value={form.policy_title || ''} onChange={(event) => updateField('policy_title', event.target.value)} />
                  </div>
                  <div className='col-md-4'>
                    <label className='form-label'>Etiqueta de alcance</label>
                    <input className='form-control' value={form.policy_scope_eyebrow || ''} onChange={(event) => updateField('policy_scope_eyebrow', event.target.value)} />
                  </div>
                  <div className='col-md-8'>
                    <label className='form-label'>Titulo de alcance</label>
                    <input className='form-control' value={form.policy_scope_title || ''} onChange={(event) => updateField('policy_scope_title', event.target.value)} />
                  </div>
                  <div className='col-12'>
                    <label className='form-label'>Parrafo de alcance 1</label>
                    <textarea className='form-control' rows='3' value={form.policy_scope_paragraph_1 || ''} onChange={(event) => updateField('policy_scope_paragraph_1', event.target.value)} />
                  </div>
                  <div className='col-12'>
                    <label className='form-label'>Parrafo de alcance 2</label>
                    <textarea className='form-control' rows='3' value={form.policy_scope_paragraph_2 || ''} onChange={(event) => updateField('policy_scope_paragraph_2', event.target.value)} />
                  </div>
                  <div className='col-12'>
                    <label className='form-label'>Texto de compromiso</label>
                    <input className='form-control' value={form.policy_commitment_text || ''} onChange={(event) => updateField('policy_commitment_text', event.target.value)} />
                  </div>
                  <div className='col-12'>
                    <label className='form-label'>Descripcion</label>
                    <textarea className='form-control' rows='4' value={form.policy_description || ''} onChange={(event) => updateField('policy_description', event.target.value)} />
                  </div>
                  <div className='col-12'>
                    <label className='form-label'>Titulo de certificaciones</label>
                    <input className='form-control' value={form.policy_certifications_title || ''} onChange={(event) => updateField('policy_certifications_title', event.target.value)} />
                  </div>
                </div>

                <hr className='my-4' />

                <div className='d-flex align-items-center justify-content-between gap-3 mb-3'>
                  <h6 className='mb-0'>Puntos de politica</h6>
                  <button type='button' className='btn btn-soft-primary btn-sm' onClick={() => addValue('policy_bullets', () => '')}>
                    Agregar punto
                  </button>
                </div>
                <div className='row g-2'>
                  {form.policy_bullets.map((item, index) => (
                    <div className='col-12' key={`policy-bullet-${index}`}>
                      <div className='input-group'>
                        <input className='form-control' value={item} onChange={(event) => updateListItem('policy_bullets', index, event.target.value)} />
                        <button type='button' className='btn btn-outline-danger' onClick={() => removeValue('policy_bullets', index, 1, () => '')}>
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className='my-4' />

                <div className='row g-3'>
                  {form.certifications.map((item, index) => (
                    <div className='col-lg-4' key={`cert-${index}`}>
                      <div className='border rounded p-3 h-100'>
                        <div className='mb-3 fw-semibold'>Certificacion {index + 1}</div>
                        <div className='mb-3'>
                          <label className='form-label'>Titulo</label>
                          <input className='form-control' value={item.title || ''} onChange={(event) => updateCertification(index, 'title', event.target.value)} />
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>Descripcion</label>
                          <textarea className='form-control' rows='3' value={item.description || ''} onChange={(event) => updateCertification(index, 'description', event.target.value)} />
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>Imagen del certificado</label>
                          <div className='mb-2 rounded border bg-light p-2'>
                            <img
                              src={item.image_preview || '/assets/img/landing/bg-main.png'}
                              alt={item.title || `Certificacion ${index + 1}`}
                              className='w-100 rounded'
                              style={{ aspectRatio: '4/3', objectFit: 'contain', background: '#fff' }}
                            />
                          </div>
                      <input type='file' className='form-control' accept='image/*' onChange={(event) => onCertificationImageChange(index, event)} />
                      <small className='text-muted d-block mt-2'>Tamaño máximo: 4 MB.</small>
                    </div>
                    <div>
                      <label className='form-label'>PDF del certificado</label>
                      <input type='file' className='form-control mb-2' accept='application/pdf' onChange={(event) => onCertificationPdfChange(index, event)} />
                      <small className='text-muted d-block mb-2'>Tamaño máximo: 50 MB.</small>
                      <div className='mb-2'>
                        <button
                          type='button'
                          className='btn btn-outline-danger btn-sm'
                          onClick={() => clearCertificationPdf(index)}
                          disabled={!item.file_path && !item.file_file}
                        >
                          Eliminar PDF
                        </button>
                      </div>
                      {item.file_path ? (
                        <a href={`/storage/${item.file_path}`} target='_blank' rel='noreferrer' className='small text-primary text-decoration-underline'>
                          {item.file_label || 'Ver PDF actual'}
                            </a>
                          ) : (
                            <small className='text-muted'>Todavia no hay PDF cargado.</small>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Adminto {...properties} title='Nosotros'>
      <About about={properties.about} />
    </Adminto>
  )
})
