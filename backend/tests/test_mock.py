def test_start_mock_interview(client):
    """Test mock session generation creates id and returns first question."""
    payload = {
        "role": "Frontend Engineer",
        "company": "Stripe"
    }
    response = client.post("/api/v1/interviews/start", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "sessionId" in data
    assert "firstQuestion" in data

def test_submit_interview_answer(client):
    """Test submitting answer response returns next question or status indicators."""
    session_id = "mock_session_abc"
    payload = {
        "answer": "Using ref hooks and tracking component bounds."
    }
    response = client.post(f"/api/v1/interviews/{session_id}/answer", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "isCompleted" in data
    assert "nextQuestion" in data or data["isCompleted"] is True

def test_evaluate_interview(client):
    """Test interview completion yields STAR metrics assessments."""
    session_id = "mock_session_abc"
    response = client.post(f"/api/v1/interviews/{session_id}/evaluate")
    assert response.status_code == 200
    data = response.json()
    assert "overallScore" in data
    assert "starFrameworkScore" in data
    assert "Situation" in data["starFrameworkScore"]
