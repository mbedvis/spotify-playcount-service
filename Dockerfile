FROM mcr.microsoft.com/playwright:v1.55.0-focal

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "server.js"]
