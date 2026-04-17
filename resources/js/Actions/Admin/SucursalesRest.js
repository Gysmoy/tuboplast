import BasicRest from "../BasicRest"

class SucursalesRest extends BasicRest {
  path = 'sucursales'

  ubigeoOptions = async () => await this.simpleGet('/api/ubigeo/inei')
}

export default SucursalesRest

