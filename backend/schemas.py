from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime
from models import PlanEnum, StatusEnum, RoleEnum

# =======================
# Common
# =======================
class UserBase(BaseModel):
    email: EmailStr
    role: RoleEnum
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    last_login_at: Optional[datetime]

    class Config:
        from_attributes = True

# =======================
# Schools
# =======================
class SchoolBase(BaseModel):
    name: str
    code: str
    plan: PlanEnum
    status: StatusEnum = StatusEnum.active

class SchoolCreate(SchoolBase):
    pass

class SchoolUpdate(BaseModel):
    name: Optional[str] = None
    plan: Optional[PlanEnum] = None
    status: Optional[StatusEnum] = None

class SchoolResponse(SchoolBase):
    id: UUID
    created_at: datetime
    # We might want to include user count here
    
    class Config:
        from_attributes = True

# =======================
# School Admins
# =======================
class SchoolAdminCreate(BaseModel):
    email: EmailStr
    password: str
    name: str # Not in DB User model explicitly but useful, using email/role for now
    school_id: UUID

class SchoolAdminResponse(BaseModel):
    id: UUID
    user: UserResponse
    school: SchoolResponse
    created_at: datetime

    class Config:
        from_attributes = True

# =======================
# Dashboard
# =======================
class DashboardStats(BaseModel):
    total_schools: int
    active_schools: int
    total_users: int

class RecentActivityItem(BaseModel):
    description: str
    time: datetime

# =======================
# Audit Logs
# =======================
# Schema for reading logs
class AuditLogBase(BaseModel):
    action_type: str
    entity_type: str
    entity_id: str
    metadata: Dict[str, Any] = {}

class AuditLogResponse(AuditLogBase):
    id: UUID
    actor_user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
