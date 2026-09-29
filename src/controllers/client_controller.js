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

const DIAS_JANELA = 7;

const MENSAGENS_ERRO = {
  campos: "Preencha nome, CPF e escolha um horário.",
  cpf: "CPF inválido. Informe os 11 dígitos.",
  data: "Data ou horário inválido.",
  passado: "Esse horário já passou.",
  janela: "Esse horário ainda não está aberto para agendamento.",
  indisponivel: "Esse horário não está disponível.",
  duplicado: "Você já possui um agendamento neste horário.",
  lotado: "Esse horário acabou de ser preenchido. Escolha outro horário.",
};

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

const normalizeCpf = (valor) => {
  const digitos = String(valor ?? "").replace(/\D/g, "");
  if (digitos.length !== 11) return null;
  return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const redirectErro = (res, codigo) =>
res.redirect("/?erro=" + encodeURIComponent(codigo));

const findOrCreateClient = async (nome, cpf) => {
  for (let tentativa = 0; tentativa < 2; tentativa += 1) {
    try {
      return await Client.findOneAndUpdate(
        { cpf },
        { $set: { nome } },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
      );
    } catch (error) {
      if (error?.code !== 11000) throw error;
    }
  }
  return Client.findOne({ cpf });
};

export const showCalendar = async (req, res) => {
  try {
    const configs = await Schedule.find({ capacidade: { $gt: 0 } })
    .sort({ horario: 1 })
    .lean();

    const hoje = new Date();
    const datas = [];

    for (let offset = 0; offset < DIAS_JANELA; offset += 1) {
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
      erro: MENSAGENS_ERRO[req.query.erro] || null,
    });
  } catch (error) {
    console.error("[cliente] erro ao montar calendário:", error);
    res.status(500).send("Erro ao consultar horários disponíveis.");
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { nome, cpf, slot } = req.body;

    const nomeLimpo = String(nome ?? "").trim();
    if (!nomeLimpo || !slot || !String(slot).includes("|")) {
      return redirectErro(res, "campos");
    }

    const cpfFormatado = normalizeCpf(cpf);
    if (!cpfFormatado) {
      return redirectErro(res, "cpf");
    }

    const [data, horario] = String(slot).split("|", 2);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(data) || !/^\d{2}:\d{2}$/.test(horario)) {
      return redirectErro(res, "data");
    }

    const date = dateFromKey(data);

    if (Number.isNaN(date.getTime()) || dataKey(date) !== data) {
      return redirectErro(res, "data");
    }

    if (dateTimeFor(date, horario) <= new Date()) {
      return redirectErro(res, "passado");
    }

    const inicioJanela = new Date();
    inicioJanela.setHours(0, 0, 0, 0);
    const fimJanela = new Date(inicioJanela);
    fimJanela.setDate(fimJanela.getDate() + DIAS_JANELA);
    if (date < inicioJanela || date >= fimJanela) {
      return redirectErro(res, "janela");
    }

    const diaSemana = DIAS[date.getDay()];
    const config = await Schedule.findOne({ diaSemana, horario }).lean();

    if (!config || config.capacidade <= 0) {
      return redirectErro(res, "indisponivel");
    }

    const cliente = await findOrCreateClient(nomeLimpo, cpfFormatado);

    const jaAgendado = await Appointment.exists({
      data,
      horario,
      cliente: cliente._id,
    });
    if (jaAgendado) {
      return redirectErro(res, "duplicado");
    }

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
      return redirectErro(res, "lotado");
    }

    return res.redirect("/?sucesso=1");
  } catch (error) {
    console.error("[cliente] erro ao realizar agendamento:", error);
    return res.status(500).send("Erro ao realizar o agendamento.");
  }
};
