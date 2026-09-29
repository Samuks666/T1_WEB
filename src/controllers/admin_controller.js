import Appointment from "../models/appointment.js";
import Schedule from "../models/schedule.js";

const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const HORARIOS = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

const formatDate = (key) => {
  const [y, m, d] = key.split("-");
  return `${d}/${m}/${y}`;
};

export const listPetAgenda = async (_req, res) => {
  try {
    const docs = await Appointment.find()
      .populate("cliente")
      .sort({ data: 1, horario: 1, vaga: 1 })
      .lean();

    const agendamentos = docs.map((item) => ({
      data: formatDate(item.data),
      horario: item.horario,
      nome: item.cliente?.nome || "Cliente não encontrado",
      cpf: item.cliente?.cpf || "-",
    }));

    res.render("admin/listSchedule", { agendamentos });
  } catch (error) {
    console.error("[admin] erro ao listar agenda:", error);
    res.status(500).send("Erro ao consultar a agenda do Pet Shop.");
  }
};

export const showAdjustPetAgenda = async (req, res) => {
  try {
    const docs = await Schedule.find().lean();
    const mapa = new Map(
      docs.map((item) => [
        `${item.diaSemana}|${item.horario}`,
        item.capacidade,
      ]),
    );

    const linhas = HORARIOS.map((horario) => ({
      horario,
      segunda: mapa.get(`Segunda|${horario}`) ?? 0,
      terca: mapa.get(`Terça|${horario}`) ?? 0,
      quarta: mapa.get(`Quarta|${horario}`) ?? 0,
      quinta: mapa.get(`Quinta|${horario}`) ?? 0,
      sexta: mapa.get(`Sexta|${horario}`) ?? 0,
      sabado: mapa.get(`Sábado|${horario}`) ?? 0,
    }));

    res.render("admin/adjustSchedule", {
      linhas,
      salvo: req.query.salvo === "1",
    });
  } catch (error) {
    console.error("[admin] erro ao carregar configuração:", error);
    res.status(500).send("Erro ao carregar a configuração da agenda.");
  }
};

export const adjustPetAgenda = async (req, res) => {
  try {
    const capacidades = req.body.capacidade || {};
    const operacoes = [];

    for (const dia of DIAS) {
      for (const horario of HORARIOS) {
        const valor = Number(capacidades?.[dia]?.[horario] ?? 0);
        const capacidade = Number.isFinite(valor) && valor >= 0 ? Math.floor(valor) : 0;

        operacoes.push({
          updateOne: {
            filter: { diaSemana: dia, horario },
            update: { $set: { capacidade } },
            upsert: true,
          },
        });
      }
    }

    await Schedule.bulkWrite(operacoes);
    res.redirect("/ajustaPetAgenda?salvo=1");
  } catch (error) {
    console.error("[admin] erro ao salvar configuração:", error);
    res.status(500).send("Erro ao salvar a configuração da agenda.");
  }
};
