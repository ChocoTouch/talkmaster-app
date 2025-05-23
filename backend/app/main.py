from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.prisma import prisma
from app.api.routes import talks, auth, plannings, roles, rooms, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    await prisma.connect()
    yield
    await prisma.disconnect()


app = FastAPI(title="TalkMaster API", lifespan=lifespan, debug=False)

origins = [
    settings.WEBSITE_URL,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(users.router, prefix="/api/utilisateurs", tags=["Utilisateurs"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(talks.router, prefix="/api/talks", tags=["Talks"])
app.include_router(plannings.router, prefix="/api/plannings", tags=["Plannings"])
app.include_router(rooms.router, prefix="/api/salles", tags=["Salles"])
app.include_router(roles.router, prefix="/api/roles", tags=["Roles"])
