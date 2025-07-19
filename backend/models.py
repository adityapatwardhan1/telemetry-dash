# Imports
from sqlalchemy import Column, DateTime, Float, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    role: Mapped[str] = mapped_column(String, nullable=False)

class Telemetry(Base):
    __tablename__ = "telemetry"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    device_id: Mapped[int] = mapped_column(Integer, nullable=False)
    battery: Mapped[float] = mapped_column(Float)
    temperature: Mapped[float] = mapped_column(Float)
    gps_lat: Mapped[str] = mapped_column(String)
    gps_long: Mapped[str] = mapped_column(String)
    speed: Mapped[float] = mapped_column(Float)
    cpu_usage: Mapped[float] = mapped_column(Float)
    timestamp = mapped_column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
