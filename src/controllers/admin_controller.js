import Schedulling from "../models/schedulling.js";
import Schedule from "../models/schedule.js";

export const listSchedulling = async (req, res) => {
  try {
    const schedulling = await Schedulling.find().populate("cliente").lean();
    res.render("admin/listSchedule", { agendamentos });
  } catch (error) {
    console.error("[Erro] ao listar agendamentos: ", error);
    res.status(500).send("[Erro] interno do servidor");
  }
};

export const showAdjustSchedule = async (req, res) => {
  try {
    const config = await Schedule.find().lean();

    res.render("admin/adjustSchedule", { config });
  } catch (error) {
    console.error("[Erro] ao carregar página de ajuste: ", error);
    res.status(500).send("[Erro] no servidor");
  }
};

export const adjustSchedule = async (req, res) => {
  try {
    const { diaSemana, horario, capacidade } = req.body;

    await Schedule.findOneAndUpdate(
      { diaSemana, horario },
      { capacidade: Number(capacidade) },
      { upsert: true, new: true },
    );

    res.redirect("/adjustSchedule");
  } catch (error) {
    console.error("[Erro] ao fazer ajuste: ", error);
    res.status(500).send("[Erro] no servidor");
  }
};
