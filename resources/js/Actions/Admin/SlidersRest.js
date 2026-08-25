import BasicRest from '../BasicRest'
import { Cookies } from 'sode-extend-react'
import { toast } from 'sonner'

const notify = ({ title, body, type }) => {
  if (type === 'success') return toast.success(title, { description: body })
  if (type === 'danger') return toast.error(title, { description: body })
  return toast(title, { description: body })
}

class SlidersRest extends BasicRest {
  path = 'sliders'

  save = async (slider) => {
    try {
      const formData = new FormData()
      if (slider.id) formData.append('id', slider.id)

      const fields = [
        'placement',
        'item_id',
        'title',
        'description',
        'display_mode',
        'overlay_opacity',
        'primary_button_text',
        'primary_button_link',
        'secondary_button_text',
        'secondary_button_link',
        'metric_one_value',
        'metric_one_label',
        'metric_two_value',
        'metric_two_label',
        'sort_order',
      ]
      fields.forEach((field) => formData.append(field, slider[field] ?? ''))
      formData.append('status', slider.status ? '1' : '0')

      if (slider.image) {
        formData.append('image', slider.image)
      }

      const res = await fetch(`/api/${this.path}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN'))
        },
        body: formData
      })

      const result = await res.json()
      if (!res.ok || result?.status !== 200) {
        throw new Error(result?.message || 'Ocurrió un error inesperado')
      }

      notify({ title: 'Correcto', body: result.message, type: 'success' })
      return result
    } catch (error) {
      notify({ title: 'Error', body: error.message, type: 'danger' })
      return null
    }
  }
}

export default SlidersRest
