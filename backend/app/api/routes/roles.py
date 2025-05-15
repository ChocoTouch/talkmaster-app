from fastapi import APIRouter, HTTPException, Depends
from app.core.prisma import prisma
from app.models.role import RoleCreate, RoleOut
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/", response_model=list[RoleOut])
async def get_roles():
    return await prisma.role.find_many()


@router.post("/", response_model=RoleOut)
async def create_role(role: RoleCreate, current_user=Depends(get_current_user)):
    # Vérifier si l'utilisateur est ADMINISTRATEUR (id: 4)
    if (
        current_user.id_role != 4
    ):  # Assurez-vous que `current_user` a l'attribut `id_role`
        raise HTTPException(
            status_code=403,
            detail="Accès interdit. Vous devez être administrateur pour créer des rôles.",
        )

    # Si l'utilisateur est autorisé, créer le rôle
    return await prisma.role.create({"nom_role": role.nom_role})
