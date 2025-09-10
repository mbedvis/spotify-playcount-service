# Naudojam oficialų Playwright 1.55.0 image
FROM mcr.microsoft.com/playwright:v1.55.0-focal

WORKDIR /app

# Tik package.json pirmiausia
COPY package*.json ./

# Įrašom dependencies (tik express, be playwright)
RUN npm install

# Kopijuojam visą kodą
COPY . .

CMD ["node", "server.js"]
