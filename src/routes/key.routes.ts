import { Router } from "express";
import { KeyController } from "../controllers/key.controller";

export const keyRouter = (): Router => {
  const router = Router();
  const keyController = new KeyController();

  router.get("/", keyController.getAll);
  router.get("/:id", keyController.getById);
  router.post("/create", keyController.createKey);
  router.patch("/:id/status", keyController.updateStatus);
  router.patch("/rfid/:rfidUid/return", keyController.returnByRfid);
  router.delete("/:id", keyController.deleteKey);

  return router;
};
