from pydantic import BaseModel, EmailStr


class UtilisateurBase(BaseModel):
    nom: str
    email: EmailStr


class UtilisateurCreate(UtilisateurBase):
    mot_de_passe: str
    id_role: int


class UtilisateurOut(UtilisateurBase):
    id_utilisateur: int
    id_role: int

    class Config:
        from_attributes = True

class UtilisateurOut(BaseModel):
    id_utilisateur: int
    nom: str
    email: EmailStr

    class Config:
        from_attributes = True