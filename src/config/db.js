import process from "node:process"
import mongoose from "mongoose"

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("[banco de dados]: Conectado");
}).catch((err) => {
  console.log(`[banco de dados]: ${err}`);
});

