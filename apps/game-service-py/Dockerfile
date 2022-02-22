FROM python:3.9-slim-buster

# Set up application directory
RUN mkdir ok-scoring

COPY requirements.txt /tmp/
RUN pip install -r /tmp/requirements.txt

COPY src/ /ok-scoring/src/
RUN pip install -e /ok-scoring/src

# Test specific commands
COPY tests/ /ok-scoring/tests/
# TODO move this to requirements?
RUN pip install pytest-helpers-namespace

# Migrations
COPY alembic.ini /ok-scoring/
COPY alembic/ /ok-scoring/alembic/

WORKDIR /ok-scoring
CMD alembic upgrade head && cd ./src && flask run --host=0.0.0.0 --port=80
