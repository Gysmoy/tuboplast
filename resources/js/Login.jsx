import { createRoot } from 'react-dom/client'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import CreateReactScript from './Utils/CreateReactScript'

const Login = ({ token, message }) => {
  document.title = 'Iniciar sesión | Tuboplast'

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
    <div className="text-start">
      <span className="mb-[18px] block h-1 w-12 bg-[#F7DD00]" />
      <h1 className="font-title text-2xl font-medium leading-tight text-[#004991] sm:text-3xl">
        Inicia sesión
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Accede al panel administrativo de Tuboplast.
      </p>

      <form onSubmit={onSubmit} className="mt-7 space-y-5">
        <div>
          <label htmlFor="login-email" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#004991]">
            Correo
          </label>
          <div className="relative mt-2">
            <i className="mdi mdi-email-outline pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-[#004991]"></i>
            <input
              id="login-email"
              name="email"
              type="email"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#004991] disabled:opacity-60"
              placeholder="correo@empresa.com"
              value={form.email}
              onChange={onChange}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="login-password" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#004991]">
            Contraseña
          </label>
          <div className="relative mt-2">
            <i className="mdi mdi-lock-outline pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-[#004991]"></i>
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 text-sm text-slate-800 outline-none transition focus:border-[#004991] disabled:opacity-60"
              placeholder="Ingresa tu contraseña"
              value={form.password}
              onChange={onChange}
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-slate-500 transition hover:text-[#004991]"
            >
              <i className={`mdi ${showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'} text-lg`}></i>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#004991] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#003b7a] disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? (
            <>
              <i className="mdi mdi-loading mdi-spin text-base"></i>
              Ingresando...
            </>
          ) : (
            <>
              Iniciar sesión
              <i className="mdi mdi-arrow-right text-base"></i>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(<Login {...properties} />)
})
