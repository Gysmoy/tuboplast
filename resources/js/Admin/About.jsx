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
const TIMELINE_IMAGE_FALLBACK = '/assets/img/about/timeline/1966.jpg'
const DISPLAY_MODE_OPTIONS = [
  { value: 'image_only', label: 'Solo imagen' },
  { value: 'image_with_text', label: 'Imagen con texto' },
]

const DEFAULT_TIMELINE = [
  { year: '2020', title: 'Compromiso con el desarrollo del Perú', text: 'TUBOPLAST seguirá contribuyendo de forma activa y permanente en el crecimiento del sector constructor en el Perú y el desarrollo de la sociedad peruana.', image: 'assets/img/about/timeline/2020.jpg' },
  { year: '2012', title: 'Actualización de norma técnica', text: 'TUBOPLAST participó de forma activa en la Actualización de la Nueva Norma Técnica Peruana (NTP) ISO 1452 para redes de agua que reemplazó a la NTP ISO 4422.', image: 'assets/img/about/timeline/2012.jpg' },
  { year: '2008', title: 'Certificacion ISO 14001', text: 'TUBOPLAST obtuvo la Certificacion Internacional a la Gestion Ambiental ISO 14001.', image: 'assets/img/about/timeline/2008.png' },
  { year: '2007', title: 'Certificacion ISO 9001', text: 'TUBOPLAST obtuvo la Certificacion Internacional a la Gestion de la Calidad ISO 9001.', image: 'assets/img/about/timeline/2007.png' },
  { year: '2003', title: 'Sello de Calidad SEDAPAL', text: 'SEDAPAL otorgó a TUBOPLAST su Sello de Calidad Categoría A por la calidad de sus productos, la calidad de su organización y atención al cliente.', image: 'assets/img/about/timeline/2003.jpg' },
  { year: '1994', title: 'Creación de normas técnicas peruanas', text: 'TUBOPLAST participó de forma activa en la creación de la nueva Norma Técnica Peruana (NTP) ISO 4435 para redes de alcantarillado y la NTP ISO 4422 para redes de agua.', image: 'assets/img/about/timeline/1994.jpg' },
  { year: '1993', title: 'Impulso al saneamiento', text: 'TUBOPLAST reemplaza las tuberías de alcantarillado de concreto simple normalizado por tuberías de PVC y contribuye al desarrollo del sector saneamiento en el Perú.', image: 'assets/img/about/timeline/1993.jpg' },
  { year: '1987', title: 'Redes de agua potable en PVC', text: 'TUBOPLAST sustituye las redes de impulsión, conducción y aducción de asbesto cemento por tuberías de PVC para agua potable.', image: 'assets/img/about/timeline/1987.jpg' },
  { year: '1984', title: 'PVC en redes de distribución', text: 'TUBOPLAST presenta por primera vez en el Perú la alternativa de uso de tuberías PVC en redes de distribución que conforman las urbanizaciones.', image: 'assets/img/about/timeline/1984.jpg' },
  { year: '1966', title: 'Fundación de Tuboplast', text: 'TUBOPLAST, fundada el 18 de octubre de 1966, es una empresa pionera en la introducción de las tuberías de PVC en el Perú.', image: 'assets/img/about/timeline/1966.jpg' },
]

