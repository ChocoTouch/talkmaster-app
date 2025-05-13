from pydantic import BaseModel
from datetime import date, time
from uuid import UUID

class PlanningBase(BaseModel):
    salle_id: UUID
    date: date
    heure: time

    class Config:
        from_attributes = True

# Modèle de sortie pour afficher un planning
class PlanningOut(PlanningBase):
    talk_id: int
    talk_titre: str
    talk_description: str
    talk_statut: str
    salle_nom: str

    class Config:
        from_attributes = True

# Modèle de mise à jour pour un planning
class PlanningUpdate(BaseModel):
    salle_id: UUID
    date: date
    heure: time

    class Config:
        from_attributes = True
