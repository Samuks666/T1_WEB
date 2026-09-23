# Trabalho 1 - Programação Web

Sistema de agendamento e gerenciamento desenvolvido como requisito para a disciplina de Programação Web. A aplicação adota a arquitetura MVC (Model-View-Controller) e utiliza renderização no lado do servidor com a engine Handlebars.

---

## Tecnologias Utilizadas

- **Ambiente de Execução:** Node.js
- **Framework Web:** Express
- **Template Engine:** Handlebars (.hbs)
- **Banco de Dados:** MongoDB (via Mongoose)
- **Infraestrutura:** Docker

---

## Pré-requisitos

Para executar este projeto localmente, é necessário ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Docker](https://www.docker.com/)
- _Opcional:_ MongoDB Compass e Postman (para testes de rotas e banco de dados)

---

## Instalação e Configuração

**1. Configurar o banco de dados (Docker)**

Inicie um contêiner do MongoDB executando o comando abaixo. Isso criará um volume local para persistência dos dados.

```bash
docker run -d \
  --name meu-mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest
```

**2. Instalar as dependências do projeto**

Na raiz do projeto, instale as dependências listadas no `package.json`:

```bash
npm install
```

**3. Instalar ferramentas auxiliares de desenvolvimento (Opcional - Arch Linux e Derivados)**

Para facilitar o debugging durante o desenvolvimento, você pode instalar o MongoDB Compass e o Postman:

```bash
paru -S mongodb-compass-bin postman-bin
# ou
yay -S mongodb-compass-bin postman-bin
```

---

## Execução

Após garantir que o contêiner do MongoDB está rodando e as dependências foram instaladas, inicie a aplicação:

```bash
npm start
```

Acesse a aplicação através do navegador no endereço padrão (geralmente `http://localhost:3000`, caso não tenha sido alterado nas configurações do servidor).

---

## Estrutura de Arquivos

Abaixo encontra-se a arquitetura de diretórios e arquivos principais do projeto:

```text
.
├── examples
│   ├── data_handling.js
│   ├── express.js
│   ├── handlebars.js
│   ├── http_server.js
│   ├── index.hbs
│   ├── main.hbs
│   ├── middlewares.js
│   ├── moongose.js
│   └── rest_api.js
├── src
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── admin_controller.js
│   │   └── schedulling_controller.js
│   ├── models
│   │   ├── client.js
│   │   ├── schedule.js
│   │   └── schedulling.js
│   ├── public
│   │   ├── css
│   │   │   └── style.css
│   │   └── js
│   │       └── client.js
│   ├── routes
│   │   ├── admin_routes.js
│   │   └── client_routes.js
│   └── views
│       ├── admin
│       │   ├── listSchedule.hbs
│       │   └── updateSchedule.hbs
│       ├── client
│       │   └── schedule.hbs
│       └── layouts
│           └── main.hbs
├── index.js
├── LICENSE
├── package.json
├── package-lock.json
└── README.md
```
