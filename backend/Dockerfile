FROM node:18-slim

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Installer les dépendances Node.js
RUN npm install

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 5000

# Commande de démarrage
CMD ["npm", "run", "dev"]