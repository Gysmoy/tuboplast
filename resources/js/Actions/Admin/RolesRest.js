import BasicRest from "../BasicRest"

class RolesRest extends BasicRest {
  path = 'roles'

  options = async () => await this.simpleGet('/api/roles/options')

  permissionsOptions = async () => await this.simpleGet('/api/permissions/options')
}

export default RolesRest

