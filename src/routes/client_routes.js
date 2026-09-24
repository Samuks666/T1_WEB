import { Router } from "express";
import {
  calculateDisponibility,
  processSchedulling,
} from "../controllers/schedulling_controller.js";

const router = Router();

router.get("/", calculateDisponibility);

router.post("/", processSchedulling);

export default router;
