import { Fetch } from "sode-extend-react"
import { toast } from "sonner"
import BasicRest from "../BasicRest"

class QuotesRest extends BasicRest {
  path = 'quotes'

  seen = async (id) => {
    try {
      const { status, result } = await Fetch('/api/quotes/seen', {
        method: 'PATCH',
        body: JSON.stringify({ id })
      })

      if (!status) throw new Error(result?.message || 'No se pudo marcar la cotización como leída')

      return true
    } catch (error) {
      toast.error('Error', { description: error.message })
      return false
    }
  }

  changeState = async (id, state, reason = null) => {
    try {
      const { status, result } = await Fetch('/api/quotes/state', {
        method: 'PATCH',
        body: JSON.stringify({ id, state, reason })
      })

      if (!status) throw new Error(result?.message || 'No se pudo actualizar el estado')

      toast.success('Estado actualizado', { description: result?.message })
      return true
    } catch (error) {
      toast.error('Error', { description: error.message })
      return false
    }
  }
}

export default QuotesRest
