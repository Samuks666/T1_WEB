import Appointment from "../models/appointment.js";
import Client from "../models/client.js";
import Schedule from "../models/schedule.js";

const DIAS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

const dataKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const dateFromKey = (key) => new Date(`${key}T12:00:00`);

const formatDate = (date) =>
  new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

const dateTimeFor = (date, horario) => {
  const [h, m] = horario.split(":").map(Number);
  const result = new Date(date);
  result.setHours(h, m, 0, 0);
  return result;
};

export const showCalendar = async (req, res) => {
  try {
    const configs = await Schedule.find({ capacidade: { $gt: 0 } })
      .sort({ horario: 1 })
      .lean();

    const hoje = new Date();
    const datas = [];

    for (let offset = 0; offset < 7; offset += 1) {
      const date = new Date(hoje);
      date.setHours(12, 0, 0, 0);
      date.setDate(hoje.getDate() + offset);
      datas.push(date);
    }

    const keys = datas.map(dataKey);
    const ocupados = await Appointment.aggregate([
      { $match: { data: { $in: keys } } },
      {
        $group: {
          _id: { data: "$data", horario: "$horario" },
          total: { $sum: 1 },
        },
      },
    ]);

    const ocupacao = new Map(
      ocupados.map((item) => [
        `${item._id.data}|${item._id.horario}`,
        item.total,
      ]),
    );

    const dias = [];

    for (const date of datas) {
      const diaSemana = DIAS[date.getDay()];
      const key = dataKey(date);
      const horarios = configs
        .filter((config) => config.diaSemana === diaSemana)
        .map((config) => {
          const usados = ocupacao.get(`${key}|${config.horario}`) || 0;
          return {
            horario: config.horario,
            vagas: Math.max(config.capacidade - usados, 0),
            data: key,
            passado: dateTimeFor(date, config.horario) <= hoje,
          };
        })
        .filter((slot) => slot.vagas > 0 && !slot.passado);

      if (horarios.length > 0) {
        dias.push({
          data: key,
          rotulo: formatDate(date),
          horarios,
        });
      }
    }

    res.render("calendario", {
      dias,
      sucesso: req.query.sucesso === "1",
      erro: req.query.erro || null,
    });
  } catch (error) {
    console.error("[cliente] erro ao montar calendário:", error);
    res.status(500).send("Erro ao consultar horários disponíveis.");
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { nome, cpf, slot } = req.body;

    if (!nome || !cpf || !slot || !slot.includes("|")) {
      return res.redirect(
        "/?erro=" + encodeURIComponent("Preencha nome, CPF e escolha um horário."),
      );
    }

    const [data, horario] = slot.split("|", 2);
    const date = dateFromKey(data);
    if (Number.isNaN(date.getTime())) {
      return res.redirect("/?erro=" + encodeURIComponent("Data inválida."));
    }

    if (dateTimeFor(date, horario) <= new Date()) {
      return res.redirect(
        "/?erro=" + encodeURIComponent("Esse horário já passou."),
      );
    }

    const diaSemana = DIAS[date.getDay()];
    const config = await Schedule.findOne({ diaSemana, horario }).lean();

    if (!config || config.capacidade <= 0) {
      return res.redirect(
        "/?erro=" + encodeURIComponent("Esse horário não está disponível."),
      );
    }

    let cliente = await Client.findOne({ cpf: cpf.trim() });
    if (!cliente) {
      cliente = await Client.create({ nome: nome.trim(), cpf: cpf.trim() });
    } else if (cliente.nome !== nome.trim()) {
      cliente.nome = nome.trim();
      await cliente.save();
    }

    // A confirmação revalida a disponibilidade no banco.
    // Cada tentativa ocupa uma vaga numerada; o índice único evita overbooking.
    let criado = false;

    for (let vaga = 1; vaga <= config.capacidade; vaga += 1) {
      try {
        await Appointment.create({
          data,
          horario,
          cliente: cliente._id,
          vaga,
        });
        criado = true;
        break;
      } catch (error) {
        if (error?.code !== 11000) {
          throw error;
        }
      }
    }

    if (!criado) {
      return res.redirect(
        "/?erro=" +
          encodeURIComponent(
            "Esse horário acabou de ser preenchido. Escolha outro horário.",
          ),
      );
    }

    return res.redirect("/?sucesso=1");
  } catch (error) {
    console.error("[cliente] erro ao realizar agendamento:", error);
    return res.status(500).send("Erro ao realizar o agendamento.");
  }
};
