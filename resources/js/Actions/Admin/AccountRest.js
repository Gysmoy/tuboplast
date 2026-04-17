import { Cookies } from 'sode-extend-react'

class AccountRest {
  async updateProfile(payload) {
    const res = await fetch('/api/account/profile', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN'))
      },
      body: JSON.stringify(payload)
    })
    return await res.json()
  }

  async updatePassword(payload) {
    const res = await fetch('/api/account/password', {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN'))
      },
      body: JSON.stringify(payload)
    })
    return await res.json()
  }

  async updateAvatar(formData) {
    const res = await fetch('/api/account/avatar', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN'))
      },
      body: formData
    })
    return await res.json()
  }
}

export default new AccountRest()

