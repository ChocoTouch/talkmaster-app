from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.core import prisma
from app.api.routes import talks,auth,plannings
from app.api.routes import utilisateurs


@asynccontextmanager
async def lifespan(app: FastAPI):
    await prisma.connect()
    yield
    await prisma.disconnect()


app = FastAPI(title="TalkMaster API", lifespan=lifespan)

# Routes
app.include_router(utilisateurs.router, prefix="/api/utilisateurs", tags=["Utilisateurs"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(talks.router, prefix="/api/talks", tags=["Talks"])
app.include_router(plannings.router, prefix="/api/plannings", tags=["Plannings"])