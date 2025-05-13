from pydantic import BaseModel
from enum import Enum
from typing import Optional
from app.models.utilisateur import UtilisateurOut


class Niveau(str, Enum):
    DEBUTANT = "DEBUTANT"
    INTERMEDIAIRE = "INTERMEDIAIRE"
    AVANCE = "AVANCE"

class StatutTalk(str, Enum):
    EN_ATTENTE = "EN_ATTENTE"
    ACCEPTE = "ACCEPTE"
    REFUSE = "REFUSE"
    PLANIFIE = "PLANIFIE"

class TalkCreate(BaseModel):
    titre: str
    sujet: str
    description: str
    duree: int
    niveau: Niveau
    statut: StatutTalk = StatutTalk.EN_ATTENTE

    class Config:
        from_attributes = True

class TalkUpdate(BaseModel):
    titre: str
    sujet: str
    description: str
    duree: int
    niveau: Niveau

    class Config:
        from_attributes = True

class TalkOut(TalkCreate):
    id_talk: int
    id_conferencier: int
    conferencier: Optional[UtilisateurOut]

    class Config:
        from_attributes = True

