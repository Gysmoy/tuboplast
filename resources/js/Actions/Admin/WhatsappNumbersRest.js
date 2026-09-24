import BasicRest from "../BasicRest"
import { Fetch } from "sode-extend-react"
import { toast } from "sonner"

class WhatsappNumbersRest extends BasicRest {
  path = 'whatsapp-numbers'

  setPrimary = async ({ id }) => {
    try {
      const { status, result } = await Fetch(`/api/${this.path}/primary`, {
        method: 'PATCH',
        body: JSON.stringify({ id })
      })
      if (!status) throw new Error(result?.message || 'Ocurrió un error inesperado')
      toast.success('Correcto', { description: result.message })
      return true
    } catch (error) {
      toast.error('Error', { description: error.message })
      return false
    }
  }
}

export default WhatsappNumbersRest
