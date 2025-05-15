from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from prisma.models import Utilisateur
from app.api.deps import get_current_user
from app.core.prisma import prisma
from app.models.talk import TalkCreate, TalkOut, TalkUpdate, StatutTalk, Niveau
from typing import Annotated, List, Optional
from datetime import datetime, timedelta

router = APIRouter()


@router.get("/me", response_model=List[TalkOut])
async def get_my_talks(current_user: Utilisateur = Depends(get_current_user)):
    """
    Récupère la liste des talks soumis par le conférencier connecté.
    """
    # Vérifie que l'utilisateur est pas public
    if current_user.id_role == 3:
        raise HTTPException(
            status_code=403,
            detail="Pas d'accès public.",
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
    if current_user.id_role == 1 | current_user.id_role == 3:
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
        where=filters,
        skip=skip,
        take=limit,
        include={"conferencier": True, "planning": True},
    )

    talks_out = []
    for talk in talks:
        date = talk.planning.date_heure.date() if talk.planning else None
        heure = talk.planning.date_heure.time() if talk.planning else None

        talks_out.append(
            TalkOut(
                id_talk=talk.id_talk,
                titre=talk.titre,
                sujet=talk.sujet,
                description=talk.description,
                duree=talk.duree,
                niveau=talk.niveau,
                statut=talk.statut,
                id_conferencier=talk.id_conferencier,
                conferencier=talk.conferencier,
                date=date,
                heure=heure,
            )
        )

    return talks_out


@router.get("/{talk_id}", response_model=TalkOut)
async def get_talk_by_id(
    talk_id: int,
    current_user: Utilisateur = Depends(get_current_user),
):
    """
    Récupère un talk spécifique par son ID.
    Accessible uniquement aux organisateurs.
    """
    if current_user.id_role == 1 or current_user.id_role == 3:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux organisateurs.",
        )

    talk = await prisma.talk.find_unique(
        where={"id_talk": talk_id},
        include={"conferencier": True, "planning": True},
    )

    if not talk:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Talk non trouvé.",
        )

    date = talk.planning.date_heure.date() if talk.planning else None
    heure = talk.planning.date_heure.time() if talk.planning else None

    return TalkOut(
        id_talk=talk.id_talk,
        titre=talk.titre,
        sujet=talk.sujet,
        description=talk.description,
        duree=talk.duree,
        niveau=talk.niveau,
        statut=talk.statut,
        id_conferencier=talk.id_conferencier,
        conferencier=talk.conferencier,
        date=date,
        heure=heure,
    )


@router.post("/", response_model=TalkOut, status_code=status.HTTP_201_CREATED)
async def create_talk(
    talk: TalkCreate, current_user: Utilisateur = Depends(get_current_user)
):
    """
    Crée un nouveau talk. Seuls les conférenciers peuvent soumettre un talk.
    """

    # Vérifie si l'utilisateur est un conférencier
    if current_user.id_role == 2 or current_user.id_role == 3:
        raise HTTPException(
            status_code=403,
            detail="Seuls les conférenciers peuvent créer un talk.",
        )

    # Création du talk
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

    # Vérifie que c'est bien le conférencier propriétaire (ou admin)
    if (
        current_user.id_role != 4
        and talk.id_conferencier != current_user.id_utilisateur
    ):
        raise HTTPException(status_code=403, detail="Accès non autorisé")

    # Vérifie que le talk est encore modifiable (ou admin)
    if current_user.id_role != 4 and talk.statut != StatutTalk.EN_ATTENTE:
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
    id: int,
    payload: dict = Body(...),  # Pour recevoir {"status": "accepté" | "refusé"}
    current_user: Utilisateur = Depends(get_current_user),
):
    """
    Permet à un organisateur de mettre à jour le statut d'un talk (accepté ou refusé).
    """

    # Vérification du rôle organisateur (id_role=2)
    if current_user.id_role == 1 or current_user.id_role == 3:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les organisateurs peuvent gérer les statuts des talks.",
        )

    # Vérification du statut envoyé dans le body
    statut_recu = payload.get("status")
    if statut_recu not in ("ACCEPTE", "REFUSE"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le statut doit être 'ACCEPTE' ou 'REFUSE'.",
        )

    # Vérification que le talk existe
    talk = await prisma.talk.find_unique(where={"id_talk": id})
    if not talk:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Talk non trouvé.",
        )

    # Mise à jour sécurisée du statut
    updated_talk = await prisma.talk.update(
        where={"id_talk": id},
        data={"statut": statut_recu},
        include={"conferencier": True},
    )

    return updated_talk


