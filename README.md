# Trabalho 1 — Programação Web

Aplicação Web para agendamento de serviços de banho e tosa de um Pet Shop, conforme o enunciado da disciplina.

## Tecnologias obrigatórias utilizadas

- Node.js
- Express
- MongoDB com Mongoose
- Handlebars
- JavaScript
- HTML
- CSS

A comunicação dos formulários com o servidor usa submissão HTML (`<form>`), opção permitida pelo enunciado.

## Funcionalidades

### Cliente — `/`

- mostra os horários disponíveis dos próximos 7 dias;
- não mostra horários com capacidade 0;
- não mostra horários que já passaram;
- não mostra horários que já atingiram a capacidade;
- permite agendar informando nome e CPF;
- revalida a disponibilidade no momento da confirmação;
- impede overbooking com índice único por vaga no MongoDB.

### Agenda do Pet Shop — `/listaPetAgenda`

Exibe:

- data do atendimento;
- horário;
- nome do cliente;
- CPF.

### Configuração da agenda — `/ajustaPetAgenda`

Permite definir a capacidade simultânea de cada dia e horário. As configurações são armazenadas no MongoDB.

## Banco de dados

O projeto utiliza três coleções principais:

- `clients`: clientes identificados por nome e CPF;
- `schedules`: configuração semanal de dia, horário e capacidade;
- `appointments`: agendamentos, vinculados ao cliente e a uma vaga do horário.

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Copie o arquivo de exemplo de ambiente:

```bash
cp .env.example .env
```

3. Ajuste, se necessário, a URI do MongoDB no `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/petshop_web
```

4. Inicie o MongoDB e execute:

```bash
npm start
```

5. Acesse:

```text
http://localhost:3000
```

Antes de testar o agendamento, configure as capacidades em `/ajustaPetAgenda`.
