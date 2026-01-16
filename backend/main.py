from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import dashboard, schools, admins, audit_logs

# Create Tables (useful for dev, though migrations are better long term)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EduQuest SuperAdmin API",
    description="API for managing Schools and System Admins",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost",
    "http://localhost:3000", # Access from React/Frontend
    "http://localhost:5173", # Vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(dashboard.router)
app.include_router(schools.router)
app.include_router(admins.router)
app.include_router(audit_logs.router)

@app.get("/")
def root():
    return {"message": "Welcome to EduQuest SuperAdmin API"}
