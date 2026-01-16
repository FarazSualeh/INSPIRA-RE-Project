from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import database
import models
import schemas

router = APIRouter(
    prefix="/schools",
    tags=["schools"]
)

@router.get("/", response_model=List[schemas.SchoolResponse])
def read_schools(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    schools = db.query(models.School).offset(skip).limit(limit).all()
    return schools

@router.post("/", response_model=schemas.SchoolResponse)
def create_school(school: schemas.SchoolCreate, db: Session = Depends(database.get_db)):
    db_school = models.School(**school.dict())
    db.add(db_school)
    db.commit()
    db.refresh(db_school)
    
    # Log the action (conceptually - in real app we'd have a logging service)
    # log_action(db, "create_school", "school", str(db_school.id))
    
    return db_school

@router.get("/{school_id}", response_model=schemas.SchoolResponse)
def read_school(school_id: UUID, db: Session = Depends(database.get_db)):
    school = db.query(models.School).filter(models.School.id == school_id).first()
    if school is None:
        raise HTTPException(status_code=404, detail="School not found")
    return school

@router.put("/{school_id}", response_model=schemas.SchoolResponse)
def update_school(school_id: UUID, school_update: schemas.SchoolUpdate, db: Session = Depends(database.get_db)):
    school = db.query(models.School).filter(models.School.id == school_id).first()
    if school is None:
        raise HTTPException(status_code=404, detail="School not found")
    
    for key, value in school_update.dict(exclude_unset=True).items():
        setattr(school, key, value)
    
    db.commit()
    db.refresh(school)
    return school
