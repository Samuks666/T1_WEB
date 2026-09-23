import process from "node:process";
import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("[banco de dados]: MONGODB_URI não foi definida no arquivo .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("[banco de dados]: Conectado com sucesso");
  } catch (err) {
    console.error(`[banco de dados]: Falha ao conectar: ${err.message}`);
    process.exit(1);
  }
};
