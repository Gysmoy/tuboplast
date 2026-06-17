import BasicRest from '../BasicRest'
import { Cookies } from 'sode-extend-react'
import { toast } from 'sonner'

const notify = ({ title, body, type }) => {
  if (type === 'success') return toast.success(title, { description: body })
  if (type === 'danger') return toast.error(title, { description: body })
  return toast(title, { description: body })
}

class ItemsRest extends BasicRest {
  path = 'items'

  save = async (item) => {
    try {
      const formData = new FormData()
      if (item.id) formData.append('id', item.id)
      formData.append('title', item.title ?? '')
      formData.append('sku', item.sku ?? '')
      formData.append('category_id', item.category_id ?? '')
      formData.append('segment', item.segment ?? '')
      formData.append('classification', item.classification ?? '')
      formData.append('type', item.type ?? '')
      formData.append('description', item.description ?? '')
      formData.append('price', item.price ?? '')
      formData.append('pressure', item.pressure ?? '')
      formData.append('diameter', item.diameter ?? '')
      formData.append('diameters', item.diameters ?? '')
      formData.append('status', item.status ? '1' : '0')

      if (item.image) {
        formData.append('image', item.image)
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
        throw new Error(result?.message || 'Ocurrio un error inesperado')
      }

      notify({ title: 'Correcto', body: result.message, type: 'success' })
      return result
    } catch (error) {
      notify({ title: 'Error', body: error.message, type: 'danger' })
      return null
    }
  }
}

export default ItemsRest
