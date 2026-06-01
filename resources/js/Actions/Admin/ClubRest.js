import { Fetch } from "sode-extend-react"
import { toast } from "sonner"
import BasicRest from "../BasicRest"

class ClubRest extends BasicRest {
  path = 'club'

  seen = async (id) => {
    try {
      const { status, result } = await Fetch('/api/club/seen', {
        method: 'PATCH',
        body: JSON.stringify({ id })
      })

      if (!status) throw new Error(result?.message || 'No se pudo marcar la solicitud como leída')

      return true
    } catch (error) {
      toast.error('Error', { description: error.message })
      return false
    }
  }
}

export default ClubRest
