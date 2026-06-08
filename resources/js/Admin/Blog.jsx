import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useRef, useState } from 'react'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'
import BlogRest from '../Actions/Admin/BlogRest.js'
import QuillFormGroup from '../Components/Form/QuillFormGroup.jsx'

const blogRest = new BlogRest()
const MAX_IMAGE_SIZE = 4 * 1024 * 1024

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
      const next = {}
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

  return (
    <div className='row g-3'>
      <div className='col-12'>
        <div className='card border-0 shadow-sm'>
          <div className='card-body d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-lg-center'>
            <div>
              <h4 className='mb-1'>Modulo Blog</h4>
              <p className='text-muted mb-0'>
                Edita portada, articulos, mas leidos y el bloque de suscripcion del blog publico.
              </p>
            </div>
            <div className='d-flex gap-2'>
              <a href='/blog' target='_blank' rel='noreferrer' className='btn btn-soft-primary'>
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
            <div className='d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-lg-center'>
              <div>
                <h5 className='mb-1'>Organizacion del modulo</h5>
                <p className='text-muted mb-0'>
                  Divide el contenido en cuatro bloques para editarlo con mas claridad.
                </p>
              </div>
              <div className='btn-group flex-wrap' role='tablist' aria-label='Secciones del blog'>
                <button type='button' className={`btn ${activeSection === 'hero' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveSection('hero')}>
                  Portada
                </button>
                <button type='button' className={`btn ${activeSection === 'posts' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveSection('posts')}>
                  Articulos
                </button>
                <button type='button' className={`btn ${activeSection === 'sidebar' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveSection('sidebar')}>
                  Lateral
                </button>
                <button type='button' className={`btn ${activeSection === 'newsletter' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveSection('newsletter')}>
                  Newsletter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeSection === 'hero' ? (
        <div className='col-12'>
          <div className='card border-0 shadow-sm'>
            <div className='card-body'>
              <h5 className='mb-3'>Portada del blog</h5>
              <div className='row g-3 align-items-start'>
                <div className='col-lg-7'>
                  <div className='rounded-3 border bg-light p-3'>
                    <img
                      src={form.hero_image_preview || '/assets/img/landing/bg-main.png'}
                      alt='Portada del blog'
                      className='w-100 rounded-3 object-fit-cover'
                      style={{ aspectRatio: '16/10', objectFit: 'cover' }}
                    />
                  </div>
                </div>
                <div className='col-lg-5'>
                  <label className='form-label'>Cambiar imagen</label>
                  <input type='file' className='form-control' accept='image/*' onChange={onHeroImageChange} />
                  <input type='hidden' value={form.hero_image || ''} readOnly />
                  <small className='text-muted d-block mt-2'>
                    Sube una imagen horizontal. Tamano maximo: 4 MB.
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className='card border-0 shadow-sm mt-3'>
            <div className='card-body'>
              <div className='row g-3'>
                <div className='col-md-4'>
                  <label className='form-label'>Etiqueta</label>
                  <input className='form-control' value={form.hero_badge || ''} onChange={(event) => updateField('hero_badge', event.target.value)} />
                </div>
                <div className='col-md-8'>
                  <label className='form-label'>Titulo</label>
                  <input className='form-control' value={form.hero_title || ''} onChange={(event) => updateField('hero_title', event.target.value)} />
                </div>
                <div className='col-12'>
                  <label className='form-label'>Descripcion</label>
                  <textarea className='form-control' rows='4' value={form.hero_description || ''} onChange={(event) => updateField('hero_description', event.target.value)} />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Titulo de seccion</label>
                  <input className='form-control' value={form.section_title || ''} onChange={(event) => updateField('section_title', event.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {activeSection === 'posts' ? (
        <div className='col-12'>
          <div className='card border-0 shadow-sm'>
            <div className='card-body'>
              <div className='d-flex align-items-center justify-content-between gap-3 mb-3'>
                <div>
                  <h5 className='mb-1'>Articulos del blog</h5>
                  <p className='text-muted mb-0'>Puedes agregar o quitar articulos segun necesites. La pagina publica se adapta automaticamente.</p>
                </div>
                <button type='button' className='btn btn-outline-primary' onClick={addPost}>
                  Agregar articulo
                </button>
              </div>

              <div className='row g-3'>
                {paginatedPosts.map((item, pageIndex) => {
                  const index = (currentPostPage - 1) * postsPerPage + pageIndex
                  return (
                  <div className='col-12' key={`blog-post-${index}`}>
                    <div className={`border rounded-3 h-100 ${expandedPosts[index] ? 'border-primary' : ''}`}>
                      <div className='d-flex align-items-stretch'>
                        <button
                          type='button'
                          className='d-flex flex-grow-1 align-items-center justify-content-between gap-3 border-0 bg-transparent p-3 text-start'
                          onClick={() => togglePost(index)}
                          aria-expanded={!!expandedPosts[index]}
                          aria-controls={`blog-post-panel-${index}`}
                        >
                          <div>
                            <div className='fw-semibold'>Articulo {index + 1}</div>
                            <div className='text-muted small'>
                              {item.title || 'Sin titulo'} · {item.category || 'Sin categoria'}
                            </div>
                          </div>
                          <div className='d-flex align-items-center gap-2'>
                            <span className='badge bg-light text-dark'>{item.category || 'Sin categoria'}</span>
                            <i className={`ti ti-chevron-${expandedPosts[index] ? 'up' : 'down'}`}></i>
                          </div>
                        </button>
                        <div className='d-flex align-items-center pe-3'>
                          <button
                            type='button'
                            className='btn btn-sm btn-outline-danger'
                            onClick={() => removePost(index)}
                            disabled={form.posts.length <= 1}
                          >
                            Quitar
                          </button>
                        </div>
                      </div>

                      <div id={`blog-post-panel-${index}`} className={`${expandedPosts[index] ? 'border-top' : 'd-none'}`}>
                        <div className='p-3'>
                          <div className='mb-3'>
                            <div className='rounded border bg-light p-2'>
                              <img
                                src={item.image_preview || item.image_url || item.image_fallback || '/assets/img/landing/bg-main.png'}
                                alt={item.title || `Articulo ${index + 1}`}
                                className='w-100 rounded'
                                style={{ aspectRatio: '16/7', maxHeight: '180px', objectFit: 'cover', objectPosition: 'center' }}
                              />
                            </div>
                          </div>
                          <div className='mb-3'>
                            <label className='form-label'>Imagen</label>
                            <input type='file' className='form-control' accept='image/*' onChange={(event) => onPostImageChange(index, event)} />
                          </div>
                          <div className='mb-3'>
                            <label className='form-label'>Categoria</label>
                            <input className='form-control' value={item.category || ''} onChange={(event) => updatePost(index, 'category', event.target.value)} />
                          </div>
                          <div className='mb-3'>
                            <label className='form-label'>Titulo</label>
                            <input className='form-control' value={item.title || ''} onChange={(event) => updatePost(index, 'title', event.target.value)} />
                          </div>
                          <div>
                            <label className='form-label'>Descripcion</label>
                            <textarea className='form-control' rows='4' value={item.description || ''} onChange={(event) => updatePost(index, 'description', event.target.value)} />
                          </div>
                          <div className='row g-3 mt-1'>
                            <div className='col-md-4'>
                              <label className='form-label'>Etiqueta superior</label>
                              <input className='form-control' value={item.eyebrow || ''} onChange={(event) => updatePost(index, 'eyebrow', event.target.value)} />
                            </div>
                            <div className='col-md-8'>
                              <label className='form-label'>Autor</label>
                              <input className='form-control' value={item.author || ''} onChange={(event) => updatePost(index, 'author', event.target.value)} />
                            </div>
                            <div className='col-md-6'>
                              <label className='form-label'>Cargo o rol</label>
                              <input className='form-control' value={item.role || ''} onChange={(event) => updatePost(index, 'role', event.target.value)} />
                            </div>
                            <div className='col-md-3'>
                              <label className='form-label'>Publicado</label>
                              <input className='form-control' value={item.published || ''} onChange={(event) => updatePost(index, 'published', event.target.value)} />
                            </div>
                            <div className='col-md-3'>
                              <label className='form-label'>Lectura</label>
                              <input className='form-control' value={item.read_time || ''} onChange={(event) => updatePost(index, 'read_time', event.target.value)} />
                            </div>
                            <div className='col-12'>
                              <label className='form-label'>Intro o lead</label>
                              <textarea className='form-control' rows='5' value={item.lead || ''} onChange={(event) => updatePost(index, 'lead', event.target.value)} />
                            </div>
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
                              Usa <b>## Subtitulo</b> o <b>### Subtitulo</b> para los titulos azules. Para listas, escribe cada linea con <b>-</b> al inicio. Para resaltar texto, usa <b>**negrita**</b> o <b>*cursiva*</b>.
                            </small>
                          </div>
                          <div className='mt-4 border-top pt-3'>
                            <div className='row g-3'>
                              <div className='col-md-4'>
                                <label className='form-label'>Titulo de la nota</label>
                                <input className='form-control' value={item.highlight_label || ''} onChange={(event) => updatePost(index, 'highlight_label', event.target.value)} />
                              </div>
                              <div className='col-12'>
                                <label className='form-label'>Contenido de la nota tecnica</label>
                                <textarea className='form-control' rows='5' value={item.highlight || ''} onChange={(event) => updatePost(index, 'highlight', event.target.value)} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
              </div>

              {totalPostPages > 1 ? (
                <div className='mt-4 d-flex flex-wrap align-items-center justify-content-center gap-2'>
                  <button
                    type='button'
                    className='btn btn-sm btn-light'
                    onClick={() => goToPostPage(currentPostPage - 1)}
                    disabled={currentPostPage <= 1}
                  >
                    Anterior
                  </button>

                  {Array.from({ length: totalPostPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={`admin-post-page-${page}`}
                      type='button'
                      className={`btn btn-sm ${currentPostPage === page ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => goToPostPage(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type='button'
                    className='btn btn-sm btn-light'
                    onClick={() => goToPostPage(currentPostPage + 1)}
                    disabled={currentPostPage >= totalPostPages}
                  >
                    Siguiente
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {activeSection === 'sidebar' ? (
        <>
          <div className='col-12 col-xl-5'>
            <div className='card border-0 shadow-sm h-100'>
              <div className='card-body'>
                <div className='d-flex align-items-center justify-content-between gap-3 mb-3'>
                  <div>
                    <h5 className='mb-1'>Mas leidos</h5>
                    <p className='text-muted mb-0'>Edita el ranking que aparece en la barra lateral.</p>
                  </div>
                </div>

                <div className='d-flex flex-column gap-3'>
                  {form.most_read.map((item, index) => (
                    <div key={`most-read-${index}`} className='border rounded-3 p-3'>
                      <div className='fw-semibold mb-3'>Elemento {index + 1}</div>
                      <div className='row g-3'>
                        <div className='col-md-3'>
                          <label className='form-label'>Numero</label>
                          <input className='form-control' value={item.number || ''} onChange={(event) => updateMostRead(index, 'number', event.target.value)} />
                        </div>
                        <div className='col-md-9'>
                          <label className='form-label'>Titulo</label>
                          <input className='form-control' value={item.title || ''} onChange={(event) => updateMostRead(index, 'title', event.target.value)} />
                        </div>
                        <div className='col-12'>
                          <label className='form-label'>Categoria</label>
                          <input className='form-control' value={item.category || ''} onChange={(event) => updateMostRead(index, 'category', event.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='col-12 col-xl-7'>
            <div className='card border-0 shadow-sm h-100'>
              <div className='card-body'>
                <h5 className='mb-3'>Imagen y portada lateral</h5>
                <div className='row g-3 align-items-start'>
                  <div className='col-lg-7'>
                    <div className='rounded-3 border bg-light p-3'>
                      <img
                        src={form.hero_image_preview || '/assets/img/landing/bg-main.png'}
                        alt='Portada del blog'
                        className='w-100 rounded-3 object-fit-cover'
                        style={{ aspectRatio: '16/10', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                  <div className='col-lg-5'>
                    <p className='text-muted mb-2'>
                      La portada lateral usa la misma imagen del hero para mantener una identidad visual consistente.
                    </p>
                    <label className='form-label'>Cambiar imagen principal</label>
                    <input type='file' className='form-control' accept='image/*' onChange={onHeroImageChange} />
                    <small className='text-muted d-block mt-2'>
                      Tamano maximo: 4 MB.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {activeSection === 'newsletter' ? (
        <div className='col-12'>
          <div className='card border-0 shadow-sm'>
            <div className='card-body'>
              <h5 className='mb-3'>Bloque de newsletter</h5>
              <div className='row g-3'>
                <div className='col-md-4'>
                  <label className='form-label'>Etiqueta</label>
                  <input className='form-control' value={form.newsletter_eyebrow || ''} onChange={(event) => updateField('newsletter_eyebrow', event.target.value)} />
                </div>
                <div className='col-md-8'>
                  <label className='form-label'>Titulo</label>
                  <input className='form-control' value={form.newsletter_title || ''} onChange={(event) => updateField('newsletter_title', event.target.value)} />
                </div>
                <div className='col-12'>
                  <label className='form-label'>Descripcion</label>
                  <textarea className='form-control' rows='3' value={form.newsletter_description || ''} onChange={(event) => updateField('newsletter_description', event.target.value)} />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Placeholder del correo</label>
                  <input className='form-control' value={form.newsletter_placeholder || ''} onChange={(event) => updateField('newsletter_placeholder', event.target.value)} />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Texto del boton</label>
                  <input className='form-control' value={form.newsletter_button_label || ''} onChange={(event) => updateField('newsletter_button_label', event.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
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
