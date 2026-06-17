import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useState } from 'react'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'
import AboutRest from '../Actions/Admin/AboutRest.js'

const aboutRest = new AboutRest()
const PUBLIC_STORAGE = '/storage/'
const MAX_IMAGE_SIZE = 4 * 1024 * 1024
const MAX_CERT_PDF_SIZE = 50 * 1024 * 1024
const IMAGE_FALLBACK = '/assets/img/landing/bg-main.png'

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

// ----------------------------------------------------------------- UI helpers
const SectionCard = ({ title, subtitle, icon, actions, children, col = 'col-12' }) => (
  <div className={col}>
    <div className='card border-0 shadow-sm h-100'>
      <div className='card-body'>
        <div className='d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-3'>
          <div className='d-flex align-items-center gap-2'>
            {icon && (
              <span className='d-inline-flex align-items-center justify-content-center rounded-2 bg-primary-subtle text-primary' style={{ width: 38, height: 38 }}>
                <i className={`mdi ${icon} fs-20`}></i>
              </span>
            )}
            <div>
              <h5 className='mb-0'>{title}</h5>
              {subtitle && <small className='text-muted'>{subtitle}</small>}
            </div>
          </div>
          {actions}
        </div>
        {children}
      </div>
    </div>
  </div>
)

const FormField = ({ label, value, onChange, col = 'col-12', type = 'text', placeholder = '', textarea = false, rows = 3 }) => (
  <div className={col}>
    <label className='form-label small fw-semibold'>{label}</label>
    {textarea ? (
      <textarea className='form-control' rows={rows} value={value || ''} placeholder={placeholder} onChange={onChange} />
    ) : (
      <input type={type} className='form-control' value={value || ''} placeholder={placeholder} onChange={onChange} />
    )}
  </div>
)

const SubHeading = ({ children }) => (
  <div className='col-12'>
    <p className='mb-0 mt-2 text-uppercase fw-bold text-muted' style={{ fontSize: 11, letterSpacing: '0.06em' }}>{children}</p>
    <hr className='mt-1 mb-0' />
  </div>
)

const MediaUploader = ({ preview, onChange, hint }) => (
  <div className='row g-3 align-items-center'>
    <div className='col-lg-7'>
      <div className='rounded-3 overflow-hidden border bg-light'>
        <img src={preview || IMAGE_FALLBACK} alt='Vista previa' className='w-100 d-block' style={{ aspectRatio: '16/10', objectFit: 'cover' }} />
      </div>
    </div>
    <div className='col-lg-5'>
      <label className='form-label small fw-semibold'>Cambiar imagen</label>
      <input type='file' className='form-control' accept='image/*' onChange={onChange} />
      <small className='text-muted d-block mt-2'>{hint}</small>
    </div>
  </div>
)

