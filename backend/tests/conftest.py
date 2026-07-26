import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.api.deps import get_current_user

def mock_get_current_user() -> dict:
    """Mock the Firebase token parsing authentication filter, returning test user info."""
    return {
        "uid": "test_uid_9999",
        "email": "test.student@university.edu",
        "name": "Jane Test",
        "picture": "https://avatar.url/jane"
    }

@pytest.fixture(scope="module")
def client():
    """Returns a FastAPI TestClient with mocked authenticated sessions."""
    app.dependency_overrides[get_current_user] = mock_get_current_user
    with TestClient(app) as test_client:
        yield test_client
    # Reset overrides after module tests complete
    app.dependency_overrides.clear()
