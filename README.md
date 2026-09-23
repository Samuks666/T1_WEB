# Trabalho 1 de Programação WEB

---

## Instalação

Primeiro Configurar o Docker com mongodb

```bash docker run -d \
  --name meu-mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest'''
```

Segundo instalar dependencias do nodejs
`npm install`

## Arvore de Arquivos

├── examples
│   ├── data_handling.js
│   ├── express.js
│   ├── handlebars.js
│   ├── http_server.js
│   ├── index.hbs
│   ├── main.hbs
│   ├── middlewares.js
│   ├── moongose.js
│   └── rest_api.js
├── index.js
├── LICENSE
├── package.json
├── package-lock.json
├── README.md
└── src
├── config
│   └── db.js
├── controllers
│   ├── admin_controller.js
│   └── schedulling_controller.js
├── models
│   ├── client.js
│   ├── schedule.js
│   └── schedulling.js
├── public
│   ├── css
│   │   └── style.css
│   └── js
│   └── client.js
├── routes
│   ├── admin_routes.js
│   └── client_routes.js
└── views
├── admin
│   ├── listSchedule.hbs
│   └── updateSchedule.hbs
├── client
│   └── schedule.hbs
└── layouts
└── main.hbs

14 directories, 28 files

##
