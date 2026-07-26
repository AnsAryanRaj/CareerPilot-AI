import io

def test_resume_analyze_success(client):
    """Test resume file upload analyze API yields graded metrics feedback."""
    file_content = b"Jane Doe - Software Engineer Resume content text"
    file_io = io.BytesIO(file_content)
    
    response = client.post(
        "/api/v1/resumes/analyze",
        files={"file": ("resume.txt", file_io, "text/plain")}
    )
    assert response.status_code == 200
    data = response.json()
    assert "resumeId" in data
    assert data["overallScore"] == 82
    assert "metrics" in data
    assert data["metrics"]["impact"] == 78
    assert "feedback" in data

def test_get_resume_history(client):
    """Test resume analysis history listing returns past files metadata."""
    response = client.get("/api/v1/resumes/history")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "fileName" in data[0]
