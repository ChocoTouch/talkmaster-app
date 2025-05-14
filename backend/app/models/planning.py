from pydantic import BaseModel
from datetime import date, time


class PlanningBase(BaseModel):
    salle_id: int
    date: date
    heure: time

    class Config:
        from_attributes = True


# Modèle de sortie pour afficher un planning
class PlanningOut(BaseModel):
    id_planning: int
    date: str  
    heure: str 
    talk_id: int
    talk_titre: str
    talk_description: str
    talk_statut: str
    salle_nom: str

    class Config:
        from_attributes = True


# Modèle de mise à jour pour un planning
class PlanningUpdate(BaseModel):
    salle_id: int
    date: date
    heure: time

    class Config:
        from_attributes = True
