# from fastapi import Depends, Security
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# from app.core.security import verify_firebase_token
# from app.core.exceptions import AuthException

# # Use FastAPI's security scheme to extract the Authorization: Bearer <token> header
# security_scheme = HTTPBearer(auto_error=False)

# # def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security_scheme)) -> dict:
# #     """FastAPI dependency to authenticate requests using Firebase Auth.
# #     Returns the decoded token containing 'uid', 'email', etc.
# #     """
# #     if not credentials:
# #         raise AuthException(
# #             message="Bearer token is missing from the Authorization header",
# #             status_code=401,
# #             code="CREDENTIALS_MISSING"
# #         )
    
# #     token = credentials.credentials
# #     return verify_firebase_token(token)


# # demo code added
# def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security_scheme)) -> dict:
#     print("===== AUTH DEBUG =====", flush=True)
#     print("Credentials:", credentials, flush=True)

#     if not credentials:
#         raise AuthException(
#             message="Bearer token is missing from the Authorization header",
#             status_code=401,
#             code="CREDENTIALS_MISSING"
#         )

#     print("Scheme:", credentials.scheme, flush=True)
#     print("Token length:", len(credentials.credentials), flush=True)

#     return verify_firebase_token(credentials.credentials)

#temporary debugging --------------------------------------------------

from fastapi import Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import verify_firebase_token
from app.core.exceptions import AuthException
import traceback

security_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
) -> dict:

    print("\n========== AUTH DEBUG ==========", flush=True)

    if credentials is None:
        print("❌ No Authorization header received", flush=True)
        raise AuthException(
            message="Bearer token is missing from the Authorization header",
            status_code=401,
            code="CREDENTIALS_MISSING",
        )

    print("Scheme :", credentials.scheme, flush=True)
    print("Token Length :", len(credentials.credentials), flush=True)
    print("Token Start :", credentials.credentials[:40], flush=True)

    try:
        decoded = verify_firebase_token(credentials.credentials)

        print("✅ Authentication Successful", flush=True)
        print("UID :", decoded.get("uid"), flush=True)
        print("Email :", decoded.get("email"), flush=True)
        print("=================================\n", flush=True)

        return decoded

    except Exception as e:
        print("\n========== VERIFY FAILED ==========", flush=True)
        print(type(e).__name__, flush=True)
        print(str(e), flush=True)
        traceback.print_exc()
        print("===================================\n", flush=True)

        raise