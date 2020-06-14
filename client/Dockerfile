FROM node:13

RUN mkdir -p /opt/tictactoe-client
WORKDIR /opt/tictactoe-client

COPY package*.json ./
COPY tsconfig.json ./
COPY .env ./

RUN npm install

COPY ./src ./src
COPY ./public ./public

ENTRYPOINT npm run start

# RUN npm run build
# RUN npm i -g serve

# ENTRYPOINT serve -s -p 8080