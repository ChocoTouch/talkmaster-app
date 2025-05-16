
# 🗣️ TalkMaster

  

**Plateforme de gestion de talks pour un événement tech.**

  

---

  

## 🧰 Stack Technique

  

-  **Frontend** : React + Tailwind CSS + Zustand

-  **Backend** : FastAPI + Prisma + PostgreSQL

-  **Authentification** : JWT

-  **Outils** : GitHub Projects, Husky, ESLint, Prettier, Swagger

  

---

  

## 🚀 Installation
### Prérequis
- Node.js & npm
- Python 3.8+
- Docker & Docker Compose
- PostgreSQL (peut être lancé via Docker)

### Backend

1. Installer les dépendances Python :
```bash
cd  backend
pip  install  -r  requirements.txt
```
2. Configurer  la  base  de  données  PostgreSQL (via docker-compose  ou  autre)
3. Initialiser  Prisma  et  la  base  de  données  :
```bash
npx  prisma  migrate  deploy
```
4. Lancer  le  backend  :
```bash
uvicorn  main:app  --reload
```

### Frontend
1. Installer les dépendances :
```bash
cd frontend
npm install
```
2. Lancer le frontend :
```bash
npm start
```

## 🛠️ Scripts utiles

-   **Formatage & Lint** (via Husky pré-commit)
    
-   **Tests** à ajouter selon la stack
    
-   **Swagger** disponible sur le backend à l’URL `/docs`
    

## 🔐 Authentification

Le backend utilise JWT pour sécuriser les endpoints.  
Les tokens doivent être envoyés dans les headers `Authorization: Bearer <token>`.


## 📦 Docker

Le projet inclut un fichier `docker-compose.yml` pour démarrer la base PostgreSQL et les services associés.  
Commande :
```bash
docker compose up
```

----------

## 📚 Structure du projet

-   `.husky/` : hooks git pour qualité du code
    
-   `backend/` : API FastAPI + Prisma + logique métier
    
-   `frontend/` : application React + Tailwind CSS + Zustand
    
-   `.gitignore`
    
-   `LICENSE`
    
-   `docker-compose.yml`
    
-   `package.json`
    
-   `pyproject.toml`
    

----------

## 🤝 Contribution

Merci de respecter les règles de contribution :

-   Faire une branche dédiée
    
-   Ouvrir une pull request pour toute modification majeure
    
-   Respecter le style de code avec ESLint & Prettier
    
-   Les commits doivent être clairs et bien commentés
    

----------

## 📞 Contact

Pour toute question, ouvre une issue ou contacte l’équipe.

----------

_TalkMaster - Gestion simplifiée des talks pour vos événements tech._