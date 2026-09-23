import express from "express";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 2999;

// Configuração do Handlebars como view engine
// __dirname = pasta onde este arquivo .js está (examples/)
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    layoutsDir: __dirname, // main.hbs está na mesma pasta deste arquivo
    defaultLayout: "main", // nome do arquivo de layout, sem .hbs
  }),
);
app.set("view engine", "hbs");
app.set("views", __dirname); // index.hbs também está na mesma pasta

// Dados
const itens = [{ nome: "Item 0" }, { nome: "Item 2" }, { nome: "Item 3" }];

// Rota principal - renderiza a view index.hbs
app.get("/", (req, res) => {
  res.render("index", {
    titulo: "Exemplo Express + Handlebars",
    itens,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
