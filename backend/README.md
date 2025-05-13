# Documentation API - TalkMaster

## Introduction

L'API TalkMaster permet de gérer un événement technique incluant la soumission de talks, leur modération, la planification par salle et créneau, et la consultation publique ou privée du planning. Elle est structurée autour de FastAPI, Prisma, et sécurisée via JWT.

## Base URL
`
Oscar Mike
`
## Authentification

L'API utilise des tokens JWT pour l'authentification. Chaque requête nécessitant une authentification doit inclure le token dans les en-têtes HTTP.

### En-tête pour authentification :
`
Authorization: Bearer <token>
`
## Endpoints

### 1. Authentification

#### POST /auth/login

Permet à un utilisateur de se connecter et d'obtenir un token JWT.

**Paramètres :**
- `email` (string): L'adresse e-mail de l'utilisateur.
- `password` (string): Le mot de passe de l'utilisateur.

**Réponse :**

- `200 OK`: Si la connexion est réussie, retourne un token JWT.
  
```json
{
  "token": "jwt_token_here"
}
```

- `401 Unauthorized`: Si les informations d'identification sont incorrectes.

### 2. Gestion des Talks

#### POST /talks

Permet à un conférencier de proposer un talk.

**Paramètres :**

-   `title` (string): Le titre du talk.
    
-   `subject` (string): Le sujet du talk.
    
-   `description` (string): La description détaillée du talk.
    
-   `duration` (integer): La durée en minutes du talk.
    
-   `level` (string): Le niveau du talk (ex : débutant, intermédiaire, avancé).
    

**Réponse :**

-   `201 Created`: Talk proposé avec succès.
    
```json
{
  "id": 123,
  "title": "Mon talk",
  "status": "pending"
}
```
-   `400 Bad Request`: Si les paramètres sont manquants ou invalides.
#### GET /talks/{id}

Permet de consulter les détails d'un talk spécifique.

**Paramètres :**

-   `id` (integer): L'identifiant du talk.
    

**Réponse :**

-   `200 OK`: Détails du talk.
```json
{
  "id": 123,
  "title": "Mon talk",
  "subject": "Technologie",
  "description": "Description du talk",
  "duration": 60,
  "level": "intermédiaire",
  "status": "accepted",
  "scheduled_at": "2025-06-01T10:00:00",
  "room": "Salle A"
}
```
-   `404 Not Found`: Si le talk n'existe pas.
#### PUT /talks/{id}

Permet à un conférencier de modifier un talk existant.

**Paramètres :**

-   `title` (string, optionnel): Nouveau titre du talk.
    
-   `subject` (string, optionnel): Nouveau sujet du talk.
    
-   `description` (string, optionnel): Nouvelle description.
    
-   `duration` (integer, optionnel): Nouvelle durée en minutes.
    
-   `level` (string, optionnel): Nouveau niveau du talk.
    

**Réponse :**

-   `200 OK`: Talk mis à jour avec succès.
```json
{
  "id": 123,
  "title": "Mon talk modifié",
  "status": "pending"
}
```
-   `400 Bad Request`: Si les paramètres sont invalides.
    

#### DELETE /talks/{id}

Permet à un conférencier de supprimer un talk.

**Paramètres :**

-   `id` (integer): L'identifiant du talk.
    

**Réponse :**

-   `204 No Content`: Talk supprimé avec succès.
    
-   `404 Not Found`: Si le talk n'existe pas.
- ### 3. Gestion du Planning

#### GET /schedule

Permet de consulter le planning des talks, avec la possibilité de filtrer par sujet, salle, niveau, etc.

**Paramètres (optionnels) :**

-   `date` (string, format YYYY-MM-DD): Date du planning à consulter.
    
-   `room` (string): Filtre par salle.
    
-   `subject` (string): Filtre par sujet.
    
-   `level` (string): Filtre par niveau.
    

**Réponse :**

-   `200 OK`: Retourne la liste des talks programmés.
```json
[
  {
    "id": 123,
    "title": "Mon talk",
    "scheduled_at": "2025-06-01T10:00:00",
    "room": "Salle A",
    "level": "intermédiaire"
  },
  {
    "id": 124,
    "title": "Autre talk",
    "scheduled_at": "2025-06-01T11:00:00",
    "room": "Salle B",
    "level": "avancé"
  }
]
```
-   `404 Not Found`: Si aucun talk n'est trouvé pour les filtres appliqués.
    

----------

### 4. Gestion des Utilisateurs

#### GET /users/me

Permet de récupérer les informations de l'utilisateur actuellement connecté.

**Réponse :**

-   `200 OK`: Détails de l'utilisateur.
    
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "speaker",
  "name": "Jean Dupont"
}
```
-   `401 Unauthorized`: Si l'utilisateur n'est pas authentifié.
    

#### PUT /users/me

Permet de mettre à jour les informations personnelles de l'utilisateur.

**Paramètres :**

-   `name` (string, optionnel): Nouveau nom de l'utilisateur.
    
-   `email` (string, optionnel): Nouvelle adresse email.
    

**Réponse :**

-   `200 OK`: Informations mises à jour avec succès.
```json
{
  "id": 1,
  "email": "new-email@example.com",
  "role": "speaker",
  "name": "Jean Dupont"
}
```
-  `400 Bad Request`: Si les paramètres sont invalides.

## Erreurs

Les erreurs sont retournées dans le format suivant :
```json
{
  "error": "description de l'erreur",
  "status": "code de l'erreur"
}
```
Exemples d'erreurs courantes :

-   `400 Bad Request`: Paramètres invalides ou manquants.
    
-   `401 Unauthorized`: Authentification échouée.
    
-   `404 Not Found`: Ressource demandée introuvable.

## Conclusion

Cette API permet de gérer efficacement les talks, les utilisateurs et le planning dans un environnement collaboratif pour des événements techniques. Elle est sécurisée avec un système d'authentification JWT et propose des filtres avancés pour la consultation du planning, assurant ainsi une expérience utilisateur optimale.