from fastapi import APIRouter, HTTPException, status
from app.models.utilisateur import UtilisateurCreate, UtilisateurOut
from app.core.prisma import prisma

router = APIRouter()

@router.post("/", response_model=UtilisateurOut, status_code=status.HTTP_201_CREATED)
async def creer_utilisateur(utilisateur: UtilisateurCreate):
    existing = await prisma.utilisateur.find_unique(where={"email": utilisateur.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    new_user = await prisma.utilisateur.create(
        data={
            "nom": utilisateur.nom,
            "email": utilisateur.email,
            "mot_de_passe": utilisateur.mot_de_passe,
            "id_role": utilisateur.id_role,
        }
    )
    return new_user


@router.get("/", response_model=list[UtilisateurOut])
async def liste_utilisateurs():
    return await prisma.utilisateur.find_many()