const ABOUT_CSS = `
.wba{--pri:#004991;}
.wba .wba-card{background:#fff;border:1px solid #eef2f8;border-radius:16px;box-shadow:0 1px 2px rgba(15,37,64,.04),0 6px 16px rgba(0,73,145,.06);}
.wba .wba-card-body{padding:18px 20px;}
.wba .wba-chip{display:inline-flex;align-items:center;justify-content:center;border-radius:12px;background:#e6effa;color:var(--pri);flex-shrink:0;}
.wba .wba-h{font-size:15px;font-weight:700;color:#0f2540;margin:0;line-height:1.2;}
.wba .wba-sub{font-size:12px;color:#8a93a6;}
.wba .form-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#8a93a6;margin-bottom:4px;}
.wba .form-control{border:1px solid #dce5f0;border-radius:10px;font-size:13.5px;color:#1f2a44;}
.wba .form-control:focus{border-color:var(--pri);box-shadow:0 0 0 .18rem rgba(0,73,145,.12);}
.wba-btn{height:40px;padding:0 16px;border-radius:10px;font-weight:600;font-size:13px;border:0;display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:.15s;cursor:pointer;text-decoration:none;}
.wba-btn.sm{height:34px;padding:0 12px;font-size:12.5px;}
.wba-btn.primary{background:var(--pri);color:#fff;}.wba-btn.primary:hover{background:#003b7a;color:#fff;}
.wba-btn.primary:disabled{opacity:.6;cursor:default;}
.wba-btn.soft{background:#fff;border:1px solid #dce5f0;color:#5b6577;}.wba-btn.soft:hover{background:#f4f8fd;color:#0f2540;}
.wba-btn.del{background:#fcebeb;color:#e24b4a;border:0;}.wba-btn.del:hover{filter:brightness(.96);}
.wba-btn.del:disabled{opacity:.4;cursor:default;}
.wba-tabs{display:flex;flex-wrap:wrap;gap:6px;}
.wba-tab{height:38px;padding:0 14px;border-radius:10px;border:0;background:#f4f8fd;color:#5b6577;font-weight:600;font-size:13px;display:inline-flex;align-items:center;gap:6px;cursor:pointer;transition:.15s;}
.wba-tab.active{background:var(--pri);color:#fff;}
.wba-tab:not(.active):hover{background:#e6effa;color:var(--pri);}
.wba-sub-h{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#8a93a6;margin:6px 0 0;}
.wba-media{border:1px solid #eef2f8;border-radius:12px;overflow:hidden;background:#f4f8fd;}
.wba-alert{border-radius:12px;padding:10px 14px;font-size:13px;font-weight:500;display:flex;align-items:center;gap:8px;}
.wba-alert.danger{background:#fcebeb;color:#b42318;}
.wba-alert.success{background:#e1f5ee;color:#0f6e56;}
.wba-rep{display:flex;align-items:center;gap:8px;}
.wba-rep .num{width:30px;height:30px;border-radius:8px;background:#f4f8fd;color:#5b6577;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;}
.wba-cert{border:1px solid #eef2f8;border-radius:12px;}
.wba-badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:50rem;font-size:11px;font-weight:600;background:#e6effa;color:var(--pri);}
.wba-badge.ok{background:#e1f5ee;color:#0f6e56;}
.wba-badge.no{background:#f1efe8;color:#8a8780;}
.wba-sort{display:inline-flex;align-items:center;gap:4px;border:1px solid #dce5f0;border-radius:8px;background:#f8fafc;padding:3px;}
.wba-sort button{height:26px;border:0;border-radius:6px;background:transparent;color:#6b7485;font-size:11px;font-weight:600;padding:0 9px;line-height:1;transition:.15s;}
.wba-sort button.active{background:#fff;color:var(--pri);box-shadow:0 1px 3px rgba(15,37,64,.08);}
`

const onImgError = (e) => { if (!e.target.src.endsWith(IMAGE_FALLBACK)) e.target.src = IMAGE_FALLBACK }

