import process from "node:process";
import express from "express";
import session from "express-session"; // <-- 1. Importação da sessão aqui no topo
import { engine } from "express-handlebars";
import { connectDB } from "./src/config/db.js";
import adminRoutes from "./src/routes/admin_routes.js";
import clientRoutes from "./src/routes/client_routes.js";

const port = process.env.PORT;

if (!port) {
  console.error("[application] PORT não definido em .env");
  process.exit(1);
}

// 2. O 'app' NASCE AQUI
const app = express(); 

// 3. AGORA SIM podemos configurar a sessão, logo após criar o app
app.use(session({
    secret: 'chave-secreta-petshop',
    resave: false,
    saveUninitialized: false
}));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public/"));

app.use(adminRoutes);
app.use(clientRoutes);

connectDB();

app.listen(port, () => {
  console.log(`[Servidor] rodando em http://localhost:${port}`);
});