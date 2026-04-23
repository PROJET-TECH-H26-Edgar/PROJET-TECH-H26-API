import { Router } from "express";
import { RoleController } from "../controllers/roles.controller";
import { authenticate } from "../middleware/auth.middleware";

export const RoleRouter = (): Router => {
  const router = Router();
  const roleController = new RoleController();

  router.get("/", authenticate, roleController.getAll);

  return router;
};
