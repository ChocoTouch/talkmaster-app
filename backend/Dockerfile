# Utilise une image Python légère
FROM python:3.11-slim

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Installer les dépendances système nécessaires pour psycopg2, Prisma, etc.
RUN apt-get update && \
    apt-get install -y gcc libpq-dev curl && \
    rm -rf /var/lib/apt/lists/*

# Copier les requirements
COPY ./requirements.txt .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste du backend
COPY . /app

# Note : Ne pas copier .env ici, il sera injecté via docker-compose env_file

# Installer Prisma CLI via npm (nécessaire pour generate)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g prisma

# Générer le client Prisma (optionnel si tu utilises prisma-client-py)
RUN prisma generate

# Exposer le port utilisé par FastAPI
EXPOSE 8000

# Commande par défaut pour démarrer le backend
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
