import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useRef, useState } from 'react'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'
import ConfirmModal from '../Components/ConfirmModal.jsx'
import BlogRest from '../Actions/Admin/BlogRest.js'
import QuillFormGroup from '../Components/Form/QuillFormGroup.jsx'

const blogRest = new BlogRest()
const MAX_IMAGE_SIZE = 4 * 1024 * 1024
const IMAGE_FALLBACK = '/assets/img/landing/bg-main.png'

const BLOG_CSS = `
.wbl{--pri:#004991;}
.wbl .wbl-card{background:#fff;border:1px solid #eef2f8;border-radius:16px;box-shadow:0 1px 2px rgba(15,37,64,.04),0 6px 16px rgba(0,73,145,.06);}
.wbl .wbl-card-body{padding:16px 18px;}
.wbl .wbl-chip{display:inline-flex;align-items:center;justify-content:center;border-radius:12px;background:#e6effa;color:var(--pri);flex-shrink:0;}
.wbl .wbl-h{font-size:18px;font-weight:700;color:#0f2540;margin:0;line-height:1.2;}
.wbl .wbl-sub{font-size:12px;color:#8a93a6;}
.wbl .form-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#8a93a6;margin-bottom:4px;display:block;}
.wbl .form-control{border:1px solid #dce5f0;border-radius:10px;font-size:13.5px;color:#1f2a44;}
.wbl .form-control:focus{border-color:var(--pri);box-shadow:0 0 0 .18rem rgba(0,73,145,.12);}
.wbl-btn{height:40px;padding:0 16px;border-radius:10px;font-weight:600;font-size:13px;border:0;display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:.15s;cursor:pointer;text-decoration:none;}
.wbl-btn.sm{height:36px;padding:0 12px;}
.wbl-btn.primary{background:var(--pri);color:#fff;}.wbl-btn.primary:hover{background:#003b7a;color:#fff;}
.wbl-btn.primary:disabled{opacity:.6;cursor:default;}
.wbl-btn.soft{background:#fff;border:1px solid #dce5f0;color:#5b6577;}.wbl-btn.soft:hover{background:#f4f8fd;color:#0f2540;}
.wbl-ico{width:38px;height:38px;border-radius:10px;border:1px solid #dce5f0;background:#fff;color:#5b6577;display:inline-flex;align-items:center;justify-content:center;font-size:17px;cursor:pointer;transition:.15s;}
.wbl-ico:hover{background:#f4f8fd;color:var(--pri);border-color:#bcd4ef;}
.wbl-pill{display:inline-flex;align-items:center;gap:6px;background:#f4f8fd;color:#5b6577;border-radius:50rem;padding:4px 12px;font-size:12px;font-weight:600;}
.wbl-table{width:100%;border-collapse:separate;border-spacing:0;}
.wbl-table th{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:#8a93a6;font-weight:600;padding:10px 12px;border-bottom:1px solid #eef2f8;text-align:left;white-space:nowrap;}
.wbl-table td{padding:10px 12px;border-bottom:1px solid #f1f5fa;vertical-align:middle;font-size:13.5px;color:#1f2a44;}
.wbl-table tr:hover td{background:#f9fbfe;}
.wbl-thumb{width:60px;height:44px;border-radius:8px;object-fit:cover;border:1px solid #eef2f8;flex-shrink:0;background:#f4f8fd;}
.wbl-act{width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;border:0;font-size:13px;cursor:pointer;transition:filter .15s;}
.wbl-act:hover{filter:brightness(.96);}
.wbl-act.edit{background:#e8f0ff;color:#3b82f6;}
.wbl-act.del{background:#fcebeb;color:#e24b4a;}
.wbl-alert{border-radius:12px;padding:10px 14px;font-size:13px;font-weight:500;display:flex;align-items:center;gap:8px;margin-bottom:12px;}
.wbl-alert.danger{background:#fcebeb;color:#b42318;}
.wbl-alert.success{background:#e1f5ee;color:#0f6e56;}
.wbl-page{min-width:34px;height:34px;border-radius:9px;border:1px solid #dce5f0;background:#fff;color:#5b6577;font-weight:600;font-size:13px;cursor:pointer;}
.wbl-page.active{background:var(--pri);border-color:var(--pri);color:#fff;}
.wbl-page:disabled{opacity:.45;cursor:default;}
.wbl-empty{padding:48px 16px;text-align:center;color:#8a93a6;}
.wbl-sec{border:1px solid #eef2f8;border-radius:12px;padding:16px;}
.wbl-sec h4{font-size:14px;font-weight:700;color:#0f2540;margin:0 0 14px;display:flex;align-items:center;gap:6px;}
.wbl-media{border:1px solid #eef2f8;border-radius:12px;overflow:hidden;background:#f4f8fd;}
.wbl-modal-ovl{position:fixed;inset:0;z-index:1100;background:rgba(15,23,42,.5);display:flex;align-items:flex-start;justify-content:center;padding:3vh 12px;}
.wbl-modal{position:relative;width:min(1000px,96vw);max-height:94vh;background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(15,37,64,.25);display:flex;flex-direction:column;overflow:hidden;}
.wbl-modal.narrow{width:min(840px,96vw);}
.wbl-modal form{display:flex;flex-direction:column;min-height:0;flex:1;}
.wbl-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid #eef2f8;flex-shrink:0;}
.wbl-modal-body{overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:14px;flex:1;}
.wbl-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 20px;border-top:1px solid #eef2f8;flex-shrink:0;}
.wbl-close{width:36px;height:36px;border-radius:10px;border:0;background:none;color:#8a93a6;font-size:18px;cursor:pointer;}
.wbl-close:hover{background:#f4f8fd;color:#0f2540;}
.wbl-h2{font-size:16px;font-weight:700;color:#0f2540;margin:0;}
`

