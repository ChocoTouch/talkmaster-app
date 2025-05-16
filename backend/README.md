# Documentation API - TalkMaster

## Introduction

L'API TalkMaster permet de gérer un événement technique incluant la soumission de talks, leur modération, la planification par salle et créneau, et la consultation publique ou privée du planning. Elle est construite avec **FastAPI**, utilise **Prisma** comme ORM, et est sécurisée via JWT.

---

## Base URL

```

/api

```

---

## Authentification

L'API utilise des tokens JWT pour l'authentification. Chaque requête nécessitant une authentification doit inclure le token dans l'en-tête HTTP :

```

Authorization: Bearer <token>

```

---

## Endpoints

### 1. Authentification

#### POST /auth/register

Permet d'enregistrer un nouvel utilisateur.

**Paramètres :**

- `nom` (string) : Nom de l’utilisateur.

- `email` (string) : L’adresse e-mail de l’utilisateur.
- `password` (string) : Le mot de passe de l’utilisateur.
- `id_role` (int) : L'identifiant du rôle.

**Réponse :**

- `200 OK` : Utilisateur créé.

```json
{
  "nom": "string",
  "email": "user@example.com",
  "id_utilisateur": 0,
  "id_role": 0
}
```

#### POST /auth/token

Permet à un utilisateur de se connecter et d'obtenir un token JWT.

**Paramètres :**

- `email` (string) : L'adresse e-mail de l'utilisateur.

- `password` (string) : Le mot de passe de l'utilisateur.

**Réponse :**

- `200 OK` : Si la connexion est réussie, retourne un token JWT.

```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer"
}
```

- `401 Unauthorized` : Si les informations d'identification sont incorrectes.

#### GET /auth/me

Permet de récupérer les informations de l'utilisateur actuellement connecté.

**Réponse :**

- `200 OK` : Détails de l'utilisateur.

```json
{
  "id_utilisateur": 1,
  "nom": "Jean Dupont",
  "email": "user@example.com",
  "role": "CONFERENCIER"
}
```

- `401 Unauthorized` : Si l'utilisateur n'est pas authentifié.

---

### 2. Utilisateurs

#### GET /utilisateurs/

Liste tous les utilisateurs.

**Réponse :**

- `200 OK`

```json
[
  {
    "id_utilisateur": 1,
    "nom": "Jean Dupont",
    "email": "user@example.com",
    "role": "CONFERENCIER"
  },
  {
    "id_utilisateur": 2,
    "nom": "Alice Martin",
    "email": "alice@example.com",
    "role": "ORGANISATEUR"
  }
]
```

#### POST /utilisateurs/

Crée un nouvel utilisateur.

**Paramètres :**

- `nom` (string)

- `email` (string)

- `mot_de_passe` (string)

- `id_role` (int)

**Réponse :**

- `201 Created`

```json
{
  "id_utilisateur": 3,
  "nom": "Nouveau User",
  "email": "nouveau@example.com",
  "role": "PUBLIC"
}
```

- `400 Bad Request` : Paramètres invalides ou email déjà utilisé.

---

### 3. Talks

#### GET /talks/me

Récupère les talks proposés par l'utilisateur connecté.

**Réponse :**

- `200 OK`

```json
[
  {
    "id_talk": 123,
    "titre": "Mon Talk",
    "statut": "EN_ATTENTE"
  }
]
```

#### GET /talks/

Liste tous les talks.

**Réponse :**

- `200 OK`

```json
[
  {
    "id_talk": 123,
    "titre": "Mon Talk",
    "sujet": "Technologie",
    "niveau": "INTERMEDIAIRE",
    "statut": "ACCEPTE"
  }
]
```

#### POST /talks/

Permet à un conférencier de proposer un talk.

**Paramètres :**

- `titre` (string)

- `sujet` (string)

- `description` (string)

- `duree` (int)

- `niveau` (string : DEBUTANT, INTERMEDIAIRE, AVANCE)

**Réponse :**

- `201 Created`

```json
{
  "id_talk": 123,
  "titre": "Mon Talk",
  "statut": "EN_ATTENTE"
}
```

- `400 Bad Request` : Paramètres manquants ou invalides.

#### GET /talks/{talk_id}

Consulte les détails d’un talk spécifique.

**Réponse :**

- `200 OK`

```json
{
  "id_talk": 123,
  "titre": "Mon Talk",
  "sujet": "Technologie",
  "description": "Description du talk",
  "duree": 60,
  "niveau": "INTERMEDIAIRE",
  "statut": "ACCEPTE",
  "scheduled_at": "2025-06-01T10:00:00",
  "room": "Salle A"
}
```

