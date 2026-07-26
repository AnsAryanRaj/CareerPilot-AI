import logging
import logging.config
import os
from app.core.config import settings

# Create a logs directory inside the backend workspace if it doesn't exist
LOGS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "logs")
os.makedirs(LOGS_DIR, exist_ok=True)
LOG_FILE_PATH = os.path.join(LOGS_DIR, "app.log")

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s [%(levelname)s] %(name)s (%(filename)s:%(lineno)d): %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
        "json": {
            "format": '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "logger": "%(name)s", "file": "%(filename)s:%(lineno)d", "message": "%(message)s"}',
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    },
    "handlers": {
        "console": {
            "level": settings.LOG_LEVEL,
            "class": "logging.StreamHandler",
            "formatter": "standard",
        },
        "file": {
            "level": settings.LOG_LEVEL,
            "class": "logging.handlers.RotatingFileHandler",
            "filename": LOG_FILE_PATH,
            "maxBytes": 10485760,  # 10MB
            "backupCount": 5,
            "formatter": "standard",
            "encoding": "utf8",
        },
    },
    "loggers": {
        "": {  # root logger
            "handlers": ["console", "file"],
            "level": settings.LOG_LEVEL,
            "propagate": True,
        },
        "app": {
            "handlers": ["console", "file"],
            "level": settings.LOG_LEVEL,
            "propagate": False,
        },
        "uvicorn": {
            "handlers": ["console", "file"],
            "level": "INFO",
            "propagate": False,
        },
    },
}

def setup_logging():
    logging.config.dictConfig(LOGGING_CONFIG)
    logger = logging.getLogger("app")
    logger.info("Centralized logging has been initialized. Logs will rotate in %s", LOG_FILE_PATH)
