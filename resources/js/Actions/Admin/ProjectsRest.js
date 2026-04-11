import BasicRest from '../BasicRest'
import { Cookies, Notify } from 'sode-extend-react'

class ProjectsRest extends BasicRest {
  path = 'projects'

  save = async (project) => {
    try {
      const formData = new FormData()
      if (project.id) formData.append('id', project.id)
      formData.append('name', project.name)
      formData.append('short_description', project.short_description)
      formData.append('link', project.link ?? '')
      formData.append('status', project.status ? '1' : '0')

      if (project.image) {
        formData.append('image', project.image)
      }

      const res = await fetch(`/api/${this.path}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN'))
        },
        body: formData
      })

      const result = await res.json()
      if (!res.ok || result?.status !== 200) {
        throw new Error(result?.message || 'Ocurrio un error inesperado')
      }

      Notify.add({
        icon: '/assets/img/icon.svg',
        title: 'Correcto',
        body: result.message,
        type: 'success'
      })

      return result
    } catch (error) {
      Notify.add({
        icon: '/assets/img/icon.svg',
        title: 'Error',
        body: error.message,
        type: 'danger'
      })
      return null
    }
  }
}

export default ProjectsRest
