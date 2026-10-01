import { Router } from "express";
import {
  listPetAgenda,
  showAdjustPetAgenda,
  adjustPetAgenda,
} from "../controllers/admin_controller.js";

const router = Router();

router.get("/listaPetAgenda", listPetAgenda);
router.get("/ajustaPetAgenda", showAdjustPetAgenda);
router.post("/ajustaPetAgenda", adjustPetAgenda);

export default router;
