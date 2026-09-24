import BasicRest from '../BasicRest'
import { Cookies } from 'sode-extend-react'
import { toast } from 'sonner'

class ProductSegmentsRest extends BasicRest {
  path = 'product-segments'

  save = async (segment) => {
    try {
      const formData = new FormData()
      if (segment.id) formData.append('id', segment.id)
      formData.append('name', segment.name ?? '')
      formData.append('description', segment.description ?? '')
      formData.append('featured_order', segment.featured_order ?? 0)
      formData.append('featured', segment.featured ? '1' : '0')
      formData.append('status', segment.status ? '1' : '0')

      if (segment.image) {
        formData.append('image', segment.image)
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

      toast.success('Correcto', { description: result.message })
      return result
    } catch (error) {
      toast.error('Error', { description: error.message })
      return null
    }
  }

  boolean = async ({ id, field, value }, showNotification = true) => {
    try {
      const res = await fetch(`/api/${this.path}/boolean`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN'))
        },
        body: JSON.stringify({ id, field, value })
      })
      const result = await res.json()
      if (!res.ok || result?.status !== 200) throw new Error(result?.message || 'Ocurrió un error inesperado')
      if (showNotification) toast.success('Correcto', { description: result.message })
      return true
    } catch (error) {
      toast.error('Error', { description: error.message })
      return false
    }
  }
}

export default ProductSegmentsRest
