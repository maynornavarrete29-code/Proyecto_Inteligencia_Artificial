from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from contextlib import contextmanager

from app.core.config import settings


# Create the SQLAlchemy engine using the settings.database_url
engine = create_engine(
    settings.database_url,
    echo=False,
    future=True,
)

# Session factory. Use expire_on_commit=False to avoid lazy-refresh surprises.
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False, future=True)

Base = declarative_base()


@contextmanager
def get_db():
    """Provide a transactional scope around a series of operations.

    This is a contextmanager alternative to the FastAPI dependency. Use it
    for scripts and tests that need a DB session.
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


# For FastAPI dependency injection (generator style) you can do:
def get_db_generator():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
