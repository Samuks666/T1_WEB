import { Router } from "express";
import {
  listSchedulling,
  showAdjustSchedule,
  adjustSchedule,
} from "../controllers/admin_controller.js";

const router = Router();

router.get("/listSchedule", listSchedulling);

router.get("/adjustSchedule", showAdjustSchedule);

router.post("/adjustSchedule", adjustSchedule);

export default router;
