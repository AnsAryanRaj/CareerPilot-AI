def test_generate_roadmap(client):
    """Test generating a personalized weeks study roadmap."""
    payload = {
        "targetRole": "Full-Stack Developer",
        "durationWeeks": 6,
        "currentSkills": ["React", "Python"]
    }
    response = client.post("/api/v1/roadmap/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "roadmapId" in data
    assert data["targetRole"] == "Full-Stack Developer"
    assert data["durationWeeks"] == 6
    assert isinstance(data["weeks"], list)
    assert len(data["weeks"]) > 0

def test_toggle_roadmap_task(client):
    """Test toggling checkable tasks in a roadmap schedule."""
    roadmap_id = "roadmap_xyz_123"
    task_id = "task_w1_1"
    payload = {
        "completed": True
    }
    response = client.patch(f"/api/v1/roadmap/{roadmap_id}/tasks/{task_id}", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["roadmapId"] == roadmap_id
    assert data["weeks"][0]["tasks"][0]["completed"] is True
