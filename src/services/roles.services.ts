import { RoleRepository } from "../repositories/roles.repository";

const roleRepository = new RoleRepository();
export class RoleService {
  async getAllRoles() {
    return await roleRepository.findAll();
  }
}
