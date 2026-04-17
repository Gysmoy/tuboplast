import { Fetch } from "sode-extend-react"
import { toast } from "sonner"

const notify = ({ title, body, type }) => {
  if (type === "success") return toast.success(title, { description: body })
  if (type === "danger") return toast.error(title, { description: body })
  return toast(title, { description: body })
}

const Logout = async () => {
  try {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    const { status, result } = await Fetch('/logout', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Accept': 'application/json'
      }
    })
    if (!status) throw new Error(result?.message || 'Ocurrio un error al cerrar sesion')
    notify({
      icon: '/assets/img/icon.svg',
      title: 'Cierre de sesion exitoso',
      body: 'Sera enviado a la pantalla de autenticacion',
      type: 'success'
    })
    location.href = '/login'
  } catch (error) {
    notify({
      icon: '/assets/img/icon.svg',
      title: 'Error',
      body: error.message,
      type: 'danger'
    })
  }
}

export default Logout
