import BasicRest from '../BasicRest'
import { Cookies } from 'sode-extend-react'
import { toast } from 'sonner'

const notify = ({ title, body, type }) => {
  if (type === 'success') return toast.success(title, { description: body })
  if (type === 'danger') return toast.error(title, { description: body })
  return toast(title, { description: body })
}

class BlogRest extends BasicRest {
  path = 'blog'

  save = async (blog) => {
    try {
      const formData = new FormData()
      formData.append('id', '1')
      formData.append('status', '1')

      const scalarFields = [
        'hero_display_mode',
        'hero_badge',
        'hero_title',
        'hero_description',
        'section_title',
        'newsletter_eyebrow',
        'newsletter_title',
        'newsletter_description',
        'newsletter_placeholder',
        'newsletter_button_label',
      ]

      scalarFields.forEach((field) => {
        formData.append(field, blog[field] ?? '')
      })

      if (blog.hero_image_file instanceof File) {
        formData.append('hero_image_file', blog.hero_image_file)
      }
      formData.append('hero_image_existing', blog.hero_image || '')

      ;(blog.posts ?? []).forEach((item, index) => {
        formData.append(`posts[${index}][slug]`, item.slug ?? '')
        formData.append(`posts[${index}][category]`, item.category ?? '')
        formData.append(`posts[${index}][title]`, item.title ?? '')
        formData.append(`posts[${index}][description]`, item.description ?? '')
        formData.append(`posts[${index}][eyebrow]`, item.eyebrow ?? '')
        formData.append(`posts[${index}][author]`, item.author ?? '')
        formData.append(`posts[${index}][role]`, item.role ?? '')
        formData.append(`posts[${index}][published]`, item.published ?? '')
        formData.append(`posts[${index}][read_time]`, item.read_time ?? '')
        formData.append(`posts[${index}][lead]`, item.lead ?? '')
        formData.append(`posts[${index}][content_html]`, item.content_html ?? '')
        formData.append(`posts[${index}][highlight_label]`, item.highlight_label ?? '')
        formData.append(`posts[${index}][highlight]`, item.highlight ?? '')
        formData.append(`posts[${index}][image_path]`, item.image_path ?? '')

        if (item.image_file instanceof File) {
          formData.append(`posts[${index}][image_file]`, item.image_file)
        }
      })

      ;(blog.most_read ?? []).forEach((item, index) => {
        formData.append(`most_read[${index}][number]`, item.number ?? '')
        formData.append(`most_read[${index}][title]`, item.title ?? '')
        formData.append(`most_read[${index}][category]`, item.category ?? '')
      })

      const res = await fetch(`/api/${this.path}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN')),
        },
        body: formData,
      })

      const result = await res.json()
      if (!res.ok || result?.status !== 200) {
        throw new Error(result?.message || 'Ocurrio un error inesperado')
      }

      notify({
        title: 'Correcto',
        body: result.message,
        type: 'success',
      })

      return result
    } catch (error) {
      notify({
        title: 'Error',
        body: error.message,
        type: 'danger',
      })
      return null
    }
  }
}

export default BlogRest
