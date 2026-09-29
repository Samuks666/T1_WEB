import { Router } from "express";
import {
  showCalendar,
  createAppointment,
} from "../controllers/client_controller.js";

const router = Router();

router.get("/", showCalendar);
router.post("/agendar", createAppointment);

export default router;
