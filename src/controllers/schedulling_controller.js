import Schedule from "../models/schedule.js";
import Schedulling from "../models/schedulling.js";
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

  const agendamentosRealizados = await Schedulling.countDocuments({
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

    const vagasRestantes = await calcularVagasDisponiveis(data, horario);

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

    await Schedulling.create({
      data,
      horario,
      cliente: cliente._id,
    });

    return res.send("Agendamento realizado com sucesso!");
  } catch (error) {
    console.error("[Erro] ao processar agendamento: ", error);
    return res.status(500).send("[Erro] interno no servidor ao agendar.");
  }
};
