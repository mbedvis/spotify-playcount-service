# vietoje ...v1.55.0-focal
FROM mcr.microsoft.com/playwright:v1.55.0-jammy

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
CMD ["node", "server.js"]
