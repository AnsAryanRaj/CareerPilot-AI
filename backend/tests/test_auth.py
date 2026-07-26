def test_health_check(client):
    """Test health check route yields 200 and healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_get_me_authorized(client):
    """Test authenticated profile retrieval yields valid user mapping info."""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert data["uid"] == "test_uid_9999"
    assert data["email"] == "test.student@university.edu"
    assert data["onboarded"] is True

def test_onboard_user_authorized(client):
    """Test user onboarding updates preferences data."""
    payload = {
        "targetRole": "Cloud Architect",
        "targetCompanies": ["AWS", "Google"],
        "experienceLevel": "Mid-Level"
    }
    response = client.post("/api/v1/auth/onboard", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["targetRole"] == "Cloud Architect"
    assert "AWS" in data["targetCompanies"]
    assert data["onboarded"] is True
