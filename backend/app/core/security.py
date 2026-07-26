# import firebase_admin
# from firebase_admin import credentials, auth
# import logging
# from app.core.config import settings
# from app.core.exceptions import AuthException

# logger = logging.getLogger("app")

# def initialize_firebase():
#     """Initializes the Firebase Admin SDK."""
#     if firebase_admin._apps:
#         return
    
#     try:
#         if settings.FIREBASE_CREDENTIALS_PATH:
#             cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
#             firebase_admin.initialize_app(cred)
#             logger.info("Firebase Admin initialized successfully using service account certificate.")
#         else:
#             # Pass explicit project ID option if available to support local verification
#             options = {}
#             if settings.FIREBASE_PROJECT_ID:
#                 options["projectId"] = settings.FIREBASE_PROJECT_ID
#             firebase_admin.initialize_app(options=options)
#             logger.info("Firebase Admin initialized successfully using project ID option: %s", settings.FIREBASE_PROJECT_ID)
#     except Exception as e:
#         logger.error("Failed to initialize Firebase Admin SDK: %s. Authentication and Firestore will be unavailable.", str(e))

# def verify_firebase_token(token: str) -> dict:
#     """Verifies a Firebase JWT ID token. Returns the decoded token payload."""
#     try:
#         # Verify the token
#         decoded_token = auth.verify_id_token(token)
#         return decoded_token
#     except Exception as e:
#         import traceback
#         logger.error("=== FIREBASE ID TOKEN VERIFICATION FAILED ===")
#         logger.error("Error: %s", str(e))
#         logger.error("Stack trace:\n%s", traceback.format_exc())
#         print("=== FIREBASE ID TOKEN VERIFICATION FAILED ===", flush=True)
#         print(f"Error: {e}", flush=True)
#         traceback.print_exc()
#         raise AuthException("Invalid or expired authentication token")


#demo code added
import firebase_admin
from firebase_admin import credentials, auth
import logging
from app.core.config import settings
from app.core.exceptions import AuthException

logger = logging.getLogger("app")


def initialize_firebase():
    """Initializes the Firebase Admin SDK."""
    if firebase_admin._apps:
        return

    try:
        if settings.FIREBASE_CREDENTIALS_PATH:
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin initialized successfully using service account certificate.")
        else:
            options = {}
            if settings.FIREBASE_PROJECT_ID:
                options["projectId"] = settings.FIREBASE_PROJECT_ID

            firebase_admin.initialize_app(options=options)
            logger.info(
                "Firebase Admin initialized successfully using project ID option: %s",
                settings.FIREBASE_PROJECT_ID,
            )

    except Exception as e:
        logger.error(
            "Failed to initialize Firebase Admin SDK: %s. Authentication and Firestore will be unavailable.",
            str(e),
        )


def verify_firebase_token(token: str) -> dict:
    """Verifies a Firebase JWT ID token. Returns the decoded token payload."""

    print("\n========== FIREBASE TOKEN DEBUG ==========", flush=True)
    print("verify_firebase_token() CALLED", flush=True)
    print("Token Length:", len(token), flush=True)
    print("Token Starts With:", token[:30], flush=True)

    try:
        decoded_token = auth.verify_id_token(token)

        print("✅ TOKEN VERIFIED SUCCESSFULLY", flush=True)
        print("UID:", decoded_token.get("uid"), flush=True)
        print("Email:", decoded_token.get("email"), flush=True)
        print("=========================================\n", flush=True)

        return decoded_token

    except Exception as e:
        import traceback

        logger.error("=== FIREBASE ID TOKEN VERIFICATION FAILED ===")
        logger.error("Error: %s", str(e))
        logger.error("Stack trace:\n%s", traceback.format_exc())

        print("\n========== FIREBASE VERIFY FAILED ==========", flush=True)
        print("Firebase Error:", str(e), flush=True)
        traceback.print_exc()
        print("===========================================\n", flush=True)

        raise AuthException("Invalid or expired authentication token")