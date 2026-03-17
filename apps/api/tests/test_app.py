import pytest
from fastapi.testclient import TestClient

# Simple test to check basic discovery
def test_sanity_check():
    """Basic sanity check to verify that pytest is working."""
    assert True

def test_read_openapi_json(client: TestClient):
    """
    Test if the OpenAPI schema is accessible.
    This also serves as a basic test for the client fixture.
    """
    response = client.get("/api/openapi.json")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/json"
    assert "info" in response.json()
    assert "paths" in response.json()

def test_health_check(client: TestClient, mock_connections):
    """
    Test the health check endpoint.
    This verifies that the application can report its health status.
    """
    response = client.get("/api/health")
    assert response.status_code == 200
    health_data = response.json()
    assert health_data["status"] == "ok"
    assert health_data["database"] == "connected"
