from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.core.prisma import prisma
from app.api.routes import talks, auth, plannings, salles, roles, utilisateurs

@asynccontextmanager
async def lifespan(app: FastAPI):
    await prisma.connect()
    yield
    await prisma.disconnect()


app = FastAPI(title="TalkMaster API", lifespan=lifespan,debug=False)

# Routes
app.include_router(utilisateurs.router, prefix="/api/utilisateurs", tags=["Utilisateurs"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(talks.router, prefix="/api/talks", tags=["Talks"])
app.include_router(plannings.router, prefix="/api/plannings", tags=["Plannings"])
app.include_router(salles.router, prefix="/api/salles", tags=["Salles"])
app.include_router(roles.router, prefix="/api/roles", tags=["Roles"])