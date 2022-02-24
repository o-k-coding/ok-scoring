import json
from functools import wraps
import os
from jose import jwt
from ok_scoring.model.errors.auth_error import AuthError
from flask import _request_ctx_stack, request
import urllib.request

AUTH_AUDIENCE = os.environ.get('AUTH_AUDIENCE')
AUTH_ISSUER = os.environ.get('AUTH_ISSUER')
AUTH_ALGORITHMS = ['RS256']
# Auth should only be not required if we are in an automated testing environment
AUTH_REQUIRED: bool = os.environ.get("AUTH_REQUIRED") != "False"

# Code taken from this tutorial https://auth0.com/docs/quickstart/backend/python/01-authorization#protect-api-endpoints

def get_token_auth_header():
    """Obtains the Access Token from the Authorization Header
    """
    # Auth is turned off
    if not AUTH_REQUIRED:
        print('get_token_auth_header: AUTH_REQUIRED is false apparently, skipping auth check')
        return
    auth = request.headers.get("Authorization", None)
    if not auth:
        raise AuthError({"code": "authorization_header_missing",
                        "description":
                            "Authorization header is expected"}, 401)

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must start with"
                            " Bearer"}, 401)
    elif len(parts) == 1:
        raise AuthError({"code": "invalid_header",
                        "description": "Token not found"}, 401)
    elif len(parts) > 2:
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must be"
                            " Bearer token"}, 401)

    token = parts[1]
    return token

def requires_auth(f):
    """Determines if the Access Token is valid
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        # Auth is turned off
        if not AUTH_REQUIRED:
            print('@requires_auth: AUTH_REQUIRED is false apparently, skipping auth check')
            return f(*args, **kwargs)
        token = get_token_auth_header()
        rsa_key = build_rsa_key(token)
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=AUTH_ALGORITHMS,
                    audience=AUTH_AUDIENCE,
                    issuer=AUTH_ISSUER
                )
            except jwt.ExpiredSignatureError:
                raise AuthError({"code": "token_expired",
                                "description": "token is expired"}, 401)
            except jwt.JWTClaimsError:
                raise AuthError({"code": "invalid_claims",
                                "description":
                                    "incorrect claims,"
                                    "please check the audience and issuer"}, 401)
            except Exception:
                raise AuthError({"code": "invalid_header",
                                "description":
                                    "Unable to parse authentication"
                                    " token."}, 401)

            _request_ctx_stack.top.current_user = payload
            return f(*args, **kwargs)
        raise AuthError({"code": "invalid_header",
                        "description": "Unable to find appropriate key"}, 401)
    return decorated

def requires_scope(required_scope):
    """Determines if the required scope is present in the Access Token
    Args:
        required_scope (str): The scope required to access the resource
    """
    # Auth is turned off
    if not AUTH_REQUIRED:
        print('requires_scope: AUTH_REQUIRED is false apparently, skipping auth check')
        return False
    token = get_token_auth_header()
    unverified_claims = jwt.get_unverified_claims(token)
    if unverified_claims.get("scope"):
            token_scopes = unverified_claims["scope"].split()
            for token_scope in token_scopes:
                if token_scope == required_scope:
                    return True
    return False


def build_rsa_key(token: str) -> dict:
    # Not sure what this is used for
    jsonurl = urllib.request.urlopen(f'{AUTH_ISSUER}.well-known/jwks.json')
    jwks = json.loads(jsonurl.read())
    unverified_header = jwt.get_unverified_header(token)
    rsa_key = {}
    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"]
            }
    return rsa_key


def is_token_expired(token, rsa_key) -> bool:
    try:
        jwt.decode(
            token,
            rsa_key,
            algorithms=AUTH_ALGORITHMS,
            audience=AUTH_AUDIENCE,
            issuer=AUTH_ISSUER
        )
    except jwt.ExpiredSignatureError:
        return True
    return False
