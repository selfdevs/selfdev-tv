FROM node:latest


WORKDIR /app

RUN npm install -g pnpm

ENV TZ=Europe/Paris

COPY package*.json ./

COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 5173

CMD [ "pnpm", "dev", "--host", "0.0.0.0" ]