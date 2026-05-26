import BasicRest from '../BasicRest'
import { Cookies } from 'sode-extend-react'
import { toast } from 'sonner'

const notify = ({ title, body, type }) => {
  if (type === 'success') return toast.success(title, { description: body })
  if (type === 'danger') return toast.error(title, { description: body })
  return toast(title, { description: body })
}

class CategoriesRest extends BasicRest {
  path = 'categories'

  save = async (category) => {
    try {
      const formData = new FormData()
      if (category.id) formData.append('id', category.id)
      formData.append('name', category.name)
      formData.append('description', category.description ?? '')
      formData.append('status', category.status ? '1' : '0')

      if (category.image) {
        formData.append('image', category.image)
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

      notify({
        title: 'Correcto',
        body: result.message,
        type: 'success'
      })
      return result
    } catch (error) {
      notify({
        title: 'Error',
        body: error.message,
        type: 'danger'
      })
      return null
    }
  }
}

export default CategoriesRest

