import { createRoot } from 'react-dom/client'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import CreateReactScript from './Utils/CreateReactScript'

const Login = ({ token, message }) => {
  document.title = 'Login | DevEx Consulting'

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((old) => ({ ...old, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          _token: token
        })
      })

      const result = await response.json()

      if (!response.ok || result?.status !== 200) {
        throw new Error(result?.message || 'No se pudo iniciar sesion')
      }

      window.location.href = '/admin/'
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo iniciar sesion'
      })
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (!message) return

    Swal.fire({
      icon: 'info',
      title: 'Mensaje',
      text: message,
      timer: 3000,
      showConfirmButton: false
    })
  }, [message])

  return (
    <>
      <h4 className="fw-semibold mb-3 fs-18">Inicia sesion en tu cuenta</h4>

      <form onSubmit={onSubmit} className="text-start mb-3">
        <div className="mb-3">
          <label className="form-label" htmlFor="login-email">Correo</label>
          <input
            id="login-email"
            name="email"
            type="email"
            className="form-control"
            placeholder="correo@empresa.com"
            value={form.email}
            onChange={onChange}
            disabled={loading}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="login-password">Contrasena</label>
          <input
            id="login-password"
            name="password"
            type="password"
            className="form-control"
            placeholder="Ingresa tu contrasena"
            value={form.password}
            onChange={onChange}
            disabled={loading}
            required
          />
        </div>

        <div className="d-grid">
          <button className="btn btn-primary fw-semibold" type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar sesion'}
          </button>
        </div>
      </form>
    </>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(<Login {...properties} />)
})
