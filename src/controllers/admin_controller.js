import Schedulling from "../models/schedulling.js";
import Schedule from "../models/schedule.js";

export const listSchedulling = async (req, res) => {
    try {
        // SOLUÇÃO: Criamos a variável 'agendamentos' antes de usá-la.
        // Temporariamente, colocamos dados falsos para você testar o visual da sua tabela.
        const agendamentos = [
            { data: "2026-10-15", hora: "08:00", nome: "Grégori Oliveira", cpf: "123.456.789-00" }
        ];

        /* Aviso para o seu colega de backend:
           Futuramente, apague a lista acima e busque do banco de dados usando o Mongoose, ex:
           const agendamentos = await Agendamento.find().lean();
        */

        // Agora a variável existe e a tela vai abrir normalmente
        res.render("admin/listSchedule", { agendamentos });
        
    } catch (error) {
        console.error("[Erro] ao listar agendamentos: ", error);
        res.status(500).send("Erro no servidor");
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
