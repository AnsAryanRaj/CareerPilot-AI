from fastapi import status

class AppException(Exception):
    """Base exception class for CareerPilot AI errors."""
    def __init__(self, message: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR, code: str = "INTERNAL_SERVER_ERROR"):
        self.message = message
        self.status_code = status_code
        self.code = code
        super().__init__(self.message)

class AuthException(AppException):
    """Raised when authentication or authorization fails."""
    def __init__(self, message: str = "Authentication failed", status_code: int = status.HTTP_401_UNAUTHORIZED, code: str = "UNAUTHORIZED"):
        super().__init__(message, status_code, code)

class DatabaseException(AppException):
    """Raised when firestore operations fail."""
    def __init__(self, message: str = "Database operation failed", status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR, code: str = "DATABASE_ERROR"):
        super().__init__(message, status_code, code)

class AIException(AppException):
    """Raised when Gemini API integration fails or outputs unexpected structure."""
    def __init__(self, message: str = "AI generation failed", status_code: int = status.HTTP_502_BAD_GATEWAY, code: str = "AI_ERROR"):
        super().__init__(message, status_code, code)

class ResourceNotFoundException(AppException):
    """Raised when a requested resource is not found."""
    def __init__(self, message: str = "Resource not found", status_code: int = status.HTTP_404_NOT_FOUND, code: str = "RESOURCE_NOT_FOUND"):
        super().__init__(message, status_code, code)

class ValidationException(AppException):
    """Raised when request payload validation fails or input is unacceptable."""
    def __init__(self, message: str = "Validation failed", status_code: int = status.HTTP_400_BAD_REQUEST, code: str = "VALIDATION_ERROR"):
        super().__init__(message, status_code, code)
