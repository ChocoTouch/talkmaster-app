from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.deps.auth import get_current_user
from app.core.prisma import prisma
from app.models.planning import PlanningOut, PlanningUpdate
from typing import List, Optional
from datetime import date,datetime,time


router = APIRouter()


@router.get("/", response_model=List[PlanningOut])
async def get_planning(current_user=Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=403, detail="Utilisateur non authentifié")

    plannings = await prisma.planning.find_many(
        include={
            "talk": True,     # Récupère tout le talk
            "salle": True,    # Récupère toute la salle
        }
    )

    if not plannings:
        raise HTTPException(status_code=404, detail="Aucun planning trouvé.")

    # Adapter les données à PlanningOut
    return [
        PlanningOut(
            talk_id=planning.talk.id_talk,
            talk_titre=planning.talk.titre,
            talk_description=planning.talk.description,
            talk_statut=planning.talk.statut,
            salle_nom=planning.salle.nom_salle,
            date=planning.date_heure.date(),
            heure=planning.date_heure.time(),
            salle_id=planning.id_salle,
        )
        for planning in plannings
    ]

@router.put("/{id}", response_model=PlanningOut)
async def update_planning(
    id: int, planning_update: PlanningUpdate, current_user=Depends(get_current_user)
):
    """
    Permet à un organisateur de modifier une entrée du planning existant.
    Vérifie qu'il n'y a pas de conflit de planning (salle ou créneau).
    """
    # Vérification rôle organisateur
    if current_user.id_role != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous devez être un organisateur pour modifier un planning.",
        )

    # Récupérer le planning existant
    planning = await prisma.planning.find_unique(
        where={"id_planning": id},
        include={"talk": True, "salle": True},
    )
    if not planning:
        raise HTTPException(status_code=404, detail="Planning non trouvé.")

    # Recomposer le datetime
    try:
        date_heure = datetime.combine(planning_update.date, planning_update.heure)
    except Exception:
        raise HTTPException(status_code=400, detail="Date ou heure invalide.")

    # Vérification de conflit
    conflict = await prisma.planning.find_first(
        where={
            "id_salle": planning_update.salle_id,
            "date_heure": date_heure,
            "NOT": {
                "id_planning": id
            }
        }
    )
    if conflict:
        raise HTTPException(
            status_code=400,
            detail="Ce créneau est déjà occupé pour cette salle."
        )

    # Mise à jour
    await prisma.planning.update(
        where={"id_planning": id},
        data={
            "id_salle": planning_update.salle_id,
            "date_heure": date_heure,
        },
    )

    # Récupérer les informations actualisées pour la réponse
    updated_planning = await prisma.planning.find_unique(
        where={"id_planning": id},
        include={"talk": True, "salle": True},
    )

    # Adapter les données à la structure du modèle PlanningOut
    return PlanningOut(
        id_planning=updated_planning.id_planning,
        salle_id=updated_planning.id_salle,
        date=updated_planning.date_heure.strftime("%Y-%m-%d"),
        heure=updated_planning.date_heure.strftime("%H:%M:%S"),
        talk_id=updated_planning.id_talk,
        talk_titre=updated_planning.talk.titre,
        talk_description=updated_planning.talk.description,
        talk_statut=updated_planning.talk.statut,
        salle_nom=updated_planning.salle.nom_salle,
    )

@router.get("/planning", response_model=List[PlanningOut])
async def get_filtered_planning(
    jour: Optional[date] = Query(None),  # Optionnel, peut être fourni
    heure: Optional[str] = Query(None),  # Prend l'heure en format string
    salle: Optional[int] = Query(None),
    sujet: Optional[str] = Query(None),
    niveau: Optional[str] = Query(None),
    current_user=Depends(get_current_user),
):
    """
    Récupère les plannings filtrés par jour et heure (exacte).
    Si `jour` est absent, la date du jour est utilisée.
    """
    if not current_user:
        raise HTTPException(status_code=403, detail="Utilisateur non authentifié")

    filters = {}

    # Si jour est fourni, on l'utilise, sinon on prend la date du jour
    if jour:
        jour = datetime.combine(jour, time.min)  # Combine jour avec minuit (00:00:00)
    else:
        jour = datetime.combine(datetime.today().date(), time.min)  # Si jour non fourni, utiliser la date d'aujourd'hui

    # Si une heure est fournie, on la combine avec la date spécifiée (jour)
    if heure:
        hour, minute = map(int, heure.split(":"))
        heure_local = datetime.combine(jour.date(), time(hour, minute))

        filters["date_heure"] = {
            "equals": heure_local  # Exact match pour la date et l'heure combinées
        }
    else:
        filters["date_heure"] = {
            "gte": jour,  # Plage de date à partir de minuit
            "lt": jour.replace(hour=23, minute=59, second=59)  # Jusqu'à la fin de la journée (23:59:59)
        }

    # Ajouter le filtre sur la salle si fourni
    if salle:
        filters["id_salle"] = salle

    # Ajouter le filtre sur le sujet dans les talks si fourni
    if sujet:
        filters["talk"] = {"sujet": {"contains": sujet, "mode": "insensitive"}}

    # Ajouter le filtre sur le niveau dans les talks si fourni
    if niveau:
        filters["talk"] = {"niveau": niveau}

    # Requête Prisma pour récupérer les plannings avec leurs relations (talk et salle)
    plannings = await prisma.planning.find_many(
        where=filters,
        include={"talk": True, "salle": True},
    )

    # Post-traitement pour filtrer les champs nécessaires et s'assurer qu'ils correspondent au modèle
    filtered_plannings = [
        {
            "id_planning": p.id_planning,
            "date": p.date_heure.date().strftime("%Y-%m-%d"),  # Extrait la date
            "heure": p.date_heure.time().strftime("%H:%M:%S"),  # Extrait l'heure
            "talk_id": p.talk.id_talk,
            "talk_titre": p.talk.titre,
            "talk_description": p.talk.description,
            "talk_statut": p.talk.statut,
            "salle_nom": p.salle.nom_salle,
        }
        for p in plannings
    ]
    
    return filtered_plannings