from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings
from app.core.prisma import prisma

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Token invalide.")
        user = await prisma.utilisateur.find_unique(where={"id_utilisateur": int(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé.")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide.")
