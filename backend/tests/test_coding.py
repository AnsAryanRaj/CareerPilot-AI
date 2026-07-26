def test_get_coding_problems(client):
    """Test listing coding challenges returns preloaded problems."""
    response = client.get("/api/v1/coding/problems")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert "problemId" in data[0]
    assert "title" in data[0]
    assert "difficulty" in data[0]


def test_get_coding_hint(client):
    """Test obtaining AI mentor hints for active playground challenges."""
    payload = {
        "problemId": "two-sum",
        "code": "def twoSum(nums, target): return []",
        "language": "python"
    }
    response = client.post("/api/v1/coding/hint", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "hint" in data
    assert len(data["hint"]) > 0


def test_run_coding_code(client):
    """Test code runner compiler output and assertion statuses."""
    payload = {
        "problemId": "two-sum",
        "code": "def twoSum(nums, target):\n    # Correct solution\n    lookup = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in lookup:\n            return [lookup[diff], i]\n        lookup[num] = i\n    return []",
        "language": "python"
    }
    response = client.post("/api/v1/coding/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "success" in data
    assert "stdout" in data


def test_submit_coding_solution(client):
    """Test submission evaluates with Big-O time and space complexity models."""
    payload = {
        "problemId": "two-sum",
        "code": "def twoSum(nums, target): return []",
        "language": "python"
    }
    response = client.post("/api/v1/coding/submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "evaluation" in data
    eval_data = data["evaluation"]
    assert "timeComplexity" in eval_data
    assert "spaceComplexity" in eval_data
    assert "review" in eval_data
    assert "refactoringTips" in eval_data
