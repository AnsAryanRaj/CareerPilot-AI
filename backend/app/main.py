import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.logging import setup_logging
from app.core.exceptions import AppException
from app.core.security import initialize_firebase
from app.api.v1.api import api_router

# Initialize Logging
setup_logging()
logger = logging.getLogger("app")

# Initialize Firebase SDK
initialize_firebase()

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for CareerPilot AI Placement Prep Platform",
    version="1.0.0",
)

# CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production config if necessary
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    """Handles structured custom exceptions."""
    logger.warning("AppException occurred: %s (Status: %d, Code: %s)", exc.message, exc.status_code, exc.code)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.__class__.__name__,
            "message": exc.message,
            "code": exc.code
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handles unhandled system exceptions and prevents leakage of raw tracebacks."""
    logger.exception("An unhandled exception occurred: %s", str(exc))
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "InternalServerError",
            "message": "An unexpected error occurred. Please try again later.",
            "code": "INTERNAL_SERVER_ERROR"
        }
    )

# Root Endpoint
@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "healthy", "app": settings.APP_NAME, "env": settings.APP_ENV}

# Register Router
app.include_router(api_router, prefix="/api/v1")
