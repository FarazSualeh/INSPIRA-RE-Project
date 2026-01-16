import os
import uuid
import enum
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Boolean, ForeignKey, DateTime, Integer, Enum, Text, text
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.engine.url import make_url

# ======================================================
# CONFIGURATION
# ======================================================
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:admin@localhost:5432/inspira_db")

Base = declarative_base()

# ======================================================
# ENUMS
# ======================================================
class RoleEnum(str, enum.Enum):
    platform_admin = "platform_admin"
    school_admin = "school_admin"
    teacher = "teacher"
    student = "student"

class PlanEnum(str, enum.Enum):
    free = "free"
    basic = "basic"
    custom = "custom"

class StatusEnum(str, enum.Enum):
    active = "active"
    inactive = "inactive"

# ======================================================
# MODELS
# ======================================================

class School(Base):
    __tablename__ = "schools"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)
    plan = Column(Enum(PlanEnum), nullable=False)
    status = Column(Enum(StatusEnum), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    users = relationship("User", back_populates="school")
    admins = relationship("SchoolAdmin", back_populates="school")
    settings = relationship("SchoolSettings", back_populates="school", uselist=False)


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)
    school_id = Column(UUID(as_uuid=True), ForeignKey("schools.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login_at = Column(DateTime, nullable=True)

    # Relationships
    school = relationship("School", back_populates="users")
    school_admin_profile = relationship("SchoolAdmin", back_populates="user", uselist=False)
    audit_logs = relationship("AuditLog", back_populates="actor_user")


class SchoolAdmin(Base):
    __tablename__ = "school_admins"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    school_id = Column(UUID(as_uuid=True), ForeignKey("schools.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="school_admin_profile")
    school = relationship("School", back_populates="admins")


class SchoolSettings(Base):
    __tablename__ = "school_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    school_id = Column(UUID(as_uuid=True), ForeignKey("schools.id"), nullable=False, unique=True)
    feature_flags = Column(JSON, default=dict)
    limits = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    school = relationship("School", back_populates="settings")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actor_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    action_type = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=False)
    metadata_info = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    actor_user = relationship("User", back_populates="audit_logs")


# ======================================================
# DB CREATION SCRIPT
# ======================================================

def create_database():
    """
    1. Connects to the default 'postgres' database to create the target database if missing.
    2. Then connects to the target database to create tables.
    """
    try:
        url = make_url(DATABASE_URL)
        target_db_name = url.database
        
        # Connect to 'postgres' database to check/create target DB
        # We need AUTOCOMMIT isolation level to run CREATE DATABASE
        admin_url = url.set(database="postgres")
        print(f"Connecting to system database to check for '{target_db_name}'...")
        
        admin_engine = create_engine(admin_url, isolation_level="AUTOCOMMIT")
        with admin_engine.connect() as conn:
            # Check if database exists
            result = conn.execute(text(f"SELECT 1 FROM pg_database WHERE datname = '{target_db_name}'"))
            if not result.scalar():
                print(f"Database '{target_db_name}' does not exist. Creating...")
                conn.execute(text(f"CREATE DATABASE {target_db_name}"))
                print(f"✅ Database '{target_db_name}' created.")
            else:
                print(f"Database '{target_db_name}' already exists.")

        # Now connect to the new database and create tables
        print(f"Connecting to: {DATABASE_URL}...")
        engine = create_engine(DATABASE_URL)
        Base.metadata.create_all(engine)
        print("✅ Database tables created successfully.")
        
        print("\nCreated Tables:")
        for table_name in Base.metadata.tables:
            print(f"- {table_name}")
            
    except Exception as e:
        print(f"❌ Error creating database: {e}")

if __name__ == "__main__":
    create_database()