const RepeaterTable = ({ items, columnLabel, placeholder, minimum, onChange, onRemove, onAdd, addLabel }) => (
  <>
    <div className='table-responsive'>
      <table className='table table-sm align-middle mb-0'>
        <thead>
          <tr className='text-muted' style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <th style={{ width: 52 }}>#</th>
            <th>{columnLabel}</th>
            <th style={{ width: 64 }} className='text-end'></th>
          </tr>
        </thead>
        <tbody>
          {items.length ? items.map((item, index) => (
            <tr key={index}>
              <td className='text-muted'>{index + 1}</td>
              <td>
                <input
                  className='form-control form-control-sm'
                  value={item}
                  placeholder={placeholder}
                  onChange={(event) => onChange(index, event.target.value)}
                />
              </td>
              <td className='text-end'>
                <button type='button' className='btn btn-sm btn-soft-danger' title='Quitar' disabled={items.length <= minimum} onClick={() => onRemove(index)}>
                  <i className='mdi mdi-trash-can'></i>
                </button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan={3} className='text-center text-muted py-3'>Sin elementos todavía</td></tr>
          )}
        </tbody>
      </table>
    </div>
    <button type='button' className='btn btn-soft-primary btn-sm mt-3' onClick={onAdd}>
      <i className='mdi mdi-plus me-1'></i>{addLabel}
    </button>
  </>
)

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

  const isFamily = activeSection === 'family'

  return (
    <div className='row g-3'>
      {/* Toolbar */}
      <div className='col-12'>
        <div className='card border-0 shadow-sm'>
          <div className='card-body'>
            <div className='d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-lg-center'>
              <div className='d-flex align-items-center gap-2'>
                <span className='d-inline-flex align-items-center justify-content-center rounded-2 bg-primary text-white' style={{ width: 44, height: 44 }}>
                  <i className='mdi mdi-information-outline fs-22'></i>
                </span>
                <div>
                  <h4 className='mb-0'>Módulo Nosotros</h4>
                  <small className='text-muted'>Edita el contenido público de Familia y Política del SGI.</small>
                </div>
              </div>
              <div className='d-flex gap-2'>
                <a href='/about' target='_blank' rel='noreferrer' className='btn btn-soft-primary'>
                  <i className='mdi mdi-open-in-new me-1'></i>Ver página
                </a>
                <button type='button' className='btn btn-primary' onClick={save} disabled={saving}>
                  <i className='mdi mdi-content-save me-1'></i>{saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </div>

            <div className='d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mt-3 border-top pt-3'>
              <ul className='nav nav-pills gap-2 mb-0'>
                <li className='nav-item'>
                  <button type='button' className={`nav-link ${isFamily ? 'active' : ''}`} onClick={() => setActiveSection('family')}>
                    <i className='mdi mdi-account-group me-1'></i>Familia
                  </button>
                </li>
                <li className='nav-item'>
                  <button type='button' className={`nav-link ${!isFamily ? 'active' : ''}`} onClick={() => setActiveSection('policy')}>
                    <i className='mdi mdi-shield-check me-1'></i>Política SGI
                  </button>
                </li>
              </ul>
              <small className='text-muted'>
                Editando <strong className='text-dark'>{isFamily ? 'Familia' : 'Política SGI'}</strong> · ambas secciones se guardan juntas.
              </small>
            </div>

            {alert?.message ? (
              <div className={`alert alert-${alert.type || 'danger'} mb-0 mt-3`} role='alert'>
                {alert.message}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {isFamily ? (
        <>
          <SectionCard title='Imagen principal' subtitle='Cabecera de la página de Familia' icon='mdi-image-outline'>
            <MediaUploader preview={form.family_image_preview} onChange={onFamilyImageChange} hint='Imagen horizontal. Tamaño máximo: 4 MB.' />
          </SectionCard>

          <SectionCard title='Familia e historia' subtitle='Texto principal de la sección' icon='mdi-text-box-outline'>
            <div className='row g-3'>
              <FormField col='col-md-4' label='Etiqueta' value={form.family_eyebrow} onChange={(e) => updateField('family_eyebrow', e.target.value)} />
              <FormField col='col-md-8' label='Título' value={form.family_title} onChange={(e) => updateField('family_title', e.target.value)} />
              <FormField col='col-12' label='Texto principal' textarea value={form.family_lead} onChange={(e) => updateField('family_lead', e.target.value)} />
              <FormField col='col-md-6' label='Primer párrafo' textarea value={form.family_paragraph_1} onChange={(e) => updateField('family_paragraph_1', e.target.value)} />
              <FormField col='col-md-6' label='Segundo párrafo' textarea value={form.family_paragraph_2} onChange={(e) => updateField('family_paragraph_2', e.target.value)} />

              <SubHeading>Dato destacado</SubHeading>
              <FormField col='col-md-4' label='Valor' placeholder='30+' value={form.family_metric_value} onChange={(e) => updateField('family_metric_value', e.target.value)} />
              <FormField col='col-md-8' label='Texto del dato' value={form.family_metric_label} onChange={(e) => updateField('family_metric_label', e.target.value)} />

              <SubHeading>Bloques destacados</SubHeading>
              <div className='col-12'>
                <div className='table-responsive'>
                  <table className='table table-sm align-middle mb-0'>
                    <thead>
                      <tr className='text-muted' style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <th style={{ width: 70 }}>Bloque</th>
                        <th style={{ width: '35%' }}>Título</th>
                        <th>Texto</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className='fw-semibold text-muted'>1</td>
                        <td><input className='form-control form-control-sm' value={form.family_aside_1_title || ''} onChange={(e) => updateField('family_aside_1_title', e.target.value)} /></td>
                        <td><input className='form-control form-control-sm' value={form.family_aside_1_text || ''} onChange={(e) => updateField('family_aside_1_text', e.target.value)} /></td>
                      </tr>
                      <tr>
                        <td className='fw-semibold text-muted'>2</td>
                        <td><input className='form-control form-control-sm' value={form.family_aside_2_title || ''} onChange={(e) => updateField('family_aside_2_title', e.target.value)} /></td>
                        <td><input className='form-control form-control-sm' value={form.family_aside_2_text || ''} onChange={(e) => updateField('family_aside_2_text', e.target.value)} /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard col='col-lg-6' title='Misión' icon='mdi-bullseye-arrow'>
            <div className='row g-3'>
              <FormField col='col-md-5' label='Etiqueta' value={form.mission_eyebrow} onChange={(e) => updateField('mission_eyebrow', e.target.value)} />
              <FormField col='col-md-7' label='Título' value={form.mission_title} onChange={(e) => updateField('mission_title', e.target.value)} />
              <FormField col='col-12' label='Texto' textarea rows={4} value={form.mission_text} onChange={(e) => updateField('mission_text', e.target.value)} />
            </div>
          </SectionCard>

          <SectionCard col='col-lg-6' title='Visión' icon='mdi-eye-outline'>
            <div className='row g-3'>
              <FormField col='col-md-5' label='Etiqueta' value={form.vision_eyebrow} onChange={(e) => updateField('vision_eyebrow', e.target.value)} />
              <FormField col='col-md-7' label='Título' value={form.vision_title} onChange={(e) => updateField('vision_title', e.target.value)} />
              <FormField col='col-12' label='Texto' textarea rows={4} value={form.vision_text} onChange={(e) => updateField('vision_text', e.target.value)} />
            </div>
          </SectionCard>

          <SectionCard title='Valores' subtitle='Lista que se muestra en la tarjeta de Valores' icon='mdi-star-outline'>
            <RepeaterTable
              items={form.family_values}
              columnLabel='Valor'
              placeholder='Ej. Integridad'
              minimum={3}
              addLabel='Agregar valor'
              onChange={(index, value) => updateListItem('family_values', index, value)}
              onRemove={(index) => removeValue('family_values', index, 3, () => '')}
              onAdd={() => addValue('family_values', () => '')}
            />
          </SectionCard>
        </>
      ) : (
        <>
          <SectionCard title='Imagen principal' subtitle='Cabecera de la página de Política' icon='mdi-image-outline'>
            <MediaUploader preview={form.policy_image_preview} onChange={onPolicyImageChange} hint='Imagen horizontal. Tamaño máximo: 4 MB.' />
          </SectionCard>

          <SectionCard title='Política del SGI' subtitle='Encabezado, alcance y descripción' icon='mdi-shield-check-outline'>
            <div className='row g-3'>
              <FormField col='col-md-4' label='Etiqueta' value={form.policy_eyebrow} onChange={(e) => updateField('policy_eyebrow', e.target.value)} />
              <FormField col='col-md-8' label='Título' value={form.policy_title} onChange={(e) => updateField('policy_title', e.target.value)} />
              <FormField col='col-12' label='Texto de compromiso' value={form.policy_commitment_text} onChange={(e) => updateField('policy_commitment_text', e.target.value)} />

              <SubHeading>Alcance</SubHeading>
              <FormField col='col-md-4' label='Etiqueta de alcance' value={form.policy_scope_eyebrow} onChange={(e) => updateField('policy_scope_eyebrow', e.target.value)} />
              <FormField col='col-md-8' label='Título de alcance' value={form.policy_scope_title} onChange={(e) => updateField('policy_scope_title', e.target.value)} />
              <FormField col='col-md-6' label='Párrafo de alcance 1' textarea value={form.policy_scope_paragraph_1} onChange={(e) => updateField('policy_scope_paragraph_1', e.target.value)} />
              <FormField col='col-md-6' label='Párrafo de alcance 2' textarea value={form.policy_scope_paragraph_2} onChange={(e) => updateField('policy_scope_paragraph_2', e.target.value)} />

              <SubHeading>Nuestra política</SubHeading>
              <FormField col='col-12' label='Descripción' textarea rows={4} value={form.policy_description} onChange={(e) => updateField('policy_description', e.target.value)} />
              <FormField col='col-12' label='Título de certificaciones' value={form.policy_certifications_title} onChange={(e) => updateField('policy_certifications_title', e.target.value)} />
            </div>
          </SectionCard>

          <SectionCard title='Puntos de política' subtitle='Viñetas de la sección "Nuestra política"' icon='mdi-format-list-bulleted'>
            <RepeaterTable
              items={form.policy_bullets}
              columnLabel='Punto'
              placeholder='Describe el compromiso...'
              minimum={1}
              addLabel='Agregar punto'
              onChange={(index, value) => updateListItem('policy_bullets', index, value)}
              onRemove={(index) => removeValue('policy_bullets', index, 1, () => '')}
              onAdd={() => addValue('policy_bullets', () => '')}
            />
          </SectionCard>

          <SectionCard title='Certificaciones' subtitle='Hasta 3 certificados con imagen y PDF descargable' icon='mdi-certificate-outline'>
            <div className='row g-3'>
              {form.certifications.map((item, index) => {
                const hasPdf = Boolean(item.file_path || item.file_file)

                return (
                  <div className='col-lg-4' key={`cert-${index}`}>
                    <div className='card border h-100'>
                      <div className='card-body'>
                        <div className='d-flex align-items-center justify-content-between mb-2'>
                          <span className='badge bg-primary-subtle text-primary'>Certificación {index + 1}</span>
                          <span className={`badge ${hasPdf ? 'bg-success-subtle text-success' : 'bg-light text-muted'}`}>
                            {hasPdf ? 'PDF cargado' : 'Sin PDF'}
                          </span>
                        </div>

                        <div className='rounded border bg-light p-2 mb-3'>
                          <img
                            src={item.image_preview || IMAGE_FALLBACK}
                            alt={item.title || `Certificación ${index + 1}`}
                            className='w-100 rounded'
                            style={{ aspectRatio: '4/3', objectFit: 'contain', background: '#fff' }}
                          />
                        </div>

                        <div className='mb-2'>
                          <label className='form-label small fw-semibold'>Título</label>
                          <input className='form-control form-control-sm' value={item.title || ''} onChange={(e) => updateCertification(index, 'title', e.target.value)} />
                        </div>
                        <div className='mb-2'>
                          <label className='form-label small fw-semibold'>Descripción</label>
                          <textarea className='form-control form-control-sm' rows={2} value={item.description || ''} onChange={(e) => updateCertification(index, 'description', e.target.value)} />
                        </div>
                        <div className='mb-2'>
                          <label className='form-label small fw-semibold'>Imagen <span className='text-muted fw-normal'>(máx. 4 MB)</span></label>
                          <input type='file' className='form-control form-control-sm' accept='image/*' onChange={(e) => onCertificationImageChange(index, e)} />
                        </div>
                        <div>
                          <label className='form-label small fw-semibold'>PDF <span className='text-muted fw-normal'>(máx. 50 MB)</span></label>
                          <input type='file' className='form-control form-control-sm mb-2' accept='application/pdf' onChange={(e) => onCertificationPdfChange(index, e)} />
                          <div className='d-flex align-items-center justify-content-between gap-2'>
                            {item.file_path ? (
                              <a href={`/storage/${item.file_path}`} target='_blank' rel='noreferrer' className='small text-primary text-truncate'>
                                <i className='mdi mdi-file-pdf-box me-1'></i>{item.file_label || 'Ver PDF'}
                              </a>
                            ) : item.file_file ? (
                              <small className='text-success text-truncate'><i className='mdi mdi-file-check-outline me-1'></i>{item.file_label}</small>
                            ) : (
                              <small className='text-muted'>Sin archivo</small>
                            )}
                            <button type='button' className='btn btn-sm btn-soft-danger' title='Eliminar PDF' disabled={!hasPdf} onClick={() => clearCertificationPdf(index)}>
                              <i className='mdi mdi-trash-can'></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </SectionCard>
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
