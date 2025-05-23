from app.api.deps import get_current_user
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from app.core.prisma import prisma
from app.core.security import create_access_token, verify_password, hash_password
from app.models.utilisateur import UtilisateurCreate, UtilisateurOut
from datetime import timedelta

router = APIRouter()


class Token(BaseModel):
    access_token: str
    token_type: str


# Endpoint pour enregistrer un nouvel utilisateur
@router.post("/register", response_model=UtilisateurOut)
async def register_user(user: UtilisateurCreate):
    existing_user = await prisma.utilisateur.find_unique(where={"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email déjà utilisé.")

    hashed_password = hash_password(user.mot_de_passe)
    new_user = await prisma.utilisateur.create(
        {
            "nom": user.nom,
            "email": user.email,
            "mot_de_passe": hashed_password,
            "id_role": user.id_role,
        }
    )
    return new_user


# Endpoint pour se connecter et obtenir un token JWT
@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await prisma.utilisateur.find_unique(
        where={"email": form_data.username}
    )  # username non unique
    if not user or not verify_password(form_data.password, user.mot_de_passe):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants invalides",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Créer un token JWT
    access_token_expires = timedelta(hours=1)  # Expire après 1 heure
    access_token = create_access_token(
        data={"sub": str(user.id_utilisateur)},
        utilisateur=user,
        expires_delta=access_token_expires,
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UtilisateurOut)
async def read_current_user(current_user=Depends(get_current_user)):
    return current_user
