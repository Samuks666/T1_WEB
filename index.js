import process from "node:process"
import express from "express"

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
