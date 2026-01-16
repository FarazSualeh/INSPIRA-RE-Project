from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import database
import models
import schemas

router = APIRouter(
    prefix="/audit-logs",
    tags=["audit-logs"]
)

@router.get("/", response_model=List[schemas.AuditLogResponse])
def read_audit_logs(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    logs = db.query(models.AuditLog).order_by(models.AuditLog.created_at.desc()).offset(skip).limit(limit).all()
    return logs
