import json
import os
from typing import Optional

import requests
from dataclasses import dataclass
from ok_scoring.ok_scoring_config import get_api_url
from ok_scoring.service.auth_service import is_token_expired, build_rsa_key

@dataclass()
class PlayerScoreTestData:
    player_key: str
    score: int
    status: Optional[int] = 200


@dataclass()
class ScoreRoundTestData:
    scores: [PlayerScoreTestData]
    winning_player_key: str
    round_index: int


class Token:
  def  __init__(self):
    self.access_token = None

  def get_access_token(self):
    if self.access_token is None or is_token_expired(self.access_token, build_rsa_key(self.access_token)):
      client_id = os.environ.get('AUTH_CLIENT_ID')
      client_secret = os.environ.get('AUTH_CLIENT_SECRET')
      auth_audience = os.environ.get('AUTH_AUDIENCE')
      auth_issuer = os.environ.get('AUTH_ISSUER')
      payload = f'grant_type=client_credentials&client_id={client_id}&client_secret={client_secret}&audience={auth_audience}'
      headers = { 'content-type': "application/x-www-form-urlencoded" }
      response = requests.post(f"{auth_issuer}oauth/token", data=payload, headers=headers)
      data = response.json()
      token = data['access_token']
      self.access_token = token
    else:
      print('Using cached access_token')
    return self.access_token

test_auth_token = Token()


def get_authenticated_headers() -> dict:
    auth_token = test_auth_token.get_access_token()
    return {'Authorization': f'Bearer {auth_token}'}


# Returns game key
def create_test_game(game: str, players: [str]) -> dict:
    headers = get_authenticated_headers()
    base_schema_path = os.path.join(os.path.dirname(__file__), os.pardir, 'schemas')
    win_state_path = os.path.join(base_schema_path, f'{game}-win-state-schema.json')
    valid_state_path = os.path.join(base_schema_path, f'{game}-valid-state-schema.json')
    rules = {}
    with open(win_state_path) as win_state_file, open(valid_state_path) as valid_state_file:
        win_state_schema = json.load(win_state_file)
        valid_state_schema = json.load(valid_state_file)
        rules['winningSchema'] = win_state_schema
        rules['validStateSchema'] = valid_state_schema

    data = {
        'description': game,
        'players': players,
        'rules': rules
    }
    api_url = get_api_url()

    response = requests.post(f'{api_url}/games', json=data, headers=headers)
    assert response.status_code == 201
    game = response.json()['game']
    assert game['key'] is not None
    assert len(game['scoreHistory']) == len(players)

    return game


def play_test_game(rounds: [ScoreRoundTestData], game_key: str):
    headers = get_authenticated_headers()
    api_url = get_api_url()
    for r in rounds:
        for s in r.scores:
            player_key = s.player_key
            data = {'round_index': r.round_index, 'score': s.score}
            update_score_response = requests.post(f'{api_url}/games/{game_key}/scores/{player_key}', json=data, headers=headers)
            assert update_score_response.status_code == s.status

            if s.status == 200:
                game = update_score_response.json()['game']
                scoreHistory = game['scoreHistory']
                player_score_history = next((sh for sh in scoreHistory if sh['playerKey'] == player_key), None)
                print(f'checking round {r.round_index} for {player_key}')
                assert player_score_history['scores'][r.round_index]['roundScore'] == s.score

        # Validate
        fetch_game_response = requests.get(f'{api_url}/games/{game_key}', headers=headers)
        game = fetch_game_response.json()['game']

        assert game['winningPlayerKey'] == r.winning_player_key
