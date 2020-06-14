FROM node:13

RUN mkdir -p /opt/tictactoe-server
WORKDIR /opt/tictactoe-server

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY ./src ./src

ENTRYPOINT npm run watch

# RUN npm run build

# ENTRYPOINT npm run start