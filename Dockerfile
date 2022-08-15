FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
COPY .env ./dist/
WORKDIR ./dist

EXPOSE 4321

CMD node index.js
