import { Router } from "express";
import { BorrowController } from "../controllers/borrow.controller";

export const BorrowRouter = (): Router => {
  const router = Router();
  const borrowController = new BorrowController();

  router.get("/", borrowController.getAll);
  // borrow.routes.ts
router.post("/", borrowController.create);
router.patch("/:idKey/complete", borrowController.complete);

  return router;
};
