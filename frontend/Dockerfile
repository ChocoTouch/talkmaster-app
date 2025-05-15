# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copier package.json + package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le frontend
COPY . .

# Expose le port Vite
EXPOSE 5173

# Lancer le serveur dev
CMD ["npm", "run", "dev", "--", "--host"]
