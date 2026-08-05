import ProductTaxonomyRest from './ProductTaxonomyRest'
import { Cookies } from 'sode-extend-react'
import { toast } from 'sonner'

class ProductSegmentsRest extends ProductTaxonomyRest {
  constructor() {
    super('product-segments')
  }

  save = async (segment) => {
    try {
      const formData = new FormData()
      if (segment.id) formData.append('id', segment.id)

      ;['name', 'description', 'featured_order'].forEach((field) => {
        formData.append(field, segment[field] ?? '')
      })

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

export default ProductSegmentsRest
