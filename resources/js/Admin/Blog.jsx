import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useRef, useState } from 'react'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'
import BlogRest from '../Actions/Admin/BlogRest.js'
import QuillFormGroup from '../Components/Form/QuillFormGroup.jsx'

const blogRest = new BlogRest()
const MAX_IMAGE_SIZE = 4 * 1024 * 1024
const IMAGE_FALLBACK = '/assets/img/landing/bg-main.png'

const createPost = (fallback = '/assets/img/categories/category-1.png') => ({
  category: '',
  title: '',
  description: '',
  eyebrow: '',
  author: '',
  role: '',
  published: '',
  read_time: '',
  lead: '',
  content_html: '',
  highlight_label: '',
  highlight: '',
  image_path: '',
  image_file: null,
  image_preview: '',
  image_fallback: fallback,
})

const createMostRead = () => ({
  number: '',
  title: '',
  category: '',
})

const normalizePosts = (items) => {
  const fallbacks = [
    '/assets/img/categories/category-1.png',
    '/assets/img/categories/category-2.png',
    '/assets/img/categories/category-3.png',
    '/assets/img/categories/category-1.png',
    '/assets/img/categories/category-2.png',
    '/assets/img/categories/category-3.png',
  ]

  const list = Array.isArray(items) ? items.slice() : []

  return list.map((item, index) => ({
    ...createPost(fallbacks[index] ?? fallbacks[0]),
    ...item,
    image_preview: item?.image_url || (item?.image_path ? `/storage/${item.image_path}` : ''),
    image_fallback: item?.image_fallback || fallbacks[index] || fallbacks[0],
  }))
}

const normalizeMostRead = (items) => {
  const list = Array.isArray(items) ? items.slice(0, 3) : []
  while (list.length < 3) list.push(createMostRead())

  return list.map((item) => ({
    ...createMostRead(),
    ...item,
  }))
}

const getHeroPreview = (blog) => blog?.hero_image_url || (blog?.hero_image ? `/storage/${blog.hero_image}` : '')

