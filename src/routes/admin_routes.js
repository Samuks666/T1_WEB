import { Router } from "express";
import { isAdmin } from "../middlewares/auth.js"; // Importa a trava de segurança
import {
  listSchedulling,
  showAdjustSchedule,
  adjustSchedule,
} from "../controllers/admin_controller.js";

const router = Router();

// Rota para VER a lista de agendamentos (Protegida)
router.get("/listSchedule", isAdmin, listSchedulling);

// Rota para VER a tela de configurar vagas (Protegida)
router.get("/adjustSchedule", isAdmin, showAdjustSchedule);

// Rota para SALVAR as vagas configuradas (Protegida)
router.post("/adjustSchedule", isAdmin, adjustSchedule);

export default router;