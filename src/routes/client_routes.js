import { Router } from "express";
import {
  calculateDisponibility,
  processSchedulling,
  renderClientPage 
} from "../controllers/schedulling_controller.js";

const router = Router();

// Aqui chamamos a função que possui o (req, res) e o res.render
router.get("/", renderClientPage);

// Rotas para mostrar as telas de login e cadastro
router.get("/login", (req, res) => res.render("login"));
router.get("/cadastro", (req, res) => res.render("cadastro"));

router.post("/", processSchedulling);

export default router;