const POST_FALLBACKS = [
  '/assets/img/categories/category-1.png',
  '/assets/img/categories/category-2.png',
  '/assets/img/categories/category-3.png',
]

const createPost = (fallback = POST_FALLBACKS[0]) => ({
  category: '', title: '', description: '', eyebrow: '', author: '', role: '',
  published: '', read_time: '', lead: '', content_html: '', highlight_label: '', highlight: '',
  image_path: '', image_file: null, image_preview: '', image_fallback: fallback,
})

const normalizePosts = (items) => {
  const list = Array.isArray(items) ? items.slice() : []
  return list.map((item, index) => ({
    ...createPost(POST_FALLBACKS[index % POST_FALLBACKS.length]),
    ...item,
    image_preview: item?.image_url || (item?.image_path ? `/storage/${item.image_path}` : ''),
    image_fallback: item?.image_fallback || POST_FALLBACKS[index % POST_FALLBACKS.length],
  }))
}

const getHeroPreview = (blog) => blog?.hero_image_url || (blog?.hero_image ? `/storage/${blog.hero_image}` : '')
const postThumb = (p) => p.image_preview || p.image_url || p.image_fallback || IMAGE_FALLBACK
const onImgError = (e) => { if (!e.target.src.endsWith(IMAGE_FALLBACK)) e.target.src = IMAGE_FALLBACK }

// ----------------------------------------------------------------- helpers UI
const Field = ({ label, value, onChange, col = 'col-12', type = 'text', placeholder = '', textarea = false, rows = 3 }) => (
  <div className={col}>
    <label className='form-label'>{label}</label>
    {textarea
      ? <textarea className='form-control' rows={rows} value={value || ''} placeholder={placeholder} onChange={onChange} />
      : <input type={type} className='form-control' value={value || ''} placeholder={placeholder} onChange={onChange} />}
  </div>
)

