# 🚀 Lead Capture API - @rpg Sistemas

Esta é uma API REST robusta desenvolvida para a gestão e captura de leads em eventos e feiras. O sistema oferece controle completo sobre o registro de potenciais clientes, seus interesses em produtos específicos e o gerenciamento de mídias, como fotos de cartões de visita.

## 🛠️ Stack Tecnológica

- **Node.js & TypeScript**: Core da aplicação com tipagem estática.
- **Express**: Framework para roteamento e middlewares.
- **Prisma ORM**: Interface moderna para o banco de dados PostgreSQL.
- **Docker & Docker Compose**: Containerização de toda a infraestrutura.
- **Sharp & Multer**: Processamento avançado e upload de imagens.
- **Swagger (OpenAPI)**: Documentação interativa das rotas.
- **JWT**: Autenticação segura com controle de níveis de acesso (RBAC).

## 📂 Organização de Arquivos

A API utiliza um sistema de armazenamento organizado por subpastas dentro do diretório `uploads`:

- `..uploads/avatars`: Armazena fotos de perfil dos usuários do sistema.
- `..uploads/cards`: Armazena imagens dos cartões de visita dos leads, redimensionadas para otimização.

## 🚀 Como Iniciar o Projeto

### 1. Pré-requisitos

- Docker e Docker Compose instalados.
- Node.js v18+.

### 2. Configuração do Ambiente (.env)

Crie um arquivo `.env` seguindo o padrão:
PORT=3333
NODE_ENVIRONMENT=development
DATABASE_URL="postgresql://user:password@localhost:5432/leads_db?schema=public"
BASE_URL="http://localhost:3333"

### 3. Execução

```bash
# Subir o banco de dados
  docker-compose up -d

# Instalar as dependências
  npm install

# Rodar migrations do Prisma
  npx prisma migrate dev

# Iniciar servidor em desenvolvimento
  npm run dev
```
