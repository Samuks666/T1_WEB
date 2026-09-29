import process from "node:process";
import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI não definida no arquivo .env");
  }

  await mongoose.connect(uri);
  console.log("[banco] MongoDB conectado");
};