- `404 Not Found` : Talk non trouvé.

#### PUT /talks/{id}

Modifie un talk existant.

**Paramètres optionnels :**

- `titre` (string)

- `sujet` (string)

- `description` (string)

- `duree` (int)

- `niveau` (string)

**Réponse :**

- `200 OK`

```json
{
  "id_talk": 123,
  "titre": "Mon Talk modifié",
  "statut": "EN_ATTENTE"
}
```

- `400 Bad Request` : Paramètres invalides.

#### DELETE /talks/{id}

Supprime un talk.

**Réponse :**

- `204 No Content` : Talk supprimé.

- `404 Not Found` : Talk non trouvé.

#### PATCH /talks/{id}/status

Modifie le statut d’un talk (par exemple, accepter ou refuser).

**Paramètres :**

- `statut` (string) : EN_ATTENTE, ACCEPTE, REFUSE, PLANIFIE

**Réponse :**

- `200 OK`

```json
{
  "id_talk": 123,
  "statut": "ACCEPTE"
}
```

- `400 Bad Request` : Statut invalide.

#### PATCH /talks/{id}/schedule

Planifie un talk en lui associant une salle et une date.

**Paramètres :**

- `id_salle` (int)

- `date_heure` (string, format ISO)

**Réponse :**

- `200 OK`

```json
{
  "id_planning": 1,
  "id_talk": 123,
  "id_salle": 5,
  "date_heure": "2025-06-01T10:00:00"
}
```

- `400 Bad Request` : Paramètres invalides.

- `404 Not Found` : Talk ou salle non trouvés.

---

### 4. Plannings

#### GET /plannings/

Liste tous les plannings.

**Réponse :**

- `200 OK`

```json
[
  {
    "id_planning": 1,
    "date_heure": "2025-06-01T10:00:00",
    "id_talk": 123,
    "id_salle": 5,
    "id_organisateur": 2
  }
]
```

#### PUT /plannings/{id}

Modifie un planning existant.

**Paramètres :**

- `date_heure` (string, ISO)

- `id_salle` (int)

**Réponse :**

- `200 OK`

```json
{
  "id_planning": 1,
  "date_heure": "2025-06-01T11:00:00",
  "id_salle": 5
}
```

- `400 Bad Request` : Paramètres invalides.

- `404 Not Found` : Planning non trouvé.

#### GET /plannings/planning

Permet de consulter le planning filtré (ex: par date, salle, sujet, niveau).

**Paramètres optionnels :**

- `date` (string, format YYYY-MM-DD)

- `room` (string)

- `subject` (string)

- `level` (string)

**Réponse :**

- `200 OK`

```json
[
  {
    "id_talk": 123,
    "titre": "Mon Talk",
    "date_heure": "2025-06-01T10:00:00",
    "room": "Salle A",
    "niveau": "INTERMEDIAIRE"
  }
]
```

- `404 Not Found` : Aucun talk trouvé avec les filtres.

---

### 5. Salles

#### GET /salles/

Liste des salles.

**Réponse :**

- `200 OK`

```json
[
  {
    "id_salle": 5,
    "nom_salle": "Salle A",
    "capacite": 100
  }
]
```

#### POST /salles/

Création d’une nouvelle salle.

**Paramètres :**

- `nom_salle` (string)

- `capacite` (int)

**Réponse :**

- `201 Created`

```json
{
  "id_salle": 6,
  "nom_salle": "Salle B",
  "capacite": 50
}
```

- `400 Bad Request` : Paramètres invalides.

---

### 6. Rôles

#### GET /roles/

Liste des rôles.

**Réponse :**

- `200 OK`

```json
[
  {
    "id_role": 1,
    "nom_role": "CONFERENCIER"
  },
  {
    "id_role": 2,
    "nom_role": "ORGANISATEUR"
  }
]
```

#### POST /roles/

Création d’un rôle.

**Paramètres :**

- `nom_role` (string)

**Réponse :**

- `201 Created`

```json
{
  "id_role": 3,
  "nom_role": "PUBLIC"
}
```

- `400 Bad Request` : Paramètres invalides.

---

## Gestion des erreurs

Les erreurs sont retournées dans ce format :

```json
{
	"error": "description de l'erreur",
	"status": code_http
}
```

Exemples courants :

- `400 Bad Request` : Paramètres invalides ou manquants.

- `401 Unauthorized` : Authentification requise ou échouée.

- `404 Not Found` : Ressource non trouvée.

---

## Requirements

- fastapi

- uvicorn

- python-dotenv

- python-jose

- passlib

- prisma

- python-multipart

- pydantic[email]

- bcrypt

---
