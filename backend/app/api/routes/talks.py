from fastapi import APIRouter, Depends, HTTPException, status, Query
from prisma.models import Utilisateur
from app.deps.auth import get_current_user
from app.db import prisma
from app.models.talk import TalkCreate, TalkOut, TalkUpdate, StatutTalk, Niveau
from typing import Annotated, List, Optional
from datetime import datetime
from uuid import UUID

router = APIRouter()


@router.get("/me", response_model=List[TalkOut])
async def get_my_talks(current_user: Utilisateur = Depends(get_current_user)):
    """
    Récupère la liste des talks soumis par le conférencier connecté.
    """
    # Vérifie que l'utilisateur est un conférencier
    if current_user.role.nom_role != "CONFERENCIER":
        raise HTTPException(
            status_code=403,
            detail="Seuls les conférenciers peuvent consulter leurs talks.",
        )

    talks = await prisma.talk.find_many(
        where={"id_conferencier": current_user.id_utilisateur},
        include={"conferencier": True},
    )

    return talks


@router.get("/", response_model=List[TalkOut])
async def list_talks(
    statut: Optional[StatutTalk] = Query(None),
    niveau: Optional[Niveau] = Query(None),
    duree_min: Optional[int] = Query(None),
    duree_max: Optional[int] = Query(None),
    skip: int = 0,
    limit: int = 10,
    current_user: Utilisateur = Depends(get_current_user),
):
    """
    Liste paginée des talks avec filtres pour les organisateurs uniquement.
    """
    if current_user.role.nom_role != "ORGANISATEUR":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux organisateurs.",
        )

    filters = {}

    if statut:
        filters["statut"] = statut

    if niveau:
        filters["niveau"] = niveau

    if duree_min is not None or duree_max is not None:
        filters["duree"] = {
            "gte": duree_min if duree_min is not None else 0,
            "lte": duree_max if duree_max is not None else 1000,
        }

    talks = await prisma.talk.find_many(
        where=filters, skip=skip, take=limit, include={"conferencier": True}
    )

    return talks


@router.post("/", response_model=TalkOut, status_code=status.HTTP_201_CREATED)
async def create_talk(
    talk: TalkCreate, current_user: Utilisateur = Depends(get_current_user)
):
    ...
    new_talk = await prisma.talk.create(
        data={
            "titre": talk.titre,
            "sujet": talk.sujet,
            "description": talk.description,
            "duree": talk.duree,
            "niveau": talk.niveau,
            "statut": "EN_ATTENTE",
            "id_conferencier": current_user.id_utilisateur,
        }
    )
    return new_talk


@router.put("/{id}", response_model=TalkOut)
async def update_talk(
    id: int,
    talk_data: TalkUpdate,
    current_user: Utilisateur = Depends(get_current_user),
):
    """
    Permet à un conférencier de modifier un talk en statut EN_ATTENTE.
    """
    # Récupérer le talk
    talk = await prisma.talk.find_unique(where={"id_talk": id})

    if not talk:
        raise HTTPException(status_code=404, detail="Talk non trouvé")

    # Vérifie que c'est bien le conférencier propriétaire
    if talk.id_conferencier != current_user.id_utilisateur:
        raise HTTPException(status_code=403, detail="Accès non autorisé")

    # Vérifie que le talk est encore modifiable
    if talk.statut != StatutTalk.EN_ATTENTE:
        raise HTTPException(status_code=400, detail="Le talk ne peut plus être modifié")

    # Mise à jour
    updated_talk = await prisma.talk.update(
        where={"id_talk": id},
        data={
            "titre": talk_data.titre,
            "sujet": talk_data.sujet,
            "description": talk_data.description,
            "duree": talk_data.duree,
            "niveau": talk_data.niveau,
        },
        include={"conferencier": True},
    )

    return updated_talk


@router.patch("/{id}/status", response_model=TalkOut)
async def update_talk_status(
    id: int, status: StatutTalk, current_user: Utilisateur = Depends(get_current_user)
):
    """
    Permet à un organisateur de mettre à jour le statut d'un talk (accepter ou refuser).
    """
    # Vérifie si l'utilisateur est un organisateur
    if current_user.role.nom_role != "ORGANISATEUR":
        raise HTTPException(
            status_code=403,
            detail="Seuls les organisateurs peuvent gérer les statuts des talks.",
        )

    # Vérifie si le talk existe
    talk = await prisma.talk.find_unique(where={"id_talk": id})
    if not talk:
        raise HTTPException(status_code=404, detail="Talk non trouvé")

    # Met à jour le statut du talk
    updated_talk = await prisma.talk.update(
        where={"id_talk": id}, data={"statut": status}  # Met à jour le statut du talk
    )

    return updated_talk


@router.patch("/{id}/schedule", response_model=TalkOut)
async def schedule_talk(
    id: int,
    salle_id: UUID,
    date: str,
    heure: str,
    current_user: Utilisateur = Depends(get_current_user),
):
    """
    Permet à un organisateur d'assigner une salle et un créneau horaire à un talk déjà accepté.
    """
    # Vérifie si l'utilisateur est un organisateur
    if current_user.role.nom_role != "ORGANISATEUR":
        raise HTTPException(
            status_code=403,
            detail="Seuls les organisateurs peuvent assigner des salles et des créneaux.",
        )

    # Vérifie si le talk existe et est accepté
    talk = await prisma.talk.find_unique(where={"id_talk": id})
    if not talk:
        raise HTTPException(status_code=404, detail="Talk non trouvé")

    if talk.statut != "ACCEPTE":
        raise HTTPException(
            status_code=400,
            detail="Le talk n'est pas accepté, impossible d'assigner une salle.",
        )

    # Convertir la date et l'heure en un datetime pour validation
    try:
        date_heure = datetime.strptime(f"{date} {heure}", "%Y-%m-%d %H:%M")
    except ValueError:
        raise HTTPException(status_code=400, detail="Format de date ou heure invalide")

    # Vérifie si la salle est déjà réservée pour ce créneau
    conflict = await prisma.talk.find_first(
        where={
            "salle_id": salle_id,
            "date": date_heure.date(),
            "heure": date_heure.time(),
        }
    )

    if conflict:
        raise HTTPException(
            status_code=400, detail="La salle est déjà réservée pour ce créneau."
        )

    # Met à jour le talk avec la salle et le créneau horaire
    updated_talk = await prisma.talk.update(
        where={"id_talk": id},
        data={
            "salle_id": salle_id,
            "date": date_heure.date(),
            "heure": date_heure.time(),
            "statut": "PLANIFIE",  # Le statut est maintenant "planifié" après l'assignation
        },
    )

    return updated_talk


@router.delete("/{id}", status_code=204)
async def delete_talk(
    id: int, current_user: Annotated[Utilisateur, Depends(get_current_user)]
):
    """
    Supprimer un talk si l'utilisateur est conférencier et que le talk n'est pas planifié.
    """
    talk = await prisma.talk.find_unique(where={"id_talk": id})

    if not talk:
        raise HTTPException(status_code=404, detail="Talk non trouvé")

    if talk.id_conferencier != current_user.id_utilisateur:
        raise HTTPException(status_code=403, detail="Action non autorisée")

    if talk.statut == "PLANIFIE":
        raise HTTPException(
            status_code=400,
            detail="Le talk est déjà planifié et ne peut pas être supprimé",
        )

    await prisma.talk.delete(where={"id_talk": id})
    return None  # 204 No Content
