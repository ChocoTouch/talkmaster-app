from pydantic import BaseModel
from enum import Enum
from typing import Optional
from app.models.utilisateur import UtilisateurOut
import datetime

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


class TalkOut(BaseModel):
    id_talk: int
    titre: str
    sujet: str
    description: str
    duree: int
    niveau: Niveau
    statut: str
    id_conferencier: int
    conferencier: Optional[UtilisateurOut]
    date: Optional[datetime.date] = None
    heure: Optional[datetime.time] = None

    class Config:
        from_attributes = True
