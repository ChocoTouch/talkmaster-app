from dotenv import load_dotenv
import os

load_dotenv()


class Settings:
    PROJECT_NAME: str = "TalkMaster"
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY")


settings = Settings()
