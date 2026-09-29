import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    data: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    horario: { type: String, required: true, trim: true },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    vaga: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
);

// Cada vaga de um mesmo dia/horário só pode ser ocupada uma vez.
// Isso impede overbooking mesmo se duas confirmações chegarem quase juntas.
appointmentSchema.index(
  { data: 1, horario: 1, vaga: 1 },
  { unique: true },
);

export default mongoose.model("Appointment", appointmentSchema);