const Blog = ({ blog: initialBlog = {} }) => {
  const initialForm = useMemo(() => ({
    ...initialBlog,
    hero_image: initialBlog.hero_image || '',
    hero_image_file: null,
    hero_image_preview: getHeroPreview(initialBlog),
    hero_badge: initialBlog.hero_badge || 'Blog Tuboplast',
    hero_title: initialBlog.hero_title || 'Construyendo el futuro',
    hero_description: initialBlog.hero_description || '',
    section_title: initialBlog.section_title || 'Ultimas actualizaciones',
    newsletter_eyebrow: initialBlog.newsletter_eyebrow || 'Newsletter',
    newsletter_title: initialBlog.newsletter_title || 'Se el primero en saber',
    newsletter_description: initialBlog.newsletter_description || '',
    newsletter_placeholder: initialBlog.newsletter_placeholder || 'Correo electronico',
    newsletter_button_label: initialBlog.newsletter_button_label || 'Suscribirme ahora',
    posts: normalizePosts(initialBlog.posts),
    most_read: Array.isArray(initialBlog.most_read) ? initialBlog.most_read : [],
  }), [initialBlog])

  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState(null)
  const [page, setPage] = useState(1)
  const perPage = 8

  // Modal artículo
  const [postOpen, setPostOpen] = useState(false)
  const [postIndex, setPostIndex] = useState(null) // null = nuevo
  const [postDraft, setPostDraft] = useState(createPost())
  const quillRef = useRef({ current: { value: '' } })

  // Modal configuración
  const [configOpen, setConfigOpen] = useState(false)
  const [configDraft, setConfigDraft] = useState({})

  // Eliminar
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { setForm(initialForm) }, [initialForm])

  const posts = form.posts ?? []
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage))
  useEffect(() => { setPage((p) => Math.min(Math.max(p, 1), totalPages)) }, [totalPages])

  const pagePosts = useMemo(() => {
    const start = (page - 1) * perPage
    return posts.slice(start, start + perPage).map((p, i) => ({ post: p, index: start + i }))
  }, [posts, page])

  useEffect(() => {
    const open = postOpen || configOpen
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [postOpen, configOpen])

  const showAlert = (message, type = 'danger') => setAlert({ message, type })

  const validateFile = (file, label) => {
    if (file.size > MAX_IMAGE_SIZE) { showAlert(`${label} supera el tamaño permitido. El máximo es 4 MB.`); return false }
    setAlert(null)
    return true
  }

  // Persiste TODO el blog (posts + config) en una sola operación.
  const persist = async (targetForm) => {
    setSaving(true)
    setAlert(null)
    const result = await blogRest.save(targetForm)
    setSaving(false)

    if (!result?.data) {
      showAlert('No se pudieron guardar los cambios. Inténtalo nuevamente.')
      return false
    }

    const nextPosts = normalizePosts(result.data.posts)
    nextPosts.forEach((post, index) => {
      const prev = targetForm.posts?.[index]
      if (prev?.image_file instanceof File && prev.image_preview) post.image_preview = prev.image_preview
    })

    setForm({
      ...result.data,
      hero_image: result.data.hero_image || '',
      hero_image_file: null,
      hero_image_preview:
        targetForm.hero_image_file instanceof File && targetForm.hero_image_preview
          ? targetForm.hero_image_preview
          : getHeroPreview(result.data),
      hero_badge: result.data.hero_badge || '',
      hero_title: result.data.hero_title || '',
      hero_description: result.data.hero_description || '',
      section_title: result.data.section_title || '',
      newsletter_eyebrow: result.data.newsletter_eyebrow || '',
      newsletter_title: result.data.newsletter_title || '',
      newsletter_description: result.data.newsletter_description || '',
      newsletter_placeholder: result.data.newsletter_placeholder || '',
      newsletter_button_label: result.data.newsletter_button_label || '',
      posts: nextPosts,
      most_read: Array.isArray(result.data.most_read) ? result.data.most_read : [],
    })
    showAlert('Cambios guardados correctamente.', 'success')
    return true
  }

  // ---- Artículo
  const openPost = (index = null) => {
    const draft = index == null ? createPost() : { ...posts[index] }
    setPostIndex(index)
    setPostDraft(draft)
    quillRef.current.current.value = draft.content_html || ''
    setAlert(null)
    setPostOpen(true)
  }
  const closePost = () => { if (!saving) setPostOpen(false) }
  const setDraft = (field, value) => setPostDraft((d) => ({ ...d, [field]: value }))

  const onPostImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!validateFile(file, 'La imagen del artículo')) { event.target.value = ''; return }
    setPostDraft((d) => ({ ...d, image_file: file, image_preview: URL.createObjectURL(file) }))
  }

  const savePost = async (e) => {
    e.preventDefault()
    if (saving) return
    if (!postDraft.title?.trim()) { showAlert('El título del artículo es obligatorio.'); return }
    const nextPosts = postIndex == null ? [postDraft, ...posts] : posts.map((p, i) => (i === postIndex ? postDraft : p))
    const ok = await persist({ ...form, posts: nextPosts })
    if (ok) { setPostOpen(false); if (postIndex == null) setPage(1) }
  }

  // ---- Eliminar
  const performDelete = async () => {
    const idx = confirmTarget?.index
    if (idx == null) return
    setDeleting(true)
    const nextPosts = posts.filter((_, i) => i !== idx)
    const ok = await persist({ ...form, posts: nextPosts })
    setDeleting(false)
    if (ok) setConfirmTarget(null)
  }

  // ---- Configuración
  const openConfig = () => {
    setConfigDraft({
      hero_image_file: null,
      hero_image_preview: form.hero_image_preview,
      hero_badge: form.hero_badge,
      hero_title: form.hero_title,
      hero_description: form.hero_description,
      section_title: form.section_title,
      newsletter_eyebrow: form.newsletter_eyebrow,
      newsletter_title: form.newsletter_title,
      newsletter_description: form.newsletter_description,
      newsletter_placeholder: form.newsletter_placeholder,
      newsletter_button_label: form.newsletter_button_label,
    })
    setAlert(null)
    setConfigOpen(true)
  }
  const closeConfig = () => { if (!saving) setConfigOpen(false) }
  const setCfg = (field, value) => setConfigDraft((d) => ({ ...d, [field]: value }))

  const onHeroImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!validateFile(file, 'La imagen de portada')) { event.target.value = ''; return }
    setConfigDraft((d) => ({ ...d, hero_image_file: file, hero_image_preview: URL.createObjectURL(file) }))
  }

  const saveConfig = async (e) => {
    e.preventDefault()
    if (saving) return
    const ok = await persist({ ...form, ...configDraft })
    if (ok) setConfigOpen(false)
  }

  return (
    <div className='wbl'>
      <style>{BLOG_CSS}</style>

      {alert?.message ? (
        <div className={`wbl-alert ${alert.type || 'danger'}`} role='alert'>
          <i className={`mdi ${alert.type === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'}`}></i>
          {alert.message}
        </div>
      ) : null}

      <div className='wbl-card'>
        <div className='wbl-card-body'>
          {/* Header */}
          <div className='d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3'>
            <div className='d-flex align-items-center gap-2'>
              <span className='wbl-chip' style={{ width: 44, height: 44, background: '#004991', color: '#fff' }}>
                <i className='ti ti-news fs-22'></i>
              </span>
              <div>
                <h4 className='wbl-h'>Artículos del blog</h4>
                <small className='wbl-sub'>{posts.length} artículo(s) · la página pública se adapta automáticamente</small>
              </div>
            </div>
            <div className='d-flex align-items-center gap-2'>
              <button type='button' className='wbl-btn primary' onClick={() => openPost(null)}>
                <i className='mdi mdi-plus'></i> Nuevo<span className='d-none d-md-inline'>&nbsp;artículo</span>
              </button>
              <button type='button' className='wbl-btn soft' onClick={openConfig}>
                <i className='mdi mdi-cog-outline'></i> Configuración
              </button>
              <a href='/blog' target='_blank' rel='noreferrer' className='wbl-ico' title='Ver blog'><i className='mdi mdi-open-in-new'></i></a>
              <button type='button' className='wbl-ico' title='Refrescar' onClick={() => window.location.reload()}><i className='mdi mdi-refresh'></i></button>
            </div>
          </div>

          {/* Tabla */}
          <div className='table-responsive'>
            <table className='wbl-table'>
              <thead>
                <tr>
                  <th style={{ width: 80 }}>Imagen</th>
                  <th>Artículo</th>
                  <th>Autor</th>
                  <th style={{ width: 160 }}>Publicado</th>
                  <th style={{ width: 110 }} className='text-end'>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pagePosts.map(({ post, index }) => (
                  <tr key={`post-${index}`}>
                    <td><img className='wbl-thumb' src={postThumb(post)} alt={post.title} onError={onImgError} /></td>
                    <td>
                      <span className='fw-semibold d-block' style={{ color: '#0f2540' }}>{post.title || `Artículo ${index + 1}`}</span>
                      <small className='wbl-sub'>{post.category || 'Sin categoría'}</small>
                    </td>
                    <td>
                      <span className='d-block'>{post.author || '-'}</span>
                      <small className='wbl-sub'>{post.role || ''}</small>
                    </td>
                    <td>
                      <span className='d-block' style={{ color: '#5b6577' }}>{post.published || '-'}</span>
                      <small className='wbl-sub'>{post.read_time || ''}</small>
                    </td>
                    <td>
                      <div className='d-flex align-items-center justify-content-end gap-1'>
                        <button className='wbl-act edit' title='Editar' onClick={() => openPost(index)}><i className='mdi mdi-square-edit-outline'></i></button>
                        <button className='wbl-act del' title='Eliminar' onClick={() => setConfirmTarget({ index, title: post.title })}><i className='mdi mdi-trash-can'></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr><td colSpan={5}>
                    <div className='wbl-empty'>
                      <i className='mdi mdi-newspaper-variant-outline' style={{ fontSize: 34, color: '#004991' }}></i>
                      <p className='mt-2 mb-0 fw-semibold' style={{ color: '#0f2540' }}>Aún no hay artículos</p>
                      <small>Crea el primero con “Nuevo artículo”.</small>
                    </div>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 ? (
            <div className='mt-3 d-flex flex-wrap align-items-center justify-content-center gap-2'>
              <button type='button' className='wbl-page' onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}><i className='mdi mdi-chevron-left'></i></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={`pg-${p}`} type='button' className={`wbl-page ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button type='button' className='wbl-page' onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}><i className='mdi mdi-chevron-right'></i></button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Modal artículo */}
      {postOpen && (
        <div className='wbl-modal-ovl' onMouseDown={closePost}>
          <div className='wbl-modal' onMouseDown={(e) => e.stopPropagation()}>
            <form onSubmit={savePost}>
              <div className='wbl-modal-head'>
                <h3 className='wbl-h2'>
                  <i className={`mdi ${postIndex == null ? 'mdi-plus-box' : 'mdi-square-edit-outline'} me-1`} style={{ color: '#004991' }}></i>
                  {postIndex == null ? 'Nuevo artículo' : 'Editar artículo'}
                </h3>
                <button type='button' className='wbl-close' onClick={closePost}><i className='mdi mdi-close'></i></button>
              </div>

              <div className='wbl-modal-body'>
                <div className='wbl-sec'>
                  <h4><i className='mdi mdi-card-text-outline' style={{ color: '#004991' }}></i>Datos del artículo</h4>
                  <div className='row g-3'>
                    <div className='col-md-5'>
                      <div className='wbl-media p-2'>
                        <img src={postThumb(postDraft)} alt='Vista previa' className='w-100 rounded' style={{ aspectRatio: '16/9', objectFit: 'cover' }} onError={onImgError} />
                      </div>
                      <label className='form-label mt-2'>Imagen del artículo</label>
                      <input type='file' className='form-control form-control-sm' accept='image/*' onChange={onPostImageChange} />
                    </div>
                    <div className='col-md-7'>
                      <div className='row g-3'>
                        <Field col='col-sm-5' label='Categoría' value={postDraft.category} placeholder='Productos' onChange={(e) => setDraft('category', e.target.value)} />
                        <Field col='col-sm-7' label='Etiqueta superior' value={postDraft.eyebrow} placeholder='Innovación técnica' onChange={(e) => setDraft('eyebrow', e.target.value)} />
                        <Field col='col-12' label='Título' value={postDraft.title} onChange={(e) => setDraft('title', e.target.value)} />
                        <Field col='col-12' label='Descripción (resumen en la tarjeta)' textarea rows={2} value={postDraft.description} onChange={(e) => setDraft('description', e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className='row g-3 mt-1'>
                    <Field col='col-md-5' label='Autor' value={postDraft.author} onChange={(e) => setDraft('author', e.target.value)} />
                    <Field col='col-md-3' label='Cargo o rol' value={postDraft.role} onChange={(e) => setDraft('role', e.target.value)} />
                    <Field col='col-md-2' label='Publicado' value={postDraft.published} placeholder='15 Oct 2026' onChange={(e) => setDraft('published', e.target.value)} />
                    <Field col='col-md-2' label='Lectura' value={postDraft.read_time} placeholder='8 min' onChange={(e) => setDraft('read_time', e.target.value)} />
                    <Field col='col-12' label='Intro o lead' textarea rows={2} value={postDraft.lead} onChange={(e) => setDraft('lead', e.target.value)} />
                  </div>
                </div>

                <div className='wbl-sec'>
                  <h4><i className='mdi mdi-text-box-outline' style={{ color: '#004991' }}></i>Contenido</h4>
                  <QuillFormGroup
                    col='col-12'
                    value={postDraft.content_html || ''}
                    eRef={quillRef.current}
                    onChange={(html) => { quillRef.current.current.value = html; setDraft('content_html', html) }}
                  />
                </div>

                <div className='wbl-sec' style={{ background: '#f7faff' }}>
                  <h4><i className='mdi mdi-star-outline' style={{ color: '#004991' }}></i>Nota técnica (recuadro destacado)</h4>
                  <div className='row g-3'>
                    <Field col='col-md-4' label='Título de la nota' value={postDraft.highlight_label} placeholder='Nota técnica' onChange={(e) => setDraft('highlight_label', e.target.value)} />
                    <Field col='col-md-8' label='Contenido de la nota' textarea rows={2} value={postDraft.highlight} onChange={(e) => setDraft('highlight', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className='wbl-modal-foot'>
                <button type='button' className='wbl-btn soft sm' onClick={closePost} disabled={saving}>Cancelar</button>
                <button type='submit' className='wbl-btn primary sm' disabled={saving}>
                  {saving ? <><span className='spinner-border spinner-border-sm'></span> Guardando...</> : <><i className='mdi mdi-content-save'></i> {postIndex == null ? 'Crear artículo' : 'Guardar cambios'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal configuración */}
      {configOpen && (
        <div className='wbl-modal-ovl' onMouseDown={closeConfig}>
          <div className='wbl-modal narrow' onMouseDown={(e) => e.stopPropagation()}>
            <form onSubmit={saveConfig}>
              <div className='wbl-modal-head'>
                <h3 className='wbl-h2'><i className='mdi mdi-cog-outline me-1' style={{ color: '#004991' }}></i>Configuración del blog</h3>
                <button type='button' className='wbl-close' onClick={closeConfig}><i className='mdi mdi-close'></i></button>
              </div>

              <div className='wbl-modal-body'>
                <div className='wbl-sec'>
                  <h4><i className='mdi mdi-image-outline' style={{ color: '#004991' }}></i>Portada</h4>
                  <div className='row g-3 align-items-center'>
                    <div className='col-lg-7'>
                      <div className='wbl-media'>
                        <img src={configDraft.hero_image_preview || IMAGE_FALLBACK} alt='Portada' className='w-100 d-block' style={{ aspectRatio: '16/9', objectFit: 'cover' }} onError={onImgError} />
                      </div>
                    </div>
                    <div className='col-lg-5'>
                      <label className='form-label'>Cambiar imagen</label>
                      <input type='file' className='form-control' accept='image/*' onChange={onHeroImageChange} />
                      <small className='wbl-sub d-block mt-2'>Imagen horizontal (16:9). Máx 4 MB.</small>
                    </div>
                  </div>
                </div>

                <div className='wbl-sec'>
                  <h4><i className='mdi mdi-format-title' style={{ color: '#004991' }}></i>Encabezado</h4>
                  <div className='row g-3'>
                    <Field col='col-md-4' label='Etiqueta' value={configDraft.hero_badge} placeholder='Blog Tuboplast' onChange={(e) => setCfg('hero_badge', e.target.value)} />
                    <Field col='col-md-8' label='Título' value={configDraft.hero_title} placeholder='Construyendo el futuro' onChange={(e) => setCfg('hero_title', e.target.value)} />
                    <Field col='col-12' label='Descripción' textarea rows={2} value={configDraft.hero_description} onChange={(e) => setCfg('hero_description', e.target.value)} />
                    <Field col='col-12' label='Título de la sección de artículos' value={configDraft.section_title} onChange={(e) => setCfg('section_title', e.target.value)} />
                  </div>
                </div>

                <div className='wbl-sec'>
                  <h4><i className='mdi mdi-email-fast-outline' style={{ color: '#004991' }}></i>Newsletter</h4>
                  <div className='row g-3'>
                    <Field col='col-md-4' label='Etiqueta' value={configDraft.newsletter_eyebrow} onChange={(e) => setCfg('newsletter_eyebrow', e.target.value)} />
                    <Field col='col-md-8' label='Título' value={configDraft.newsletter_title} onChange={(e) => setCfg('newsletter_title', e.target.value)} />
                    <Field col='col-12' label='Descripción' textarea rows={2} value={configDraft.newsletter_description} onChange={(e) => setCfg('newsletter_description', e.target.value)} />
                    <Field col='col-md-6' label='Placeholder del correo' value={configDraft.newsletter_placeholder} onChange={(e) => setCfg('newsletter_placeholder', e.target.value)} />
                    <Field col='col-md-6' label='Texto del botón' value={configDraft.newsletter_button_label} onChange={(e) => setCfg('newsletter_button_label', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className='wbl-modal-foot'>
                <button type='button' className='wbl-btn soft sm' onClick={closeConfig} disabled={saving}>Cancelar</button>
                <button type='submit' className='wbl-btn primary sm' disabled={saving}>
                  {saving ? <><span className='spinner-border spinner-border-sm'></span> Guardando...</> : <><i className='mdi mdi-content-save'></i> Guardar configuración</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirmTarget}
        title='Eliminar artículo'
        message={confirmTarget ? `Se eliminará "${confirmTarget.title || 'este artículo'}". Esta acción no se puede deshacer.` : ''}
        confirmLabel='Eliminar'
        variant='danger'
        loading={deleting}
        onConfirm={performDelete}
        onCancel={() => { if (!deleting) setConfirmTarget(null) }}
      />
    </div>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Adminto {...properties} title='Blog'>
      <Blog blog={properties.blog} />
    </Adminto>
  )
})
