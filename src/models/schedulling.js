import mongoose from "mongoose";

const schedullingSchema = new mongoose.Schema(
  {
    data: {
      type: Date,
      required: true,
    },
    horario: {
      type: String,
      required: true,
      trim: true,
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Schedulling", schedullingSchema);
