import Schedule from "../models/schedule.js";
import Appointment from "../models/appointment.js";
import Client from "../models/client.js";

export const calculateDisponibility = async (dataConsulta, horario) => {
  const diasDaSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  const dataObj = new Date(dataConsulta);
  const diaSemanaNome = diasDaSemana[dataObj.getUTCDay()];

  const diaSemanaNum = dataObj.getUTCDay();

  if (diaSemanaNum === 0) {
    return 0;
  }

  const config = await Schedule.findOne({
    diaSemana: diaSemanaNome,
    horario,
  });

  const capacidadeConfigurada = config ? config.capacidade : 0;

  if (capacidadeConfigurada === 0) {
    return 0;
  }

  const agendamentosRealizados = await Appointment.countDocuments({
    data: dataConsulta,
    horario: horario,
  });

  const vagasDisponiveis = capacidadeConfigurada - agendamentosRealizados;

  return vagasDisponiveis > 0 ? vagasDisponiveis : 0;
};

export const processSchedulling = async (req, res) => {
  try {
    const { nome, cpf, data, horario } = req.body;

    if (!nome || !cpf || !data || !horario) {
      return res.status(400).send("Todos os campos são obrigatórios.");
    }

    const vagasRestantes = await calculateDisponibility(data, horario);
    if (vagasRestantes <= 0) {
      return res
      .status(400)
      .send(
        "Desculpe, este horário acabou de ser preenchido ou não possui vagas.",
      );
    }

    let cliente = await Client.findOne({ cpf });
    if (!cliente) {
      cliente = await Client.create({ nome, cpf });
    }

    const jaAgendado = await Appointment.exists({
      data,
      horario,
      cliente: cliente._id,
    });
    if (jaAgendado) {
      return res
      .status(409)
      .send("Você já possui um agendamento neste horário.");
    }

    const ocupadasAtuais = await Appointment.countDocuments({ data, horario });
    const capacidade = vagasRestantes + ocupadasAtuais;

    const MAX_TENTATIVAS = 3;
    let agendamento = null;

    for (let i = 0; i < MAX_TENTATIVAS && !agendamento; i++) {
      const ocupadas = new Set(
        await Appointment.distinct("vaga", { data, horario }),
      );

      let vagaLivre = null;
      for (let v = 1; v <= capacidade; v++) {
        if (!ocupadas.has(v)) {
          vagaLivre = v;
          break;
        }
      }

      if (vagaLivre === null) break;

      try {
        agendamento = await Appointment.create({
          data,
          horario,
          cliente: cliente._id,
          vaga: vagaLivre,
        });
      } catch (error) {
        if (error.code !== 11000) throw error;
      }
    }

    if (!agendamento) {
      return res
      .status(400)
      .send(
        "Desculpe, este horário acabou de ser preenchido ou não possui vagas.",
      );
    }

    return res.send("Agendamento realizado com sucesso!");
  } catch (error) {
    console.error("[Erro] ao processar agendamento: ", error);
    return res.status(500).send("[Erro] interno no servidor ao agendar.");
  }
};

export const renderClientPage = async (req, res) => {
  res.render("calendario");
};
