from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import database
import models
import schemas

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"]
)

@router.get("/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(database.get_db)):
    total_schools = db.query(models.School).count()
    active_schools = db.query(models.School).filter(models.School.status == models.StatusEnum.active).count()
    total_users = db.query(models.User).count()
    
    return schemas.DashboardStats(
        total_schools=total_schools,
        active_schools=active_schools,
        total_users=total_users
    )

@router.get("/activity", response_model=List[schemas.RecentActivityItem])
def get_recent_activity(db: Session = Depends(database.get_db)):
    # Fetch recent audit logs and format them as activity items
    logs = db.query(models.AuditLog).order_by(models.AuditLog.created_at.desc()).limit(5).all()
    
    activity = []
    for log in logs:
        # Construct a friendly description (e.g. "School created by Admin")
        desc = f"{log.action_type} on {log.entity_type} ({log.entity_id})"
        activity.append(schemas.RecentActivityItem(description=desc, time=log.created_at))
        
    return activity
