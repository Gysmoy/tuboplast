import BasicRest from "../BasicRest"
import { Cookies } from "sode-extend-react"
import { toast } from "sonner"

const parseJsonResponse = async (res) => {
  const text = await res.text()
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return JSON.parse(text)
  throw new Error(text || 'El servidor devolvió una respuesta inválida.')
}

class DistribuidoresRest extends BasicRest {
  path = 'distribuidores'

  ubigeoOptions = async () => await this.simpleGet('/api/ubigeo/inei')

  import = async ({ file }) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`/api/${this.path}/import`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN'))
        },
        body: formData
      })

      const result = await parseJsonResponse(res)
      if (!res.ok || result?.status !== 200) {
        throw new Error(result?.message || 'Ocurrió un error inesperado')
      }

      const data = result.data || {}
      toast.success('Carga masiva completada', {
        description: `${data.created ?? 0} creados - ${data.updated ?? 0} actualizados - ${data.skipped ?? 0} omitidos`
      })
      return result
    } catch (error) {
      toast.error('Error', { description: error.message })
      return null
    }
  }
}

export default DistribuidoresRest
