# OK Scoring Py

Repository for python backend for OK Scoring
Building in progress while reading through <https://www.cosmicpython.com/book/chapter_02_repository.html>
trying to apply concepts as much as possible as I go.

If you have venv installed

```bash
source .venv/bin/activate
```

then install requirements

```bash
pip install -r requirements.txt
```

## Database set up

postgres docker container

create a file called `docker-compose.env` in the root directory of the repo

add the following env variables to set up your database with whatever values you want

```bash
POSTGRES_PASSWORD={some password}
POSTGRES_USER={some username}
POSTGRES_DB={db name}
```

use docker compose to build the volume, images and containers needed to run and connect to the database
`docker-compose up -d`

<http://localhost:5005> to access the app locally

### pytest

Make sure to "Install" the ok-scoring module first

```bash
pip install -e ./src
```

to run e2e/integration/unit tests run `pytest`

to run e2e tests only

```bash
pytest ./tests/e2e
```

to run an individual e2e test

```bash
pytest ./tests/e2e/test_play_cribbage.py
# To run with logging sent to stdout instead of captured by pytest
pytest -s ./tests/e2e/test_auth.py
```

#### Running tests in docker container

IN PROGRESS, these directions do not fully work yet

This is especially helpful if the environment you are using doesn't have the correct version of python (looking at you wsl)

```bash
# First make sure the application container is running
docker-compose build && docker-compose up
# By default this will follow the logs, so open a new terminal then
# Here is an example, change out the command you want to execture
docker exec -ti ok-scoring-py-app "pytest"

## Or connect to a bash instance and run specific commands, for some reason specific test files don't work running from outside the container?
docker exec -ti ok-scoring-py-app bash
```

### Alembic migrations

Create a migration:

`alembic revision --autogenerate -m "Some message"`

The trick is to make sure that the mapper code is run before the alembic config code is via imports
if this is not the case, then the auto migrations will not pick up the data from the mappers

then run the migration

`alembic upgrade head`

## Delete Data

```sql
delete from "gameRules";
delete from "gameRulesV2";
delete from "scoreRound";
delete from "playerScoreHistory";
delete from game;
delete from player;
```

## TODO List

List of items I would like to accomplish

- refactor e2e tests to use a base test function that can be passed scenarios to test [x]
- Add passing real cribbage e2e test []
- Frontend app for managing game rules []
- Frontend app for playing game web []
- Performance testing to identify weak points []
- Security []
- Build the v2 API in fastify and performance test []
- Clean up existing service code and tests []
  - Rules service could really use some attention I think
- CI/CD []
- Add endpoints for []
  - duplicating a game
  - deleting data?
- ML and analytics package []
- Deploy on DO

## WSL notes

Using a specific version

```bash
sudo apt install python3.9
rm -rf .venv # if it exists
python3.9 -m venv .venv
source .venv/bin/activate
```

1645666696