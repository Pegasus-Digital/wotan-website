# Wotan Brindes (Website + Admin)

- [Wotan Brindes](#wotan-brindes-website--admin)
  - [Quick Start](#quick-start)
    - [Clone](#clone)
      - [Local installation steps:](#local-installation-steps)
      - [Running on a Server:](#running-on-a-server)
  - [Stack](#stack)
    - [Next.js](#nextjs-front-end)
    - [PayloadCMS](#payload-back-end)
      - [Collections](#collections)
      - [Globals](#globals)
  - [Features](#features)
    - [Access control](#access-control)

## Quick Start

To spin up this example locally or on a server, follow these steps:

### Clone

You can clone this repo to your own computer/server and play around super easily.

To do so, you'll need the following software:

- Yarn or NPM - **yarn may be easier to set up because it solves packages conflicts easier**
- NodeJS version 10+
- A MongoDB Database - **IMPORTANT: you need to have MongoDB running locally, or in a server in order to test this repo locally.**

#### Local installation steps:

**1. Clone the repo by running the following command at your terminal:**

```bash
git clone git@github.com:pegasus-digital/next-payload-mono
```

**2.Navigate to folder and install dependencies**

Type `cd ./next-payload-mono` and then `yarn install` to add all required dependencies.

**3.Duplicate the example `.env` file and fill in your own values**

Type `cp .env.example .env` in your terminal to make a copy of the example `.env` file, and then edit that file to fill in your own values.

Typically, the only line that you'll need to change within your new `.env` for local development is the `DATABASE_URI` value.

**4.Fire up the development server**

Finally, type `yarn dev` to start up the server and see it in action!

#### Running on a Server

**1.Same steps as above up until No.3**

On your server terminal, you should follow the same steps as above, cloning the repo and changing enviroinment variables to your own, after that you are ready to continue in the next step.

**2.Build and Serve**

Type `yarn build` in the terminal, following by `yarn serve`.

This should fire up the server and host it under the `SERVER_URL` variable `.env` if you have setted up the DNS correctly.

**3.Process Manager**

Use a process manager such as [PM2](https://pm2.keymetrics.io/) to keep the expresss server running on the machine.

## Stack

### Next.js Front-end

Designed with the [Pegasus-ui]() package, this repo includes a production-ready front-end built with the [Next.js App Router](https://nextjs.org), served right alongside Payload in a single Express server. This makes is so that it can be deployed simultaneously and host them in a single server instance.

- [App Router](https://nextjs.org)
  - Next.js version: ^14
- [Pegasus UI](https://pegasusds.com.br)
  - Using Pegasus Components Library
- [GraphQL](https://graphql.org)
  - GraphQL queries for interfacing with the back-end
- [TypeScript](https://www.typescriptlang.org)
  - Fully type-safe
- [Tailwind](https://www.tailwindcss.com)
- [Payload Admin Bar](https://github.com/payloadcms/payload-admin-bar)
  - For use in [Draft Mode](#draft-preview)
- Autentication
  - Based on payloadCMS users

### Payload Back-end

The PayloadCMS config is tailored specifically to the needs of most websites. This project is pre-configured in the following ways:

#### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- ##### Users (Authentication)

  Users are auth-enabled and encompass both admins and regular users based on the value of their `roles` field. Only `admin` users can access your admin panel to manage your website whereas `user` can authenticate on your front-end to leave [comments](#comments) and read [premium content](#premium-content) but have limited access to the platform. See [Access Control](#access-control) for more details.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- ##### Pages

  All pages are layout builder enabled so you can generate unique layouts for each page using layout-building blocks, see [Layout Builder](#layout-builder) for more details. Pages are also draft-enabled so you can preview them before publishing them to your website, see [Draft Preview](#draft-preview) for more details.

- ##### Media

  This is the uploads enabled collection used by pages, posts, and projects to contain media like images, videos, downloads, and other assets.

- ##### Categories

  A taxonomy used to group posts or projects together. Categories can be nested inside of one another, for example "News > Technology". See the official [Payload Nested Docs Plugin](https://payloadcms.com/docs/plugins/nested-docs) for more details.

#### Globals

See the [Globals](https://payloadcms.com/docs/configuration/globals) docs for details on how to extend this functionality.

- `Header`

  The data required by the header on your front-end like nav links.

- `Footer`

  Same as above but for the footer of your site.

- `Company`

  Information about the company to be used on the frontend and admin panel.

## Features

### Access control

Basic role-based access control is setup to determine what users can and cannot do based on their roles, which are:

- `admin`: They can access the Payload admin panel to manage your site. They can see all data and make all operations.
- `user`: They cannot access the Payload admin panel and can perform limited operations based on their user (see below).

This applies to each collection in the following ways:

- `users`: Only admins and the user themselves can access their profile. Anyone can create a user but only admins can delete users.
- `pages`: Everyone can access published pages, but only admins update delete them.

---

# Deploy com docker-compose

0. Editar DATABASE_URI no .env pra apontar pro Mongo rodado pelo Docker - Normalmente é `mongodb://mongo:27017/` - `mongo` aponta pra instancia mongo criado no docker.

1. Remove todos os arquivos de build locais na pasta (não tenho certeza se faz diferença, mas na dúvida faz isso)

2. Usar o comando `docker compose up -d`

Cuidados:

- Em uma aplicação vazia (que não tenha nada criado no admin do Payload), cuidar pra não realizar fetch de dados que não existem, porque isso vai quebrar o deploy, sempre fazer uma validação se existe, e se existe, renderiza componente. Especialmente no caso de componentes globais.

# Enviroinment variables

- As variaveis `REVALIDATION_KEY` e `NEXT_PRIVATE_REVALIDATION_KEY` são comparadas no momento que é salva quaisquer alteração em páginas no payload (ver `pages/hooks/revalidatePage.ts`) e precisam ser iguais ou as alterações do payload não serão refletidas no front-end
