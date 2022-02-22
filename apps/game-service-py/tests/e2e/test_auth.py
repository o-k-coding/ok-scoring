import os
from ok_scoring.ok_scoring_config import get_api_url
import requests

def get_access_token():
  client_id = os.environ.get('AUTH_CLIENT_ID')
  client_secret = os.environ.get('AUTH_CLIENT_SECRET')
  auth_audience = os.environ.get('AUTH_AUDIENCE')
  auth_issuer = os.environ.get('AUTH_ISSUER')
  payload = f'grant_type=client_credentials&client_id={client_id}&client_secret={client_secret}&audience={auth_audience}'
  headers = { 'content-type': "application/x-www-form-urlencoded" }
  response = requests.post(f"{auth_issuer}oauth/token", data=payload, headers=headers)
  data = response.json()
  access_token = data['access_token']
  return access_token


def test_unauthenticated_health():
  api_url = get_api_url()
  health_response = requests.get(f'{api_url}/health')
  assert health_response.status_code == 201

  authenticated_health_response = requests.get(f'{api_url}/authenticated')
  assert authenticated_health_response.status_code == 401

def test_authenticated_health():
  # First log in and get a token

  token = get_access_token()

  headers = {'Authorization': f'Bearer {token}'}
  api_url = get_api_url()
  health_response = requests.get(f'{api_url}/health', headers=headers)
  assert health_response.status_code == 201

  authenticated_health_response = requests.get(f'{api_url}/authenticated', headers=headers)
  assert authenticated_health_response.status_code == 201

def test_malformed_token():
  return

def test_expired_token():
  return

def non_auth0_token():
  return
