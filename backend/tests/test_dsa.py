def test_get_dsa_topics(client):
    """Test retrieving DSA categories return structured lists of problems."""
    response = client.get("/api/v1/dsa/topics")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "topic" in data[0]
    assert "problems" in data[0]

def test_update_dsa_progress(client):
    """Test updating DSA problem states return success indicator."""
    payload = {
        "problemId": "two-sum",
        "status": "SOLVED",
        "code": "def twoSum(): pass",
        "language": "python",
        "notes": "Hash map strategy completed",
        "timeSpent": 240
    }
    response = client.post("/api/v1/dsa/update", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["problemId"] == "two-sum"
    assert data["status"] == "SOLVED"
