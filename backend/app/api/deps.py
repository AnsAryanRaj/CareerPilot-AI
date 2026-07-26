from fastapi import Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import verify_firebase_token
from app.core.exceptions import AuthException

# Use FastAPI's security scheme to extract the Authorization: Bearer <token> header
security_scheme = HTTPBearer(auto_error=False)

# def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security_scheme)) -> dict:
#     """FastAPI dependency to authenticate requests using Firebase Auth.
#     Returns the decoded token containing 'uid', 'email', etc.
#     """
#     if not credentials:
#         raise AuthException(
#             message="Bearer token is missing from the Authorization header",
#             status_code=401,
#             code="CREDENTIALS_MISSING"
#         )
    
#     token = credentials.credentials
#     return verify_firebase_token(token)


# demo code added
def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security_scheme)) -> dict:
    print("===== AUTH DEBUG =====", flush=True)
    print("Credentials:", credentials, flush=True)

    if not credentials:
        raise AuthException(
            message="Bearer token is missing from the Authorization header",
            status_code=401,
            code="CREDENTIALS_MISSING"
        )

    print("Scheme:", credentials.scheme, flush=True)
    print("Token length:", len(credentials.credentials), flush=True)

    return verify_firebase_token(credentials.credentials)