const drawSession = (data) => {
  const flatten = JSON.flatten(data)
  const tags = document.querySelectorAll('[session]')
  tags.forEach(e => {
    let attr = e.getAttribute('session');
    if (!attr.includes(':')) {
      e.textContent = flatten[attr]
      return
    }
    let parts = attr.split(';').map(x => x.trim())
    parts.forEach(part => {
      const [key, _pseudo] = part.split(':').map(x => x.trim())
      if (!_pseudo) {
        e.textContent = key
        return
      }
      const value = _pseudo.replace(/{([^}]+)}/g, (match, variable) => flatten[variable])
      e.setAttribute(key, value)
    })
  })
}

(async () => {
  let username = Cookies.get('SoDe-Auth-User')
  let token = Cookies.get('SoDe-Auth-Token')

  try {
    if (!token || !username) throw new Error('No tienes sesión')

    const { status, result } = await Fetch(`//auth.${DOMAIN}/api/auth/verify`, {
      method: 'POST',
      origin: 'same',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ service: SERVICE })
    })

    if (!status) throw new Error(result?.message ?? 'No existe una sesión activa')

    result.data.domain = DOMAIN
    drawSession(result.data)

    if (typeof $ != 'undefined') $('.loader-container').fadeOut(125)
    if (typeof onSessionReady != 'undefined') onSessionReady({
      ...result.data.person,
      username: result.data.username,
      relative_id: result.data.relative_id
    })

  } catch (error) {
    console.warn(error)
    Cookies.delete('SoDe-Auth-Token')
    if (SERVICE)
      location.href = `//auth.${DOMAIN}/?service=${SERVICE}&redirect=${encodeURIComponent(location.pathname + location.search)}`
  }
})()

document.querySelectorAll('#btn-signout').forEach(e => {
  e.onclick = () => {
    Cookies.delete('SoDe-Auth-User')
    Cookies.delete('SoDe-Auth-Token')
    location.href = `//auth.${DOMAIN}/?service=${SERVICE}`
  }
})
document.querySelectorAll('#btn-lockout').forEach(e => {
  e.onclick = () => {
    Cookies.delete('SoDe-Auth-Token')
    location.href = `//auth.${DOMAIN}/?service=${SERVICE}&redirect=${encodeURIComponent(location.pathname + location.search)}`
  }
})