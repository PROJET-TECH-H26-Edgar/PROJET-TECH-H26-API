import { Request, Response, NextFunction } from "express";
import { RoleService } from "../services/roles.services";

const roleService = new RoleService();

export class RoleController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roles = await roleService.getAllRoles();
      res.status(200).json(roles);
    } catch (error) {
      next(error);
    }
  };
}
