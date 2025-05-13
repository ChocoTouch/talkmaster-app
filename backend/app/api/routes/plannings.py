from fastapi import APIRouter, Depends, HTTPException, status,Query
from prisma.models import Planning, Talk, Salle
from app.deps.auth import get_current_user
from app.db import prisma
from app.models.planning import PlanningOut, PlanningUpdate
from typing import List,Optional
from uuid import UUID
from datetime import date


router = APIRouter()

@router.get("/", response_model=List[PlanningOut])
async def get_planning(current_user=Depends(get_current_user)):
    """
    Récupère l'ensemble des talks planifiés avec les informations de salle et de créneau.
    Accessible uniquement aux utilisateurs authentifiés.
    """
    # Vérifier que l'utilisateur est authentifié
    if not current_user:
        raise HTTPException(status_code=403, detail="Utilisateur non authentifié")

    # Récupérer les plannings avec jointures sur Talk et Salle
    plannings = await prisma.planning.find_many(
        include={
            "talk": {
                "select": {
                    "id_talk": True,
                    "titre": True,
                    "description": True,
                    "statut": True,
                }
            },
            "salle": {
                "select": {
                    "nom_salle": True
                }
            }
        }
    )

    if not plannings:
        raise HTTPException(status_code=404, detail="Aucun planning trouvé.")

    return plannings

@router.put("/{id}", response_model=PlanningOut)
async def update_planning(id: int, planning_update: PlanningUpdate, current_user=Depends(get_current_user)):
    """
    Permet à un organisateur de modifier une entrée du planning existant.
    Vérifie qu'il n'y a pas de conflit de planning (salle ou créneau).
    """
    # Vérifier que l'utilisateur est bien un organisateur
    if current_user.role.nom_role != "ORGANISATEUR":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous devez être un organisateur pour modifier un planning."
        )

    # Vérifier si le planning existe
    planning = await prisma.planning.find_unique(
        where={"id_planning": id},
        include={
            "talk": True,  # Inclure le talk associé pour vérification
            "salle": True,  # Inclure la salle actuelle
        }
    )

    if not planning:
        raise HTTPException(status_code=404, detail="Planning non trouvé.")

    # Vérification des conflits : une salle et un créneau horaire ne peuvent être associés à plus d'un talk
    conflicting_planning = await prisma.planning.find_first(
        where={
            "salle_id": planning_update.salle_id,
            "date": planning_update.date,
            "heure": planning_update.heure,
            "id_planning_not": id  # On exclut le planning actuel
        }
    )

    if conflicting_planning:
        raise HTTPException(status_code=400, detail="Le créneau ou la salle est déjà occupé.")

    # Mettre à jour les informations du planning dans la base de données
    updated_planning = await prisma.planning.update(
        where={"id_planning": id},
        data={
            "salle_id": planning_update.salle_id,
            "date": planning_update.date,
            "heure": planning_update.heure,
        }
    )

    # Récupérer les informations actualisées pour la réponse
    updated_planning = await prisma.planning.find_unique(
        where={"id_planning": id},
        include={
            "talk": True,
            "salle": True,
        }
    )

    return updated_planning

@router.get("/planning", response_model=List[PlanningOut])
async def get_filtered_planning(
    jour: Optional[date] = Query(None),
    salle: Optional[UUID] = Query(None),
    sujet: Optional[str] = Query(None),
    niveau: Optional[str] = Query(None),
    current_user=Depends(get_current_user)
):
    """
    Récupère les talks planifiés avec filtres dynamiques : jour, salle, sujet, niveau.
    """
    if not current_user:
        raise HTTPException(status_code=403, detail="Utilisateur non authentifié")

    filters = {}

    if jour:
        filters["date"] = jour

    if salle:
        filters["salle_id"] = salle

    # On construit dynamiquement les filtres imbriqués pour `talk`
    talk_filter = {}
    if sujet:
        talk_filter["titre"] = {"contains": sujet, "mode": "insensitive"}

    if niveau:
        talk_filter["niveau"] = niveau

    if talk_filter:
        filters["talk"] = {"is": talk_filter}

    plannings = await prisma.planning.find_many(
        where=filters,
        include={
            "talk": {
                "select": {
                    "id_talk": True,
                    "titre": True,
                    "description": True,
                    "statut": True,
                    "niveau": True
                }
            },
            "salle": {
                "select": {
                    "nom_salle": True
                }
            }
        }
    )

    return plannings