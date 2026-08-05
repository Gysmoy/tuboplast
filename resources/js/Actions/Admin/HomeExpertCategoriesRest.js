import BasicRest from '../BasicRest'
import { Cookies } from 'sode-extend-react'
import { toast } from 'sonner'

class HomeExpertCategoriesRest extends BasicRest {
  path = 'home-expert-categories'

  save = async (category) => {
    try {
      const formData = new FormData()
      if (category.id) formData.append('id', category.id)

      ;['product_segment_id', 'title', 'sort_order'].forEach((field) => formData.append(field, category[field] ?? ''))
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

      toast.success('Correcto', { description: result.message })
      return result
    } catch (error) {
      toast.error('Error', { description: error.message })
      return null
    }
  }
}

export default HomeExpertCategoriesRest

