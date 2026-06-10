import BasicRest from '../BasicRest'
import { Cookies } from 'sode-extend-react'
import { toast } from 'sonner'

const notify = ({ title, body, type }) => {
  if (type === 'success') return toast.success(title, { description: body })
  if (type === 'danger') return toast.error(title, { description: body })
  return toast(title, { description: body })
}

class AboutRest extends BasicRest {
  path = 'about'

  save = async (about) => {
    try {
      const formData = new FormData()
      formData.append('id', '1')
      formData.append('status', '1')

      const scalarFields = [
        'family_eyebrow',
        'family_title',
        'family_lead',
        'family_paragraph_1',
        'family_paragraph_2',
        'family_metric_value',
        'family_metric_label',
        'family_aside_1_title',
        'family_aside_1_text',
        'family_aside_2_title',
        'family_aside_2_text',
        'mission_eyebrow',
        'mission_title',
        'mission_text',
        'vision_eyebrow',
        'vision_title',
        'vision_text',
        'policy_eyebrow',
        'policy_title',
        'policy_scope_eyebrow',
        'policy_scope_title',
        'policy_scope_paragraph_1',
        'policy_scope_paragraph_2',
        'policy_commitment_text',
        'policy_certifications_title',
        'policy_description',
      ]

      scalarFields.forEach((field) => {
        formData.append(field, about[field] ?? '')
      })

      if (about.family_image_file instanceof File) {
        formData.append('family_image_file', about.family_image_file)
      }
      formData.append('family_image_existing', about.family_image || '')

      if (about.policy_image_file instanceof File) {
        formData.append('policy_image_file', about.policy_image_file)
      }
      formData.append('policy_image_existing', about.policy_image || '')

      ;(about.family_values ?? []).forEach((item, index) => {
        formData.append(`family_values[${index}]`, item ?? '')
      })

      ;(about.policy_bullets ?? []).forEach((item, index) => {
        formData.append(`policy_bullets[${index}]`, item ?? '')
      })

      ;(about.certifications ?? []).forEach((item, index) => {
        formData.append(`certifications[${index}][title]`, item.title ?? '')
        formData.append(`certifications[${index}][description]`, item.description ?? '')
        formData.append(`certifications[${index}][image_path]`, item.image_path ?? '')
        formData.append(`certifications[${index}][file_path]`, item.file_path ?? '')
        formData.append(`certifications[${index}][file_delete]`, item.file_delete ? '1' : '0')

        if (item.image_file instanceof File) {
          formData.append(`certifications[${index}][image_file]`, item.image_file)
        }

        if (item.file_file instanceof File) {
          formData.append(`certifications[${index}][file_file]`, item.file_file)
        }
      })

      const res = await fetch(`/api/${this.path}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN')),
        },
        body: formData,
      })

      const result = await res.json()
      if (!res.ok || result?.status !== 200) {
        throw new Error(result?.message || 'Ocurrio un error inesperado')
      }

      notify({
        title: 'Correcto',
        body: result.message,
        type: 'success',
      })
      return result
    } catch (error) {
      notify({
        title: 'Error',
        body: error.message,
        type: 'danger',
      })
      return null
    }
  }
}

export default AboutRest
