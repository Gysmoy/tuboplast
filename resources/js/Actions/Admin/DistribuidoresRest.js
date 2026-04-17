import BasicRest from "../BasicRest"

class DistribuidoresRest extends BasicRest {
  path = 'distribuidores'

  ubigeoOptions = async () => await this.simpleGet('/api/ubigeo/inei')
}

export default DistribuidoresRest

