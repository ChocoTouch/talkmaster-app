from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from app.db.prisma import db
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
    existing_user = await db.utilisateur.find_unique(where={"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email déjà utilisé.")
    
    hashed_password = hash_password(user.mot_de_passe)
    new_user = await db.utilisateur.create({
        "nom": user.nom,
        "email": user.email,
        "mot_de_passe": hashed_password,
        "id_role": user.id_role,
    })
    return new_user

# Endpoint pour se connecter et obtenir un token JWT
@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db.utilisateur.find_unique(where={"email": form_data.username})
    if not user or not verify_password(form_data.password, user.mot_de_passe):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants invalides",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Créer un token JWT
    access_token_expires = timedelta(hours=1)  # Expire après 1 heure
    access_token = create_access_token(
        data={"sub": str(user.id_utilisateur)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
