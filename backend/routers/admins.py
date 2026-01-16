from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import database
import models
import schemas
from passlib.context import CryptContext

router = APIRouter(
    prefix="/admins",
    tags=["admins"]
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

@router.get("/", response_model=List[schemas.SchoolAdminResponse])
def read_admins(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    # Join User and SchoolAdmin to filter correctly if needed, or just list SchoolAdmins
    admins = db.query(models.SchoolAdmin).offset(skip).limit(limit).all()
    # Pydantic schema expects 'user' and 'school' fields; SQLAlchemy relationship handles lazy loading
    return admins

@router.post("/", response_model=schemas.SchoolAdminResponse)
def create_admin(admin: schemas.SchoolAdminCreate, db: Session = Depends(database.get_db)):
    # 1. Create User
    db_user = models.User(
        email=admin.email,
        password_hash=get_password_hash(admin.password),
        role=models.RoleEnum.school_admin,
        school_id=admin.school_id,
        is_active=True
    )
    db.add(db_user)
    db.commit() # Commit to get ID
    db.refresh(db_user)

    # 2. Create SchoolAdmin Link
    db_admin = models.SchoolAdmin(
        user_id=db_user.id,
        school_id=admin.school_id
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)

    return db_admin

@router.put("/{admin_id}/disable", response_model=schemas.UserResponse)
def disable_admin(admin_id: UUID, db: Session = Depends(database.get_db)):
    # Query SchoolAdmin first to find the user
    school_admin = db.query(models.SchoolAdmin).filter(models.SchoolAdmin.id == admin_id).first()
    if not school_admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    user = school_admin.user
    user.is_active = False
    db.commit()
    db.refresh(user)
    
    return user