const createCertification = () => ({
  title: '', description: '', image_path: '', file_path: '', file_delete: false,
  image_file: null, file_file: null, image_preview: '', file_label: '',
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

const createTimelineItem = () => ({
  year: '', title: '', text: '', image: '', image_path: '', image_file: null, image_preview: '',
})

const getTimelineImagePreview = (item) => {
  if (item?.image_url) return item.image_url
  if (item?.image_path) return `/about/media/${item.image_path}`
  if (item?.image?.startsWith('/')) return item.image
  if (item?.image) return `/${item.image}`
  return ''
}

const normalizeTimeline = (items) => {
  const source = Array.isArray(items) && items.length > 3 ? items : DEFAULT_TIMELINE
  return source.map((item) => ({
    ...createTimelineItem(),
    ...item,
    image_preview: getTimelineImagePreview(item),
  })).sort((a, b) => Number(a.year) - Number(b.year))
}

// ----------------------------------------------------------------- UI helpers
const SectionCard = ({ title, subtitle, icon, actions, children, col = 'col-12' }) => (
  <div className={col}>
    <div className='wba-card h-100'>
      <div className='wba-card-body'>
        {(title || actions) && (
          <div className='d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-3'>
            <div className='d-flex align-items-center gap-2'>
              {icon && <span className='wba-chip' style={{ width: 38, height: 38 }}><i className={`mdi ${icon} fs-20`}></i></span>}
              <div>
                <h5 className='wba-h'>{title}</h5>
                {subtitle && <small className='wba-sub'>{subtitle}</small>}
              </div>
            </div>
            {actions}
          </div>
        )}
        {children}
      </div>
    </div>
  </div>
)

const FormField = ({ label, value, onChange, col = 'col-12', type = 'text', placeholder = '', textarea = false, rows = 3 }) => (
  <div className={col}>
    <label className='form-label'>{label}</label>
    {textarea
      ? <textarea className='form-control' rows={rows} value={value || ''} placeholder={placeholder} onChange={onChange} />
      : <input type={type} className='form-control' value={value || ''} placeholder={placeholder} onChange={onChange} />}
  </div>
)

const SelectField = ({ label, value, onChange, col = 'col-12', options = [] }) => (
  <div className={col}>
    <label className='form-label'>{label}</label>
    <select className='form-control' value={value || ''} onChange={onChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
)

const SubHeading = ({ children }) => (
  <div className='col-12'><p className='wba-sub-h'>{children}</p></div>
)

const MediaUploader = ({ preview, onChange, hint, aspect = '16/9' }) => (
  <div className='row g-3 align-items-center'>
    <div className='col-lg-7'>
      <div className='wba-media'>
        <img src={preview || IMAGE_FALLBACK} alt='Vista previa' className='w-100 d-block' style={{ aspectRatio: aspect, objectFit: 'cover' }} onError={onImgError} />
      </div>
    </div>
    <div className='col-lg-5'>
      <label className='form-label'>Cambiar imagen</label>
      <input type='file' className='form-control' accept='image/*' onChange={onChange} />
      <small className='wba-sub d-block mt-2'>{hint}</small>
    </div>
  </div>
)

const Repeater = ({ items, placeholder, minimum, onChange, onRemove, onAdd, addLabel }) => (
  <>
    <div className='d-flex flex-column gap-2'>
      {items.length ? items.map((item, index) => (
        <div className='wba-rep' key={index}>
          <span className='num'>{index + 1}</span>
          <input className='form-control' value={item} placeholder={placeholder} onChange={(e) => onChange(index, e.target.value)} />
          <button type='button' className='wba-btn del sm' title='Quitar' style={{ width: 38, padding: 0 }} disabled={items.length <= minimum} onClick={() => onRemove(index)}>
            <i className='mdi mdi-trash-can'></i>
          </button>
        </div>
      )) : <p className='wba-sub mb-0'>Sin elementos todavía.</p>}
    </div>
    <button type='button' className='wba-btn soft sm mt-3' onClick={onAdd}>
      <i className='mdi mdi-plus'></i>{addLabel}
    </button>
  </>
)

const About = ({ about: initialAbout = {} }) => {
  const initialForm = useMemo(() => ({
    ...initialAbout,
    family_image: initialAbout.family_image || '',
    family_hero_display_mode: initialAbout.family_hero_display_mode || 'image_with_text',
    family_image_file: null,
    family_image_preview: getFamilyImagePreview(initialAbout),
    policy_image: initialAbout.policy_image || '',
    policy_hero_display_mode: initialAbout.policy_hero_display_mode || 'image_with_text',
    policy_image_file: null,
    policy_image_preview: getPolicyImagePreview(initialAbout),
    family_values: Array.isArray(initialAbout.family_values) && initialAbout.family_values.length
      ? initialAbout.family_values
      : ['Integridad', 'Respeto', 'Responsabilidad', 'Puntualidad', 'Compromiso', 'Confianza', 'Perseverancia'],
    milestones: normalizeTimeline(initialAbout.milestones),
    timeline_sort_direction: initialAbout.timeline_sort_direction || 'asc',
    policy_bullets: Array.isArray(initialAbout.policy_bullets) && initialAbout.policy_bullets.length ? initialAbout.policy_bullets : [],
    certifications: normalizeCertifications(initialAbout.certifications),
  }), [initialAbout])

  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [savingOrder, setSavingOrder] = useState(false)
  const [activeSection, setActiveSection] = useState('family')
  const [alert, setAlert] = useState(null)

  useEffect(() => { setForm(initialForm) }, [initialForm])

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const showAlert = (message, type = 'danger') => setAlert({ message, type })

  const validateFile = (file, maxSize, label) => {
    if (file.size > maxSize) { showAlert(`${label} supera el tamaño permitido. El máximo es ${Math.round(maxSize / (1024 * 1024))} MB.`); return false }
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

  const updateTimelineItem = (index, field, value) => {
    setForm((current) => {
      const next = [...(current.milestones ?? [])]
      next[index] = { ...next[index], [field]: value }
      return { ...current, milestones: next }
    })
  }

  const moveTimelineItem = (index, direction) => {
    setForm((current) => {
      const next = [...(current.milestones ?? [])]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      const item = next[index]
      next[index] = next[target]
      next[target] = item
      return { ...current, milestones: next }
    })
  }

  const addValue = (section, factory) => setForm((current) => ({ ...current, [section]: [...(current[section] ?? []), factory()] }))

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
    if (!validateFile(file, MAX_IMAGE_SIZE, 'La imagen de Familia')) { event.target.value = ''; return }
    setForm((current) => ({ ...current, family_image_file: file, family_image_preview: URL.createObjectURL(file) }))
  }

  const onPolicyImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!validateFile(file, MAX_IMAGE_SIZE, 'La imagen de Política')) { event.target.value = ''; return }
    setForm((current) => ({ ...current, policy_image_file: file, policy_image_preview: URL.createObjectURL(file) }))
  }

  const onCertificationImageChange = (index, event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!validateFile(file, MAX_IMAGE_SIZE, `La imagen de la certificación ${index + 1}`)) { event.target.value = ''; return }
    updateCertification(index, 'image_file', file)
    updateCertification(index, 'image_preview', URL.createObjectURL(file))
  }

  const onTimelineImageChange = (index, event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!validateFile(file, MAX_IMAGE_SIZE, `La imagen del hito ${index + 1}`)) { event.target.value = ''; return }
    updateTimelineItem(index, 'image_file', file)
    updateTimelineItem(index, 'image_preview', URL.createObjectURL(file))
  }

  const onCertificationPdfChange = (index, event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!validateFile(file, MAX_CERT_PDF_SIZE, `El PDF de la certificación ${index + 1}`)) { event.target.value = ''; return }
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
        const prev = previousForm.certifications?.[index] ?? {}
        if (prev.image_file instanceof File && prev.image_preview) certification.image_preview = prev.image_preview
        if (prev.file_file instanceof File && prev.file_label) certification.file_label = prev.file_label
      })

      setForm({
        ...result.data,
        family_image: result.data.family_image || '',
        family_hero_display_mode: result.data.family_hero_display_mode || 'image_with_text',
        family_image_file: null,
        family_image_preview: previousForm.family_image_file instanceof File && previousForm.family_image_preview ? previousForm.family_image_preview : getFamilyImagePreview(result.data),
        policy_image: result.data.policy_image || '',
        policy_hero_display_mode: result.data.policy_hero_display_mode || 'image_with_text',
        policy_image_file: null,
        policy_image_preview: previousForm.policy_image_file instanceof File && previousForm.policy_image_preview ? previousForm.policy_image_preview : getPolicyImagePreview(result.data),
        milestones: normalizeTimeline(result.data.milestones),
        timeline_sort_direction: result.data.timeline_sort_direction || 'asc',
        family_values: Array.isArray(result.data.family_values) ? result.data.family_values : [],
        policy_bullets: Array.isArray(result.data.policy_bullets) ? result.data.policy_bullets : [],
        certifications,
      })
      showAlert('Cambios guardados correctamente.', 'success')
    } else {
      showAlert('No se pudieron guardar los cambios. Inténtalo nuevamente.')
    }

    setSaving(false)
  }

  const saveTimelineOrder = async (direction) => {
    if (savingOrder || direction === form.timeline_sort_direction) return

    const nextForm = { ...form, timeline_sort_direction: direction }
    setSavingOrder(true)
    setAlert(null)
    setForm(nextForm)

    const result = await aboutRest.save(nextForm)
    if (result?.data) {
      setForm((current) => ({
        ...current,
        timeline_sort_direction: result.data.timeline_sort_direction || direction,
        milestones: normalizeTimeline(result.data.milestones),
      }))
      showAlert('Orden actualizado correctamente.', 'success')
    } else {
      setForm((current) => ({ ...current, timeline_sort_direction: form.timeline_sort_direction }))
      showAlert('No se pudo actualizar el orden. Inténtalo nuevamente.')
    }

    setSavingOrder(false)
  }

  const isFamily = activeSection === 'family'

  return (
    <div className='wba'>
      <style>{ABOUT_CSS}</style>
      <div className='row g-3'>
        {/* Toolbar */}
        <div className='col-12'>
          <div className='wba-card'>
            <div className='wba-card-body'>
              <div className='d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-lg-center'>
                <div className='d-flex align-items-center gap-2'>
                  <span className='wba-chip' style={{ width: 44, height: 44, background: '#004991', color: '#fff' }}>
                    <i className='ti ti-user-star fs-22'></i>
                  </span>
                  <div>
                    <h4 className='wba-h' style={{ fontSize: 18 }}>Módulo Nosotros</h4>
                    <small className='wba-sub'>Contenido público de Familia y Política del SGI.</small>
                  </div>
                </div>
                <div className='d-flex gap-2'>
                  <a href='/about' target='_blank' rel='noreferrer' className='wba-btn soft'><i className='mdi mdi-open-in-new'></i>Ver página</a>
                  <button type='button' className='wba-btn primary' onClick={save} disabled={saving}>
                    {saving ? <><span className='spinner-border spinner-border-sm'></span> Guardando...</> : <><i className='mdi mdi-content-save'></i> Guardar cambios</>}
                  </button>
                </div>
              </div>

              <div className='d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mt-3 pt-3' style={{ borderTop: '1px solid #eef2f8' }}>
                <div className='wba-tabs'>
                  <button type='button' className={`wba-tab ${isFamily ? 'active' : ''}`} onClick={() => setActiveSection('family')}><i className='mdi mdi-account-group'></i>Familia</button>
                  <button type='button' className={`wba-tab ${!isFamily ? 'active' : ''}`} onClick={() => setActiveSection('policy')}><i className='mdi mdi-shield-check'></i>Política SGI</button>
                </div>
                <small className='wba-sub'>Ambas secciones se guardan juntas.</small>
              </div>

              {alert?.message ? (
                <div className={`wba-alert ${alert.type || 'danger'} mt-3`} role='alert'>
                  <i className={`mdi ${alert.type === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'}`}></i>{alert.message}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {isFamily ? (
          <>
            <SectionCard title='Imagen principal' subtitle='Cabecera de la página de Familia' icon='mdi-image-outline'>
              <MediaUploader preview={form.family_image_preview} onChange={onFamilyImageChange} hint='Imagen horizontal (16:9). Tamaño máximo: 4 MB.' />
            </SectionCard>

            <SectionCard title='Familia e historia' subtitle='Texto principal de la sección' icon='mdi-text-box-outline'>
              <div className='row g-3'>
                <SelectField col='col-md-4' label='Modo de portada' value={form.family_hero_display_mode} options={DISPLAY_MODE_OPTIONS} onChange={(e) => updateField('family_hero_display_mode', e.target.value)} />
                <FormField col='col-md-4' label='Etiqueta' value={form.family_eyebrow} onChange={(e) => updateField('family_eyebrow', e.target.value)} />
                <FormField col='col-md-8' label='Título' value={form.family_title} onChange={(e) => updateField('family_title', e.target.value)} />
                <FormField col='col-12' label='Texto principal' textarea value={form.family_lead} onChange={(e) => updateField('family_lead', e.target.value)} />
                <FormField col='col-md-6' label='Primer párrafo' textarea value={form.family_paragraph_1} onChange={(e) => updateField('family_paragraph_1', e.target.value)} />
                <FormField col='col-md-6' label='Segundo párrafo' textarea value={form.family_paragraph_2} onChange={(e) => updateField('family_paragraph_2', e.target.value)} />

                <SubHeading>Dato destacado</SubHeading>
                <FormField col='col-md-4' label='Valor' placeholder='30+' value={form.family_metric_value} onChange={(e) => updateField('family_metric_value', e.target.value)} />
                <FormField col='col-md-8' label='Texto del dato' value={form.family_metric_label} onChange={(e) => updateField('family_metric_label', e.target.value)} />

                <SubHeading>Bloques destacados</SubHeading>
                <FormField col='col-md-4' label='Bloque 1 · Título' value={form.family_aside_1_title} onChange={(e) => updateField('family_aside_1_title', e.target.value)} />
                <FormField col='col-md-8' label='Bloque 1 · Texto' value={form.family_aside_1_text} onChange={(e) => updateField('family_aside_1_text', e.target.value)} />
                <FormField col='col-md-4' label='Bloque 2 · Título' value={form.family_aside_2_title} onChange={(e) => updateField('family_aside_2_title', e.target.value)} />
                <FormField col='col-md-8' label='Bloque 2 · Texto' value={form.family_aside_2_text} onChange={(e) => updateField('family_aside_2_text', e.target.value)} />
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

            <SectionCard title='Eventos' subtitle='Tabla de eventos de la línea de tiempo. Se ordenan automáticamente por año.' icon='mdi-timeline-clock-outline'>
              <div className='d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-2 mb-3'>
                <div className='d-flex align-items-center gap-2 ms-lg-auto order-lg-2'>
                  <span className='wba-sub' style={{ fontSize: 11 }}>Orden</span>
                  <div className='wba-sort' role='group' aria-label='Orden de eventos'>
                    <button type='button' disabled={savingOrder} className={form.timeline_sort_direction === 'asc' ? 'active' : ''} onClick={() => saveTimelineOrder('asc')}>Asc.</button>
                    <button type='button' disabled={savingOrder} className={form.timeline_sort_direction === 'desc' ? 'active' : ''} onClick={() => saveTimelineOrder('desc')}>Desc.</button>
                  </div>
                  {savingOrder ? <span className='spinner-border spinner-border-sm text-primary' style={{ width: 12, height: 12 }}></span> : null}
                </div>
                <button type='button' className='wba-btn soft sm order-lg-1' onClick={() => addValue('milestones', createTimelineItem)}>
                  <i className='mdi mdi-plus'></i>Agregar evento
                </button>
              </div>
              <div className='table-responsive'>
                <table className='table table-sm align-middle mb-0'>
                  <thead>
                    <tr>
                      <th style={{ width: 92 }}>Año</th>
                      <th style={{ minWidth: 190 }}>Título</th>
                      <th style={{ minWidth: 280 }}>Descripción</th>
                      <th style={{ width: 210 }}>Imagen</th>
                      <th style={{ width: 52 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(form.milestones ?? []).map((item, index) => (
                      <tr key={`timeline-${index}`}>
                        <td>
                          <input className='form-control form-control-sm' value={item.year || ''} placeholder='1966' onChange={(e) => updateTimelineItem(index, 'year', e.target.value)} />
                        </td>
                        <td>
                          <input className='form-control form-control-sm' value={item.title || ''} placeholder='Nombre del evento' onChange={(e) => updateTimelineItem(index, 'title', e.target.value)} />
                        </td>
                        <td>
                          <textarea className='form-control form-control-sm' rows={2} value={item.text || ''} placeholder='Descripción del evento' onChange={(e) => updateTimelineItem(index, 'text', e.target.value)} />
                        </td>
                        <td>
                          <div className='d-flex align-items-center gap-2'>
                            <div className='wba-media flex-shrink-0' style={{ width: 78 }}>
                              <img src={item.image_preview || TIMELINE_IMAGE_FALLBACK} alt={item.title || `Evento ${index + 1}`} className='w-100 d-block' style={{ aspectRatio: '16/10', objectFit: 'contain', background: '#fff' }} onError={onImgError} />
                            </div>
                            <input type='file' className='form-control form-control-sm' accept='image/*' onChange={(e) => onTimelineImageChange(index, e)} />
                          </div>
                        </td>
                        <td className='text-end'>
                          <button type='button' className='wba-btn del sm' style={{ width: 34, padding: 0 }} title='Quitar' disabled={(form.milestones ?? []).length <= 1} onClick={() => removeValue('milestones', index, 1, createTimelineItem)}><i className='mdi mdi-trash-can'></i></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            <SectionCard title='Valores' subtitle='Lista que se muestra en la tarjeta de Valores' icon='mdi-star-outline'>
              <Repeater
                items={form.family_values}
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
              <MediaUploader preview={form.policy_image_preview} onChange={onPolicyImageChange} hint='Imagen horizontal (16:9). Tamaño máximo: 4 MB.' />
            </SectionCard>

            <SectionCard title='Política del SGI' subtitle='Encabezado, alcance y descripción' icon='mdi-shield-check-outline'>
              <div className='row g-3'>
                <SelectField col='col-md-4' label='Modo de portada' value={form.policy_hero_display_mode} options={DISPLAY_MODE_OPTIONS} onChange={(e) => updateField('policy_hero_display_mode', e.target.value)} />
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
              <Repeater
                items={form.policy_bullets}
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
                      <div className='wba-cert h-100'>
                        <div className='p-3'>
                          <div className='d-flex align-items-center justify-content-between mb-2'>
                            <span className='wba-badge'>Certificación {index + 1}</span>
                            <span className={`wba-badge ${hasPdf ? 'ok' : 'no'}`}>{hasPdf ? 'PDF cargado' : 'Sin PDF'}</span>
                          </div>

                          <div className='wba-media p-2 mb-3'>
                            <img src={item.image_preview || IMAGE_FALLBACK} alt={item.title || `Certificación ${index + 1}`} className='w-100 rounded' style={{ aspectRatio: '4/3', objectFit: 'contain', background: '#fff' }} onError={onImgError} />
                          </div>

                          <div className='mb-2'>
                            <label className='form-label'>Título</label>
                            <input className='form-control form-control-sm' value={item.title || ''} onChange={(e) => updateCertification(index, 'title', e.target.value)} />
                          </div>
                          <div className='mb-2'>
                            <label className='form-label'>Descripción</label>
                            <textarea className='form-control form-control-sm' rows={2} value={item.description || ''} onChange={(e) => updateCertification(index, 'description', e.target.value)} />
                          </div>
                          <div className='mb-2'>
                            <label className='form-label'>Imagen <span className='text-muted fw-normal'>(máx. 4 MB)</span></label>
                            <input type='file' className='form-control form-control-sm' accept='image/*' onChange={(e) => onCertificationImageChange(index, e)} />
                          </div>
                          <div>
                            <label className='form-label'>PDF <span className='text-muted fw-normal'>(máx. 50 MB)</span></label>
                            <input type='file' className='form-control form-control-sm mb-2' accept='application/pdf' onChange={(e) => onCertificationPdfChange(index, e)} />
                            <div className='d-flex align-items-center justify-content-between gap-2'>
                              {item.file_path ? (
                                <a href={`/storage/${item.file_path}`} target='_blank' rel='noreferrer' className='small text-primary text-truncate'><i className='mdi mdi-file-pdf-box me-1'></i>{item.file_label || 'Ver PDF'}</a>
                              ) : item.file_file ? (
                                <small className='text-success text-truncate'><i className='mdi mdi-file-check-outline me-1'></i>{item.file_label}</small>
                              ) : (
                                <small className='text-muted'>Sin archivo</small>
                              )}
                              <button type='button' className='wba-btn del sm' style={{ width: 36, padding: 0 }} title='Eliminar PDF' disabled={!hasPdf} onClick={() => clearCertificationPdf(index)}>
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
