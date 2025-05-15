from fastapi import APIRouter, HTTPException, Depends
from app.core.prisma import prisma
from app.models.salle import SalleCreate, SalleOut
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/", response_model=list[SalleOut])
async def get_salles():
    return await prisma.salle.find_many()


@router.post("/", response_model=SalleOut)
async def create_salle(salle: SalleCreate, current_user=Depends(get_current_user)):
    # Vérifier si l'utilisateur est ADMINISTRATEUR (id: 4)
    if (
        current_user.id_role != 4
    ):  # Assurez-vous que `current_user` a l'attribut `id_role`
        raise HTTPException(
            status_code=403,
            detail="Accès interdit. Vous devez être administrateur pour créer des salles.",
        )

    # Si l'utilisateur est autorisé, créer la salle
    return await prisma.salle.create(
        {"nom_salle": salle.nom_salle, "capacite": salle.capacite}
    )
