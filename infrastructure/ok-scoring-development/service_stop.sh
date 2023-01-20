#!/bin/bash

SERVICE_FILE=infrastructure/ok-scoring-development/OK.Scoring.$1.docker-compose.yml

echo 'stopping ' $SERVICE_FILE

docker-compose --env-file infrastructure/ok-scoring-development/.env.development -f $SERVICE_FILE down
