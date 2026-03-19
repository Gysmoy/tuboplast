const DOMAIN = 'sode.me'
const SERVICE = null

// Configuración de solicitudes Fetch
FetchParams = {
    headers: {
        'SoDe-Auth-User': Cookies.get('SoDe-Auth-User'),
        'SoDe-Auth-Token': Cookies.get('SoDe-Auth-Token')
    }
}