@router.patch("/{id}/schedule", response_model=TalkOut)
async def schedule_talk(
    id: int,
    id_salle: int = Query(...),
    date: str = Query(...),
    heure: str = Query(...),
    current_user: Utilisateur = Depends(get_current_user),
):
    """
    Permet à un organisateur d'assigner une salle et un créneau horaire à un talk déjà accepté.
    """
    # Vérifie si l'utilisateur est un organisateur
    if current_user.id_role == 1 or current_user.id_role == 3:
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

    # Convertir date et heure
    try:
        date_heure = datetime.strptime(f"{date} {heure}", "%Y-%m-%d %H:%M")
    except ValueError:
        raise HTTPException(status_code=400, detail="Format de date ou heure invalide")

    # Vérifie les conflits de planning
    conflict = await prisma.planning.find_first(
        where={
            "id_salle": id_salle,
            "date_heure": {
                "gte": datetime.combine(date_heure.date(), datetime.min.time()),
                "lt": datetime.combine(date_heure.date(), datetime.min.time())
                + timedelta(days=1),
            },
            "id_talk": {"not": id},
        }
    )
    if conflict:
        raise HTTPException(
            status_code=400, detail="La salle est déjà réservée pour ce créneau."
        )

    # Met à jour le talk
    await prisma.talk.update(
        where={"id_talk": id},
        data={"statut": "PLANIFIE"},
    )

    # Gère le planning : update s'il existe, sinon create
    existing_planning = await prisma.planning.find_unique(where={"id_talk": id})

    if existing_planning:
        await prisma.planning.update(
            where={"id_talk": id},
            data={
                "id_salle": id_salle,
                "date_heure": date_heure,
            },
        )
    else:
        await prisma.planning.create(
            data={
                "id_talk": id,
                "id_salle": id_salle,
                "date_heure": date_heure,
                "id_organisateur": current_user.id_utilisateur,
            }
        )

    # Recharge avec conferencier + planning
    full_talk = await prisma.talk.find_unique(
        where={"id_talk": id},
        include={"conferencier": True, "planning": True},
    )

    return TalkOut(
        id_talk=full_talk.id_talk,
        titre=full_talk.titre,
        sujet=full_talk.sujet,
        description=full_talk.description,
        duree=full_talk.duree,
        niveau=full_talk.niveau,
        statut=full_talk.statut,
        id_conferencier=full_talk.id_conferencier,
        conferencier=full_talk.conferencier,
        date=full_talk.planning.date_heure.date() if full_talk.planning else None,
        heure=full_talk.planning.date_heure.time() if full_talk.planning else None,
    )


@router.delete("/{id}", status_code=204)
async def delete_talk(
    id: int, current_user: Annotated[Utilisateur, Depends(get_current_user)]
):
    """
    Supprimer un talk si :
    - l'utilisateur est conférencier propriétaire du talk,
    - ou administrateur,
    - et que le talk n'est pas planifié.
    """
    talk = await prisma.talk.find_unique(where={"id_talk": id})

    if not talk:
        raise HTTPException(status_code=404, detail="Talk non trouvé")

    is_owner = talk.id_conferencier == current_user.id_utilisateur
    is_admin = current_user.id_role == 4

    if not (is_owner or is_admin):
        raise HTTPException(status_code=403, detail="Action non autorisée")

    if talk.statut == "PLANIFIE":
        raise HTTPException(
            status_code=400,
            detail="Le talk est déjà planifié et ne peut pas être supprimé",
        )

    await prisma.talk.delete(where={"id_talk": id})
    return None  # 204 No Content
