import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    diaSemana: {
      type: String,
      required: true,
      enum: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    },
    horario: {
      type: String,
      required: true,
      trim: true,
    },
    capacidade: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

scheduleSchema.index({ diaSemana: 1, horario: 1 }, { unique: true });

export default mongoose.model("Schedule", scheduleSchema);
