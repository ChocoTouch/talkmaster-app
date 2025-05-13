from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings
from fastapi import HTTPException, status, Depends
from prisma import Prisma

# Configurer le contexte pour le hashage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Fonction pour hasher un mot de passe
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# Fonction pour vérifier le mot de passe
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# Fonction pour créer un token JWT
def create_access_token(
    data: dict, expires_delta: timedelta = timedelta(hours=1)
) -> str:
    to_encode = data.copy()
    expire = datetime.now(datetime.timezone.utc) + expires_delta
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


# Décoder le token et récupérer l'utilisateur
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Impossible de valider les identifiants.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id: int = int(payload.get("sub"))
        if user_id is None:
            raise credentials_exception
    except (JWTError, ValueError):
        raise credentials_exception

    db = Prisma()
    await db.connect()
    user = await db.utilisateur.find_unique(where={"id_utilisateur": user_id})
    await db.disconnect()

    if user is None:
        raise credentials_exception
    return user
