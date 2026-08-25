import BasicRest from '../BasicRest'
import { Cookies } from 'sode-extend-react'
import { toast } from 'sonner'

class ProductSegmentsRest extends BasicRest {
  path = 'product-segments'

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
