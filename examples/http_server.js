import http from "node:http";

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.end("Hello World");
  }
});

server.listen(1048, () => {
  console.log("Servidor executando em http://localhost:1048");
});
