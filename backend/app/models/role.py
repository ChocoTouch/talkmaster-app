from pydantic import BaseModel
from enum import Enum


class NomRole(str, Enum):
    CONFERENCIER = "CONFERENCIER"
    ORGANISATEUR = "ORGANISATEUR"
    PUBLIC = "PUBLIC"
    ADMINISTRATEUR = "ADMINISTRATEUR"


class RoleBase(BaseModel):
    nom_role: NomRole


class RoleCreate(RoleBase):
    pass


class RoleOut(RoleBase):
    id_role: int

    class Config:
        from_attributes = True
