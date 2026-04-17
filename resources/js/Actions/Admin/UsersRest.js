import BasicRest from "../BasicRest"
import RolesRest from "./RolesRest"

class UsersRest extends BasicRest {
  path = 'users'
  rolesRest = new RolesRest()

  rolesOptions = async () => await this.rolesRest.options()
}

export default UsersRest

