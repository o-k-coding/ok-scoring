import os
from ok_scoring.ok_scoring_config import get_api_url
import requests

from e2e_utils import test_auth_token


def test_unauthenticated_health():
  api_url = get_api_url()
  health_response = requests.get(f'{api_url}/health')
  assert health_response.status_code == 201

  authenticated_health_response = requests.get(f'{api_url}/authenticated')
  assert authenticated_health_response.status_code == 401

def test_authenticated_health():
  access_token = test_auth_token.get_access_token()

  headers = {'Authorization': f'Bearer {access_token}'}
  api_url = get_api_url()
  health_response = requests.get(f'{api_url}/health', headers=headers)
  assert health_response.status_code == 201

  authenticated_health_response = requests.get(f'{api_url}/authenticated', headers=headers)
  assert authenticated_health_response.status_code == 201

def test_malformed_token():
  access_token = test_auth_token.get_access_token() + 'A'
  headers = {'Authorization': f'Bearer {access_token}'}
  api_url = get_api_url()
  health_response = requests.get(f'{api_url}/authenticated', headers=headers)
  assert health_response.status_code == 401

def non_auth0_token():
  access_token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ'
  headers = {'Authorization': f'Bearer {access_token}'}
  api_url = get_api_url()
  health_response = requests.get(f'{api_url}/authenticated', headers=headers)
  assert health_response.status_code == 401
