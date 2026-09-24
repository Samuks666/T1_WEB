import process from "node:process";
import express from "express";
import { engine } from "express-handlebars";
import { connectDB } from "./src/config/db.js";
import { adminRoutes } from "./src/routes/admin_routes.js";
import { clientRoutes } from "./src/routes/client_routes.js";

const port = process.env.PORT;

if (!port) {
  console.error("[application] PORT não definido em .env");
  process.exit(1);
}

const app = express();

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
