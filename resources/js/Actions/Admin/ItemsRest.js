import BasicRest from '../BasicRest'
import { Cookies } from 'sode-extend-react'
import { toast } from 'sonner'

const notify = ({ title, body, type }) => {
  if (type === 'success') return toast.success(title, { description: body })
  if (type === 'danger') return toast.error(title, { description: body })
  return toast(title, { description: body })
}

const parseJsonResponse = async (res) => {
  const text = await res.text()
  const contentType = res.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return JSON.parse(text)
  }

  if (text.trim().startsWith('<')) {
    throw new Error('El servidor devolvio HTML en vez de JSON. Revisa si el archivo supera el limite de carga, si la sesion vencio o si ocurrio un error 500.')
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(text || 'El servidor devolvio una respuesta invalida.')
  }
}

class ItemsRest extends BasicRest {
  path = 'items'

  import = async ({ file, mode, imagesZip = null, sheetsZip = null }) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('mode', mode)
      if (imagesZip) formData.append('images_zip', imagesZip)
      if (sheetsZip) formData.append('sheets_zip', sheetsZip)

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
        throw new Error(result?.message || 'Ocurrio un error inesperado')
      }

      const data = result.data || {}
      const body = [
        `${data.created ?? 0} creados`,
        `${data.updated ?? 0} actualizados`,
        `${data.skipped ?? 0} omitidos`,
        `${data.images_associated ?? 0} imagenes asociadas`,
        `${data.images_ignored ?? 0} imagenes ignoradas`,
        `${data.sheets_associated ?? 0} fichas asociadas`,
        `${data.sheets_ignored ?? 0} fichas ignoradas`,
      ].join(' - ')

      notify({ title: 'Carga masiva completada', body, type: 'success' })
      return result
    } catch (error) {
      notify({ title: 'Error', body: error.message, type: 'danger' })
      return null
    }
  }

  importSheets = async ({ sheetsZip }) => {
    try {
      const formData = new FormData()
      formData.append('sheets_zip', sheetsZip)

      const res = await fetch(`/api/${this.path}/import-sheets`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN'))
        },
        body: formData
      })

      const result = await parseJsonResponse(res)
      if (!res.ok || result?.status !== 200) {
        throw new Error(result?.message || 'Ocurrio un error inesperado')
      }

      const data = result.data || {}
      const body = [
        `${data.matched_items ?? 0} productos con coincidencia`,
        `${data.sheets_associated ?? 0} fichas asociadas`,
        `${data.sheets_ignored ?? 0} fichas ignoradas`,
        `${data.not_found ?? 0} codigos sin producto`,
        `${data.ambiguous ?? 0} codigos ambiguos`,
      ].join(' - ')

      notify({ title: 'Carga de fichas completada', body, type: 'success' })
      return result
    } catch (error) {
      notify({ title: 'Error', body: error.message, type: 'danger' })
      return null
    }
  }

  importImages = async ({ imagesZip }) => {
    try {
      const formData = new FormData()
      formData.append('images_zip', imagesZip)

      const res = await fetch(`/api/${this.path}/import-images`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN'))
        },
        body: formData
      })

      const result = await parseJsonResponse(res)
      if (!res.ok || result?.status !== 200) {
        throw new Error(result?.message || 'Ocurrio un error inesperado')
      }

      const data = result.data || {}
      const body = [
        `${data.matched_items ?? 0} productos con coincidencia`,
        `${data.images_associated ?? 0} imagenes asociadas`,
        `${data.images_ignored ?? 0} imagenes ignoradas`,
        `${data.not_found ?? 0} codigos sin producto`,
        `${data.ambiguous ?? 0} codigos ambiguos`,
      ].join(' - ')

      notify({ title: 'Carga de imagenes completada', body, type: 'success' })
      return result
    } catch (error) {
      notify({ title: 'Error', body: error.message, type: 'danger' })
      return null
    }
  }

  save = async (item) => {
    try {
      const formData = new FormData()
      if (item.id) formData.append('id', item.id)

      const fields = [
        'title', 'sku', 'category_id', 'product_segment_id', 'product_line_id',
        'product_classification_id', 'product_family_id', 'product_type_id', 'segment', 'classification', 'famcons',
        'family', 'type', 'use_type', 'material', 'color', 'brand', 'unit',
        'masterpack', 'pieces', 'origin_country', 'description', 'price',
        'currency', 'pressure', 'diameter', 'nominal_diameter', 'diameters',
        'package_type', 'perishable', 'hazardous', 'product_height',
        'product_width', 'product_depth', 'product_weight', 'logistic_height',
        'logistic_width', 'logistic_depth', 'logistic_weight', 'warranty',
        'features', 'usage_recommendations', 'observations', 'usage_warning',
      ]
      fields.forEach((field) => formData.append(field, item[field] ?? ''))
      ;(item.product_segment_ids || []).forEach((id) => formData.append('product_segment_ids[]', id))
      formData.append('status', item.status ? '1' : '0')

      if (item.image) {
        formData.append('image', item.image)
      }
      if (item.technical_sheet) {
        formData.append('technical_sheet', item.technical_sheet)
      }

      const res = await fetch(`/api/${this.path}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN'))
        },
        body: formData
      })

      const result = await parseJsonResponse(res)
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
