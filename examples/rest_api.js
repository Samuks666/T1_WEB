/*
 *
 * Exemplo simples de API REST com Node.js + Express
 *
 */

const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json()); // permite receber JSON no corpo das requisições

// Dados
let itens = [
  { id: 1, nome: "Item 1" },
  { id: 2, nome: "Item 2" },
];

// GET - listar todos os itens
app.get("/itens", (req, res) => {
  res.json(itens);
});

// GET - buscar um item pelo id
app.get("/itens/:id", (req, res) => {
  const item = itens.find((i) => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ erro: "Item não encontrado" });
  res.json(item);
});

// POST - criar um novo item
app.post("/itens", (req, res) => {
  const { nome } = req.body;
  if (!nome)
    return res.status(400).json({ erro: 'O campo "nome" é obrigatório' });

  const novoItem = {
    id: itens.length ? itens[itens.length - 1].id + 1 : 1,
    nome,
  };
  itens.push(novoItem);
  res.status(201).json(novoItem);
});

// PUT - atualizar um item existente
app.put("/itens/:id", (req, res) => {
  const item = itens.find((i) => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ erro: "Item não encontrado" });

  const { nome } = req.body;
  if (!nome)
    return res.status(400).json({ erro: 'O campo "nome" é obrigatório' });

  item.nome = nome;
  res.json(item);
});

// DELETE - remover um item
app.delete("/itens/:id", (req, res) => {
  const index = itens.findIndex((i) => i.id === Number(req.params.id));
  if (index === -1)
    return res.status(404).json({ erro: "Item não encontrado" });

  itens.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
