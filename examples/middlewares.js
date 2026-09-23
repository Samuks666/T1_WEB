// São funções que executam entre a requisição e a resposta
import express from "express";

const port = 1048;
const app = express();

app.use((req, res, next) => {
  console.log("Middleware Executado");
  next();
});

function newMiddleware(req, res, next) {
  console.log("Middleware Criado por Mim");
}

app.use(newMiddleware());

app.use((req, res, next) => {
  console.log(req.method);
  console.log(req.url);
});

// Devem ser escritos antes da rota
app.get("/", (req, res) => {
  res.send("Opa página principal");
});

app.use(express.json());

app.listen(port, () => {
  console.log(`[server] Iniciado na porta ${port}`);
});
