from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.core import prisma
from app.api.routes import utilisateur

@asynccontextmanager
async def lifespan(app: FastAPI):
    await prisma.connect()
    yield
    await prisma.disconnect()

app = FastAPI(title="TalkMaster API", lifespan=lifespan)

# Routes
app.include_router(utilisateur.router, prefix="/api/utilisateurs", tags=["Utilisateurs"])
