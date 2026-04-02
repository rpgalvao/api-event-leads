FROM node:20-alpine

WORKDIR /usr/app

# Copiamos os arquivos de configuração de pacotes e o Prisma
COPY package*.json ./
COPY prisma ./prisma/

# Instalamos as dependências
RUN npm install

# Geramos o cliente do Prisma (essencial para o TS reconhecer o banco)
RUN npx prisma generate

# Copia o restante do código
COPY . .

# Expomos a porta definida no server.ts
EXPOSE 3333

# Comando para rodar o script de watch no package.json
CMD [ "npm", "run", "start:dev" ]