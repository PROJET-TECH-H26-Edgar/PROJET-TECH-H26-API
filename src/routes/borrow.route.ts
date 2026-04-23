import { Router } from "express";
import { BorrowController } from "../controllers/borrow.controller";
import { authenticate } from "../middleware/auth.middleware";

export const BorrowRouter = (): Router => {
  const router = Router();
  const borrowController = new BorrowController();

  router.get("/", authenticate, borrowController.getAll);
  router.post("/", authenticate, borrowController.create);
  router.patch("/:idKey/complete", authenticate, borrowController.complete);

  return router;
};
