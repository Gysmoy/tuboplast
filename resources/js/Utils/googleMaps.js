let googleMapsPromise = null

export const loadGoogleMapsApi = (apiKey) => {
  if (window.google?.maps) return Promise.resolve(window.google.maps)
  if (!apiKey) return Promise.reject(new Error('No se encontro GMAPS_API_KEY'))

  if (googleMapsPromise) return googleMapsPromise

  googleMapsPromise = new Promise((resolve, reject) => {
    const callbackName = '__initGoogleMapsApi'
    window[callbackName] = () => {
      delete window[callbackName]
      resolve(window.google.maps)
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&callback=${callbackName}`
    script.async = true
    script.defer = true
    script.onerror = () => {
      delete window[callbackName]
      reject(new Error('No se pudo cargar Google Maps'))
    }

    document.head.appendChild(script)
  })

  return googleMapsPromise
}
