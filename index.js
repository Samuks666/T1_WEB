import process from "node:process"
import express from "express"
import { connectDB } from "./src/config/db.js"

const port = process.env.PORT;

if (!port) {
  console.error("[application] PORT não definido em .env")
  process.exit(1);
}

const app = express();

connectDB();

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
