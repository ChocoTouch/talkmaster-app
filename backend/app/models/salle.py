from pydantic import BaseModel


class SalleBase(BaseModel):
    nom_salle: str
    capacite: int


class SalleCreate(SalleBase):
    pass


class SalleOut(SalleBase):
    id_salle: int

    class Config:
        from_attributes = True
