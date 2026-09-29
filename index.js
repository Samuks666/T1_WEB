import process from "node:process";
import express from "express";
import { engine } from "express-handlebars";
import { connectDB } from "./src/config/db.js";
import clientRoutes from "./src/routes/client_routes.js";
import adminRoutes from "./src/routes/admin_routes.js";

const app = express();
const port = Number(process.env.PORT || 3000);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

app.use(clientRoutes);
app.use(adminRoutes);

await connectDB();

app.listen(port, () => {
  console.log(`[servidor] http://localhost:${port}`);
});
