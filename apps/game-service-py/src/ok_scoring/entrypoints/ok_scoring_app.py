
import os
from flask import Flask, jsonify
from flask_cors import cross_origin
from ok_scoring.db.session import db_session
from ok_scoring.entrypoints.games.routes import games
from ok_scoring.model.errors.auth_error import AuthError
from src.ok_scoring.service.auth_service import requires_auth

app = Flask(__name__)

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


@app.route('/health', methods=['GET'])
@cross_origin(headers=["Content-Type", "Authorization"])
def health():
    return 'Hello OK Scoring', 201

@app.route('/authenticated', methods=['GET'])
@cross_origin(headers=["Content-Type", "Authorization"])
@requires_auth
def authenticated():
    return 'Hello Authenticated OK Scoring', 201

# TODO can I add a decorated function to handle and log all errors?
@app.errorhandler(AuthError)
def handle_auth_error(ex):
    print('Handling auth error')
    print(ex)
    return 'Auth Error', 401


app.register_blueprint(games, url_prefix='/games')
