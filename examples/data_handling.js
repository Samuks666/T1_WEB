import express from "express";

const app = express();

app.use(express.json());

// req.body
// Requisição POST
app.post("/users", (req, res) => {
  const newUser = req.body;
  res.send(newUser);
});

//req.params é usado por rotas dinâmicas
// Parâmetros de URL -- /users/:id -> /users/3 -- id = 3
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  res.send("Id do usuário é : " + id);
});

// req.query
// Query String -- /users?name=Samu
app.get("/searc", (req, res) => {
  res.send(req.query);
});

app.listen(1048, () => {
  console.log("Server Inicializado");
});
