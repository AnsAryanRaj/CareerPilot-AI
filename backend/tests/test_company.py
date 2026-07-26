def test_list_company_prep(client):
    """Test retrieving list of company preparation dashboard insights."""
    response = client.get("/api/v1/company/prep")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "companyName" in data[0]
    assert "checklist" in data[0]

def test_generate_company_prep(client):
    """Test generating a target guide for a company using the API."""
    payload = {
        "companyName": "Google",
        "role": "Software Engineer"
    }
    response = client.post("/api/v1/company/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["companyName"] == "Google"
    assert data["role"] == "Software Engineer"
    assert "companyInsights" in data
