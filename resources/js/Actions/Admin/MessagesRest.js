import { Fetch } from "sode-extend-react"
import { toast } from "sonner"
import BasicRest from "../BasicRest"

class MessagesRest extends BasicRest {
  path = 'messages'

  seen = async (id) => {
    try {
      const { status, result } = await Fetch('/api/messages/seen', {
        method: 'PATCH',
        body: JSON.stringify({ id })
      })

      if (!status) throw new Error(result?.message || 'No se pudo marcar el mensaje como leído')

      return true
    } catch (error) {
      toast.error('Error', { description: error.message })
      return false
    }
  }
}

export default MessagesRest