// ----------------------------------------------------------------- UI helpers
const SectionCard = ({ title, subtitle, icon, actions, children, col = 'col-12' }) => (
  <div className={col}>
    <div className='card border-0 shadow-sm h-100'>
      <div className='card-body'>
        {(title || actions) && (
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
        )}
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

const MediaUploader = ({ preview, onChange, hint, aspect = '16/10' }) => (
  <div className='row g-3 align-items-center'>
    <div className='col-lg-7'>
      <div className='rounded-3 overflow-hidden border bg-light'>
        <img src={preview || IMAGE_FALLBACK} alt='Vista previa' className='w-100 d-block' style={{ aspectRatio: aspect, objectFit: 'cover' }} />
      </div>
    </div>
    <div className='col-lg-5'>
      <label className='form-label small fw-semibold'>Cambiar imagen</label>
      <input type='file' className='form-control' accept='image/*' onChange={onChange} />
      <small className='text-muted d-block mt-2'>{hint}</small>
    </div>
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
    most_read: normalizeMostRead(initialBlog.most_read),
  }), [initialBlog])

  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [expandedPosts, setExpandedPosts] = useState({})
  const postsPerPage = 5
  const [currentPostPage, setCurrentPostPage] = useState(1)
  const [alert, setAlert] = useState(null)
  const contentRefs = useRef([])

  useEffect(() => {
    setForm(initialForm)
  }, [initialForm])

  const totalPostPages = Math.max(1, Math.ceil((form.posts?.length ?? 0) / postsPerPage))

  useEffect(() => {
    setCurrentPostPage((current) => Math.min(Math.max(current, 1), totalPostPages))
  }, [totalPostPages])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const showAlert = (message, type = 'danger') => {
    setAlert({ message, type })
  }

  const validateFile = (file, label) => {
    if (file.size > MAX_IMAGE_SIZE) {
      showAlert(`${label} supera el tamano permitido. El maximo es 4 MB.`)
      return false
    }

    setAlert(null)
    return true
  }

  const updatePost = (index, field, value) => {
    setForm((current) => {
      const next = [...(current.posts ?? [])]
      next[index] = { ...next[index], [field]: value }
      return { ...current, posts: next }
    })
  }

  const updateMostRead = (index, field, value) => {
    setForm((current) => {
      const next = [...(current.most_read ?? [])]
      next[index] = { ...next[index], [field]: value }
      return { ...current, most_read: next }
    })
  }

  const addPost = () => {
    setForm((current) => {
      const nextPosts = [createPost(), ...(current.posts ?? [])]
      return { ...current, posts: nextPosts }
    })
    setExpandedPosts((current) => {
      const next = { 0: true }
      Object.entries(current).forEach(([key, value]) => {
        next[Number(key) + 1] = value
      })
      return next
    })
    setCurrentPostPage(1)
  }

  const removePost = (index) => {
    setForm((current) => {
      const nextPosts = [...(current.posts ?? [])]
      if (nextPosts.length <= 1) return current
      nextPosts.splice(index, 1)

      return { ...current, posts: nextPosts }
    })

    setExpandedPosts((current) => {
      const next = {}
      Object.entries(current).forEach(([key, value]) => {
        const postIndex = Number(key)
        if (postIndex < index) {
          next[postIndex] = value
        } else if (postIndex > index) {
          next[postIndex - 1] = value
        }
      })

      return next
    })

    const nextLength = Math.max(1, (form.posts?.length ?? 1) - 1)
    setCurrentPostPage((current) => Math.min(current, Math.max(1, Math.ceil(nextLength / postsPerPage))))
  }

  const paginatedPosts = useMemo(() => {
    const start = (currentPostPage - 1) * postsPerPage
    return (form.posts ?? []).slice(start, start + postsPerPage)
  }, [currentPostPage, form.posts])

  const goToPostPage = (page) => {
    setCurrentPostPage(Math.min(Math.max(page, 1), totalPostPages))
  }

  const getContentRef = (index, initialValue = '') => {
    if (!contentRefs.current[index]) {
      contentRefs.current[index] = { current: { value: initialValue } }
    }

    return contentRefs.current[index]
  }

  const togglePost = (index) => {
    setExpandedPosts((current) => ({
      ...current,
      [index]: !current[index],
    }))
  }

  const onHeroImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!validateFile(file, 'La imagen principal del blog')) {
      event.target.value = ''
      return
    }

    setForm((current) => ({
      ...current,
      hero_image_file: file,
      hero_image_preview: URL.createObjectURL(file),
    }))
  }

  const onPostImageChange = (index, event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!validateFile(file, `La imagen del articulo ${index + 1}`)) {
      event.target.value = ''
      return
    }

    updatePost(index, 'image_file', file)
    updatePost(index, 'image_preview', URL.createObjectURL(file))
  }

  const save = async () => {
    if (saving) return
    setSaving(true)
    setAlert(null)

    const previousForm = form
    const result = await blogRest.save(form)

    if (result?.data) {
      const posts = normalizePosts(result.data.posts)
      posts.forEach((post, index) => {
        const previousPost = previousForm.posts?.[index] ?? {}
        if (previousPost.image_file instanceof File && previousPost.image_preview) {
          post.image_preview = previousPost.image_preview
        }
      })

      setForm({
        ...result.data,
        hero_image: result.data.hero_image || '',
        hero_image_file: null,
        hero_image_preview:
          previousForm.hero_image_file instanceof File && previousForm.hero_image_preview
            ? previousForm.hero_image_preview
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
        posts,
        most_read: normalizeMostRead(result.data.most_read),
      })
    }

    setSaving(false)
  }

  const tabs = [
    { key: 'hero', label: 'Portada', icon: 'mdi-image-multiple-outline' },
    { key: 'posts', label: 'Artículos', icon: 'mdi-newspaper-variant-outline' },
    { key: 'sidebar', label: 'Lateral', icon: 'mdi-view-sequential-outline' },
    { key: 'newsletter', label: 'Newsletter', icon: 'mdi-email-fast-outline' },
  ]

  return (
    <div className='row g-3'>
      {/* Toolbar */}
      <div className='col-12'>
        <div className='card border-0 shadow-sm'>
          <div className='card-body'>
            <div className='d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-lg-center'>
              <div className='d-flex align-items-center gap-2'>
                <span className='d-inline-flex align-items-center justify-content-center rounded-2 bg-primary text-white' style={{ width: 44, height: 44 }}>
                  <i className='mdi mdi-post-outline fs-22'></i>
                </span>
                <div>
                  <h4 className='mb-0'>Módulo Blog</h4>
                  <small className='text-muted'>Portada, artículos, más leídos y suscripción del blog público.</small>
                </div>
              </div>
              <div className='d-flex gap-2'>
                <a href='/blog' target='_blank' rel='noreferrer' className='btn btn-soft-primary'>
                  <i className='mdi mdi-open-in-new me-1'></i>Ver blog
                </a>
                <button type='button' className='btn btn-primary' onClick={save} disabled={saving}>
                  <i className='mdi mdi-content-save me-1'></i>{saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </div>

            <div className='d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mt-3 border-top pt-3'>
              <ul className='nav nav-pills flex-wrap gap-2 mb-0'>
                {tabs.map((tab) => (
                  <li className='nav-item' key={tab.key}>
                    <button
                      type='button'
                      className={`nav-link ${activeSection === tab.key ? 'active' : ''}`}
                      onClick={() => setActiveSection(tab.key)}
                    >
                      <i className={`mdi ${tab.icon} me-1`}></i>{tab.label}
                    </button>
                  </li>
                ))}
              </ul>
              <small className='text-muted'>{(form.posts?.length ?? 0)} artículo(s) publicados</small>
            </div>

            {alert?.message ? (
              <div className={`alert alert-${alert.type || 'danger'} mb-0 mt-3`} role='alert'>
                {alert.message}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {activeSection === 'hero' ? (
        <>
          <SectionCard title='Imagen de portada' subtitle='Cabecera del blog público' icon='mdi-image-outline'>
            <MediaUploader preview={form.hero_image_preview} onChange={onHeroImageChange} hint='Imagen horizontal. Tamaño máximo: 4 MB.' />
          </SectionCard>

          <SectionCard title='Encabezado del blog' subtitle='Texto principal de la portada' icon='mdi-format-title'>
            <div className='row g-3'>
              <FormField col='col-md-4' label='Etiqueta' value={form.hero_badge} onChange={(e) => updateField('hero_badge', e.target.value)} />
              <FormField col='col-md-8' label='Título' value={form.hero_title} onChange={(e) => updateField('hero_title', e.target.value)} />
              <FormField col='col-12' label='Descripción' textarea value={form.hero_description} onChange={(e) => updateField('hero_description', e.target.value)} />
              <FormField col='col-md-6' label='Título de la sección de artículos' value={form.section_title} onChange={(e) => updateField('section_title', e.target.value)} />
            </div>
          </SectionCard>
        </>
      ) : null}

      {activeSection === 'posts' ? (
        <SectionCard
          title='Artículos del blog'
          subtitle='Agrega, edita o quita artículos. La página pública se adapta automáticamente.'
          icon='mdi-newspaper-variant-multiple-outline'
          actions={(
            <button type='button' className='btn btn-primary btn-sm' onClick={addPost}>
              <i className='mdi mdi-plus me-1'></i>Agregar artículo
            </button>
          )}
        >
          <div className='d-flex flex-column gap-3'>
            {paginatedPosts.map((item, pageIndex) => {
              const index = (currentPostPage - 1) * postsPerPage + pageIndex
              const open = !!expandedPosts[index]
              return (
                <div className={`border rounded-3 overflow-hidden ${open ? 'border-primary' : ''}`} key={`blog-post-${index}`}>
                  <div className='d-flex align-items-center gap-2 p-2'>
                    <button
                      type='button'
                      className='d-flex flex-grow-1 align-items-center gap-3 border-0 bg-transparent p-1 text-start'
                      onClick={() => togglePost(index)}
                      aria-expanded={open}
                      aria-controls={`blog-post-panel-${index}`}
                    >
                      <span className='rounded-2 overflow-hidden bg-light flex-shrink-0' style={{ width: 56, height: 42 }}>
                        <img
                          src={item.image_preview || item.image_url || item.image_fallback || IMAGE_FALLBACK}
                          alt={item.title || `Artículo ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </span>
                      <span className='min-w-0'>
                        <span className='d-block fw-semibold text-truncate'>{item.title || `Artículo ${index + 1}`}</span>
                        <span className='d-block text-muted small'>{item.category || 'Sin categoría'}</span>
                      </span>
                    </button>
                    <button
                      type='button'
                      className='btn btn-sm btn-soft-danger'
                      title='Quitar artículo'
                      onClick={() => removePost(index)}
                      disabled={form.posts.length <= 1}
                    >
                      <i className='mdi mdi-trash-can'></i>
                    </button>
                    <button type='button' className='btn btn-sm btn-soft-secondary' onClick={() => togglePost(index)} aria-label='Expandir'>
                      <i className={`mdi mdi-chevron-${open ? 'up' : 'down'}`}></i>
                    </button>
                  </div>

                  <div id={`blog-post-panel-${index}`} className={open ? 'border-top' : 'd-none'}>
                    <div className='p-3'>
                      <div className='row g-3'>
                        <div className='col-md-5'>
                          <div className='rounded border bg-light p-2'>
                            <img
                              src={item.image_preview || item.image_url || item.image_fallback || IMAGE_FALLBACK}
                              alt={item.title || `Artículo ${index + 1}`}
                              className='w-100 rounded'
                              style={{ aspectRatio: '16/9', objectFit: 'cover' }}
                            />
                          </div>
                          <label className='form-label small fw-semibold mt-2'>Imagen del artículo</label>
                          <input type='file' className='form-control form-control-sm' accept='image/*' onChange={(event) => onPostImageChange(index, event)} />
                        </div>
                        <div className='col-md-7'>
                          <div className='row g-3'>
                            <FormField col='col-sm-5' label='Categoría' value={item.category} onChange={(e) => updatePost(index, 'category', e.target.value)} />
                            <FormField col='col-sm-7' label='Etiqueta superior' value={item.eyebrow} onChange={(e) => updatePost(index, 'eyebrow', e.target.value)} />
                            <FormField col='col-12' label='Título' value={item.title} onChange={(e) => updatePost(index, 'title', e.target.value)} />
                            <FormField col='col-12' label='Descripción (resumen en la tarjeta)' textarea rows={3} value={item.description} onChange={(e) => updatePost(index, 'description', e.target.value)} />
                          </div>
                        </div>
                      </div>

                      <div className='row g-3 mt-1'>
                        <FormField col='col-md-5' label='Autor' value={item.author} onChange={(e) => updatePost(index, 'author', e.target.value)} />
                        <FormField col='col-md-3' label='Cargo o rol' value={item.role} onChange={(e) => updatePost(index, 'role', e.target.value)} />
                        <FormField col='col-md-2' label='Publicado' value={item.published} onChange={(e) => updatePost(index, 'published', e.target.value)} />
                        <FormField col='col-md-2' label='Lectura' value={item.read_time} onChange={(e) => updatePost(index, 'read_time', e.target.value)} />
                        <FormField col='col-12' label='Intro o lead' textarea rows={3} value={item.lead} onChange={(e) => updatePost(index, 'lead', e.target.value)} />
                      </div>

                      <div className='mt-3'>
                        <QuillFormGroup
                          col='col-12'
                          label='Contenido completo'
                          value={item.content_html || ''}
                          eRef={getContentRef(index, item.content_html || '')}
                          onChange={(html) => updatePost(index, 'content_html', html)}
                        />
                        <small className='text-muted d-block mt-2'>
                          Usa <b>## Subtítulo</b> o <b>### Subtítulo</b> para los títulos azules. Para listas, cada línea con <b>-</b>. Para resaltar, <b>**negrita**</b> o <b>*cursiva*</b>.
                        </small>
                      </div>

                      <div className='mt-3 rounded-3 bg-light p-3'>
                        <div className='row g-3'>
                          <FormField col='col-md-4' label='Título de la nota técnica' value={item.highlight_label} onChange={(e) => updatePost(index, 'highlight_label', e.target.value)} />
                          <FormField col='col-md-8' label='Contenido de la nota técnica' textarea rows={3} value={item.highlight} onChange={(e) => updatePost(index, 'highlight', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {totalPostPages > 1 ? (
            <div className='mt-4 d-flex flex-wrap align-items-center justify-content-center gap-2'>
              <button type='button' className='btn btn-sm btn-light' onClick={() => goToPostPage(currentPostPage - 1)} disabled={currentPostPage <= 1}>
                Anterior
              </button>
              {Array.from({ length: totalPostPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={`admin-post-page-${page}`}
                  type='button'
                  className={`btn btn-sm ${currentPostPage === page ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => goToPostPage(page)}
                >
                  {page}
                </button>
              ))}
              <button type='button' className='btn btn-sm btn-light' onClick={() => goToPostPage(currentPostPage + 1)} disabled={currentPostPage >= totalPostPages}>
                Siguiente
              </button>
            </div>
          ) : null}
        </SectionCard>
      ) : null}

      {activeSection === 'sidebar' ? (
        <>
          <SectionCard col='col-12 col-xl-7' title='Más leídos' subtitle='Ranking que aparece en la barra lateral del blog' icon='mdi-trophy-outline'>
            <div className='table-responsive'>
              <table className='table table-sm align-middle mb-0'>
                <thead>
                  <tr className='text-muted' style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ width: 70 }}>N°</th>
                    <th>Título</th>
                    <th style={{ width: '32%' }}>Categoría</th>
                  </tr>
                </thead>
                <tbody>
                  {form.most_read.map((item, index) => (
                    <tr key={`most-read-${index}`}>
                      <td>
                        <input className='form-control form-control-sm text-center' value={item.number || ''} onChange={(e) => updateMostRead(index, 'number', e.target.value)} />
                      </td>
                      <td>
                        <input className='form-control form-control-sm' value={item.title || ''} onChange={(e) => updateMostRead(index, 'title', e.target.value)} />
                      </td>
                      <td>
                        <input className='form-control form-control-sm' value={item.category || ''} onChange={(e) => updateMostRead(index, 'category', e.target.value)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard col='col-12 col-xl-5' title='Portada lateral' subtitle='Usa la misma imagen del hero' icon='mdi-image-frame'>
            <MediaUploader preview={form.hero_image_preview} onChange={onHeroImageChange} hint='Comparte imagen con la portada. Tamaño máximo: 4 MB.' />
          </SectionCard>
        </>
      ) : null}

      {activeSection === 'newsletter' ? (
        <SectionCard title='Bloque de newsletter' subtitle='Tarjeta de suscripción en la barra lateral' icon='mdi-email-fast-outline'>
          <div className='row g-3'>
            <FormField col='col-md-4' label='Etiqueta' value={form.newsletter_eyebrow} onChange={(e) => updateField('newsletter_eyebrow', e.target.value)} />
            <FormField col='col-md-8' label='Título' value={form.newsletter_title} onChange={(e) => updateField('newsletter_title', e.target.value)} />
            <FormField col='col-12' label='Descripción' textarea value={form.newsletter_description} onChange={(e) => updateField('newsletter_description', e.target.value)} />
            <FormField col='col-md-6' label='Placeholder del correo' value={form.newsletter_placeholder} onChange={(e) => updateField('newsletter_placeholder', e.target.value)} />
            <FormField col='col-md-6' label='Texto del botón' value={form.newsletter_button_label} onChange={(e) => updateField('newsletter_button_label', e.target.value)} />
          </div>
        </SectionCard>
      ) : null}
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
